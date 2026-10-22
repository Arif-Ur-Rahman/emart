"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/dal";
import { changeOrderStatus, type TransitionResult } from "@/lib/orders";
import { CUSTOMER_CANCELLABLE } from "@/lib/order-status";

/** Lets a customer cancel their own order while it's still awaiting confirmation. */
export async function cancelMyOrder(orderId: string): Promise<TransitionResult> {
  const { userId } = await verifySession();

  const result = await changeOrderStatus(orderId, "CANCELLED", {
    customerId: userId,
    allowedFrom: CUSTOMER_CANCELLABLE,
  });

  if (result.ok) {
    revalidatePath(`/orders/${orderId}`);
    revalidatePath("/account/orders");
  }
  return result;
}
