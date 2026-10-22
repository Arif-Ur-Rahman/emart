"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/dal";
import { getCart, resolveCartId } from "@/lib/data/cart";
import { calculateShipping } from "@/lib/shipping";
import { reserveStock } from "@/lib/orders";
import { BD_MOBILE_RE, normalizeBdPhone } from "@/lib/phone";
import type { CartItem } from "@/lib/types";

const CheckoutSchema = z.object({
  fullName: z.string().trim().min(2, { error: "Enter your full name." }),
  phone: z
    .string()
    .transform(normalizeBdPhone)
    .pipe(
      z.string().regex(BD_MOBILE_RE, {
        error: "Enter a valid mobile number, e.g. 01712345678.",
      })
    ),
  line1: z.string().trim().min(3, { error: "Enter your street address." }),
  line2: z.string().trim().optional(),
  city: z.string().trim().min(2, { error: "Enter your city." }),
  postalCode: z.string().trim().min(3, { error: "Enter your postal code." }),
  note: z
    .string()
    .trim()
    .max(500, { error: "Keep delivery instructions under 500 characters." })
    .optional(),
});

type CheckoutField = keyof z.infer<typeof CheckoutSchema>;

export type CheckoutFormState =
  | {
      errors?: Partial<Record<CheckoutField, string[]>>;
      message?: string;
      /** Echoed back so the form keeps what the shopper typed after React resets it. */
      values?: Partial<Record<CheckoutField, string>>;
    }
  | undefined;

/** Thrown inside the order transaction to roll it back when a line can't be filled. */
class OutOfStockError extends Error {
  constructor(readonly item: CartItem) {
    super("Out of stock");
  }
}

async function outOfStockMessage(item: CartItem): Promise<string> {
  const source = item.variantId
    ? await db.sizeOption.findUnique({
        where: { id: item.variantId },
        select: { stock: true, product: { select: { active: true } } },
      })
    : await db.product.findUnique({
        where: { id: item.productId },
        select: { stock: true, active: true },
      });

  const active = source && ("product" in source ? source.product.active : source.active);
  const available = active ? source.stock : 0;
  const label = item.variantLabel ? `${item.name.en} (${item.variantLabel.en})` : item.name.en;

  return available > 0
    ? `Only ${available} left of ${label}. Please lower the quantity in your cart.`
    : `${label} is out of stock. Please remove it from your cart.`;
}

export async function placeOrder(
  _prevState: CheckoutFormState,
  formData: FormData
): Promise<CheckoutFormState> {
  const { userId } = await verifySession();

  const values = Object.fromEntries(
    (["fullName", "phone", "line1", "line2", "city", "postalCode", "note"] as const).map(
      (field) => [field, String(formData.get(field) ?? "")]
    )
  ) as Record<CheckoutField, string>;

  const validated = CheckoutSchema.safeParse({
    ...values,
    line2: values.line2 || undefined,
    note: values.note || undefined,
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors, values };
  }

  // Never trust client-submitted line items or totals — re-read the cart
  // and recompute pricing from the database.
  const items = await getCart();
  if (items.length === 0) {
    return { message: "Your cart is empty.", values };
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;

  const cartId = await resolveCartId();
  const { note, ...address } = validated.data;

  let order;
  try {
    order = await db.$transaction(async (tx) => {
      // Reserve stock first: if any line can't be filled the whole order
      // rolls back and nothing is decremented.
      for (const item of items) {
        const reserved = await reserveStock(tx, {
          productId: item.productId,
          variantId: item.variantId ?? null,
          quantity: item.quantity,
        });
        if (!reserved) throw new OutOfStockError(item);
      }

      const created = await tx.order.create({
        data: {
          userId,
          paymentMethod: "COD",
          subtotal,
          shipping,
          total,
          note,
          address: { create: address },
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              name: item.name,
              variantLabel: item.variantLabel,
              image: item.image,
              price: item.price,
              quantity: item.quantity,
            })),
          },
        },
      });

      if (cartId) {
        await tx.cartItem.deleteMany({ where: { cartId } });
      }

      return created;
    });
  } catch (error) {
    if (error instanceof OutOfStockError) {
      return { message: await outOfStockMessage(error.item), values };
    }
    throw error;
  }

  // Refresh the layout so the header cart badge and stock levels update.
  revalidatePath("/", "layout");
  redirect(`/orders/${order.id}`);
}
