import "server-only";
import { db } from "@/lib/db";
import type { OrderStatus, Prisma } from "@/generated/prisma/client";
import { canTransition } from "@/lib/order-status";

type Tx = Prisma.TransactionClient;

type StockLine = {
  productId: string | null;
  variantId: string | null;
  quantity: number;
};

/**
 * Atomically takes `quantity` units for one line. Returns false (and changes
 * nothing) when the product is hidden or doesn't have enough stock, so two
 * shoppers can't both buy the last unit.
 */
export async function reserveStock(tx: Tx, line: StockLine): Promise<boolean> {
  if (!line.productId) return false;

  const result = line.variantId
    ? await tx.sizeOption.updateMany({
        where: {
          id: line.variantId,
          productId: line.productId,
          stock: { gte: line.quantity },
          product: { active: true },
        },
        data: { stock: { decrement: line.quantity } },
      })
    : await tx.product.updateMany({
        where: { id: line.productId, active: true, stock: { gte: line.quantity } },
        data: { stock: { decrement: line.quantity } },
      });

  return result.count === 1;
}

/** Puts a cancelled order's units back on the shelf. */
async function restock(tx: Tx, lines: (StockLine & { variantLabel: unknown })[]) {
  for (const line of lines) {
    if (line.variantId) {
      await tx.sizeOption.updateMany({
        where: { id: line.variantId },
        data: { stock: { increment: line.quantity } },
      });
    } else if (line.productId && line.variantLabel == null) {
      // A line with a size label but no variantId had its size deleted since;
      // there's nothing to return the units to, so it's skipped.
      await tx.product.updateMany({
        where: { id: line.productId },
        data: { stock: { increment: line.quantity } },
      });
    }
  }
}

const TIMESTAMP_FOR: Partial<Record<OrderStatus, keyof Prisma.OrderUpdateManyMutationInput>> = {
  CONFIRMED: "confirmedAt",
  SHIPPED: "shippedAt",
  DELIVERED: "deliveredAt",
  CANCELLED: "cancelledAt",
};

export type TransitionResult = { ok: true } | { ok: false; error: string };

/**
 * Moves an order to `to` if the lifecycle allows it. Delivering an order
 * records the cash as collected; cancelling restocks its items.
 *
 * Pass `customerId` to restrict the change to that customer's own orders
 * and to the statuses in `allowedFrom`.
 */
export async function changeOrderStatus(
  orderId: string,
  to: OrderStatus,
  options: { customerId?: string; allowedFrom?: readonly OrderStatus[] } = {}
): Promise<TransitionResult> {
  return db.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (!order || (options.customerId && order.userId !== options.customerId)) {
      return { ok: false, error: "Order not found." };
    }

    if (
      !canTransition(order.status, to) ||
      (options.allowedFrom && !options.allowedFrom.includes(order.status))
    ) {
      return {
        ok: false,
        error: `This order is ${order.status.toLowerCase()} and can't be marked ${to.toLowerCase()}.`,
      };
    }

    const data: Prisma.OrderUpdateManyMutationInput = { status: to };
    const timestampField = TIMESTAMP_FOR[to];
    if (timestampField) Object.assign(data, { [timestampField]: new Date() });
    if (to === "DELIVERED") data.paymentStatus = "PAID";

    // Only apply if nobody changed the status since we read it.
    const updated = await tx.order.updateMany({
      where: { id: orderId, status: order.status },
      data,
    });
    if (updated.count === 0) {
      return { ok: false, error: "This order was just updated. Refresh and try again." };
    }

    if (to === "CANCELLED") await restock(tx, order.items);

    return { ok: true };
  });
}
