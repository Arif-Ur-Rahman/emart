import "server-only";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";
import type { CartItem } from "@/lib/types";

export const GUEST_CART_COOKIE = "emart.guestCartId";

const include = {
  product: { select: { slug: true, name: true, image: true } },
  variant: { select: { id: true, label: true } },
} satisfies Prisma.CartItemInclude;

type CartItemRow = Prisma.CartItemGetPayload<{ include: typeof include }>;

function toCartItem(row: CartItemRow): CartItem {
  return {
    key: row.variantId ? `${row.productId}::${row.variantId}` : row.productId,
    productId: row.productId,
    slug: row.product.slug,
    variantId: row.variantId ?? undefined,
    name: row.product.name as CartItem["name"],
    variantLabel: row.variant?.label as CartItem["variantLabel"],
    image: row.product.image,
    price: row.price,
    quantity: row.quantity,
  };
}

/** Resolves the current cart id for reads, without creating one. */
export async function resolveCartId(): Promise<string | null> {
  const session = await auth();
  if (session?.user?.id) {
    const cart = await db.cart.findUnique({ where: { userId: session.user.id } });
    return cart?.id ?? null;
  }
  const cookieStore = await cookies();
  return cookieStore.get(GUEST_CART_COOKIE)?.value ?? null;
}

export async function getCart(): Promise<CartItem[]> {
  const cartId = await resolveCartId();
  if (!cartId) return [];

  const rows = await db.cartItem.findMany({ where: { cartId }, include });
  return rows.map(toCartItem);
}
