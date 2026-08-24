"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/dal";
import { getCart, resolveCartId } from "@/lib/data/cart";
import { calculateShipping } from "@/lib/shipping";
import { capturePayment } from "@/lib/payments";

const AddressSchema = z.object({
  fullName: z.string().min(2, { error: "Enter your full name." }).trim(),
  phone: z.string().min(6, { error: "Enter a valid phone number." }).trim(),
  line1: z.string().min(3, { error: "Enter your street address." }).trim(),
  line2: z.string().trim().optional(),
  city: z.string().min(2, { error: "Enter your city." }).trim(),
  postalCode: z.string().min(3, { error: "Enter your postal code." }).trim(),
});

export type CheckoutFormState =
  | {
      errors?: Partial<Record<keyof z.infer<typeof AddressSchema>, string[]>>;
      message?: string;
    }
  | undefined;

export async function placeOrder(
  _prevState: CheckoutFormState,
  formData: FormData
): Promise<CheckoutFormState> {
  const { userId } = await verifySession();

  const validated = AddressSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    line1: formData.get("line1"),
    line2: formData.get("line2") || undefined,
    city: formData.get("city"),
    postalCode: formData.get("postalCode"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  // Never trust client-submitted line items or totals — re-read the cart
  // and recompute pricing from the database.
  const items = await getCart();
  if (items.length === 0) {
    return { message: "Your cart is empty." };
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;

  const cartId = await resolveCartId();

  const order = await db.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        userId,
        subtotal,
        shipping,
        total,
        address: { create: validated.data },
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            name: item.name,
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

  const payment = await capturePayment(order.id);
  if (payment.paid) {
    await db.order.update({ where: { id: order.id }, data: { status: "PAID" } });
  }

  redirect(`/orders/${order.id}`);
}
