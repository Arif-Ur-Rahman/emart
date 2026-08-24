"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { GUEST_CART_COOKIE } from "@/lib/data/cart";

const GUEST_CART_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/** Resolves the current cart id for writes, creating one if none exists yet. */
async function getOrCreateCartId(): Promise<string> {
  const session = await auth();
  const cookieStore = await cookies();

  if (session?.user?.id) {
    const cart = await db.cart.upsert({
      where: { userId: session.user.id },
      update: {},
      create: { userId: session.user.id },
    });
    return cart.id;
  }

  const existingId = cookieStore.get(GUEST_CART_COOKIE)?.value;
  if (existingId) {
    const cart = await db.cart.findUnique({ where: { id: existingId } });
    if (cart) return cart.id;
  }

  const cart = await db.cart.create({ data: {} });
  cookieStore.set(GUEST_CART_COOKIE, cart.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: GUEST_CART_MAX_AGE,
  });
  return cart.id;
}

function parseKey(key: string): { productId: string; variantId: string | null } {
  const [productId, variantId] = key.split("::");
  return { productId, variantId: variantId ?? null };
}

export async function addCartItem(
  productId: string,
  variantId: string | undefined,
  quantity: number
) {
  const product = await db.product.findUnique({
    where: { id: productId },
    include: { sizeOptions: true },
  });
  if (!product) throw new Error("Product not found");

  const variant = variantId
    ? product.sizeOptions.find((o) => o.id === variantId)
    : undefined;
  if (variantId && !variant) throw new Error("Variant not found");

  const price = variant?.price ?? product.price;
  const cartId = await getOrCreateCartId();

  const existing = await db.cartItem.findFirst({
    where: { cartId, productId, variantId: variantId ?? null },
  });

  if (existing) {
    await db.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
    });
  } else {
    await db.cartItem.create({
      data: { cartId, productId, variantId, quantity, price },
    });
  }

  revalidatePath("/", "layout");
}

export async function updateCartItemQty(key: string, quantity: number) {
  const cartId = await getOrCreateCartId();
  const { productId, variantId } = parseKey(key);

  if (quantity <= 0) {
    await db.cartItem.deleteMany({ where: { cartId, productId, variantId } });
  } else {
    await db.cartItem.updateMany({
      where: { cartId, productId, variantId },
      data: { quantity },
    });
  }

  revalidatePath("/", "layout");
}

export async function removeCartItem(key: string) {
  const cartId = await getOrCreateCartId();
  const { productId, variantId } = parseKey(key);
  await db.cartItem.deleteMany({ where: { cartId, productId, variantId } });
  revalidatePath("/", "layout");
}

export async function clearCart() {
  const cartId = await getOrCreateCartId();
  await db.cartItem.deleteMany({ where: { cartId } });
  revalidatePath("/", "layout");
}

/**
 * Folds a just-authenticated guest's cart into their account cart, then
 * clears the guest cookie. Called right after a confirmed login/signup.
 */
export async function mergeGuestCartIntoUser(userId: string) {
  const cookieStore = await cookies();
  const guestCartId = cookieStore.get(GUEST_CART_COOKIE)?.value;
  if (!guestCartId) return;

  const guestCart = await db.cart.findUnique({
    where: { id: guestCartId },
    include: { items: true },
  });
  if (!guestCart || guestCart.items.length === 0) {
    cookieStore.delete(GUEST_CART_COOKIE);
    return;
  }

  const userCart = await db.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
  });

  for (const item of guestCart.items) {
    const existing = await db.cartItem.findFirst({
      where: {
        cartId: userCart.id,
        productId: item.productId,
        variantId: item.variantId,
      },
    });
    if (existing) {
      await db.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + item.quantity },
      });
    } else {
      await db.cartItem.create({
        data: {
          cartId: userCart.id,
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          price: item.price,
        },
      });
    }
  }

  await db.cart.delete({ where: { id: guestCart.id } });
  cookieStore.delete(GUEST_CART_COOKIE);
}
