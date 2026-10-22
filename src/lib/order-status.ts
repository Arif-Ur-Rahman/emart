import type { OrderStatus } from "@/generated/prisma/enums";

/**
 * Cash-on-delivery order lifecycle. Each status lists the statuses an order
 * may move to next; DELIVERED and CANCELLED are final.
 */
export const ORDER_TRANSITIONS: Record<OrderStatus, readonly OrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED", "CANCELLED"],
  DELIVERED: [],
  CANCELLED: [],
};

/** The happy path, in order — used to draw the progress timeline. */
export const ORDER_STEPS = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"] as const;

/** Statuses a customer can still cancel from themselves. */
export const CUSTOMER_CANCELLABLE: readonly OrderStatus[] = ["PENDING"];

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return ORDER_TRANSITIONS[from].includes(to);
}

export function formatOrderNumber(number: number): string {
  return `#${number}`;
}
