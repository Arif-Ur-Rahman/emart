import "server-only";
import { db } from "@/lib/db";
import type { Localized } from "@/lib/types";
import type { Prisma } from "@/generated/prisma/client";

const include = {
  address: true,
  items: true,
} satisfies Prisma.OrderInclude;

export type OrderWithDetails = Prisma.OrderGetPayload<{ include: typeof include }>;

export type OrderSummary = {
  id: string;
  status: string;
  total: number;
  itemCount: number;
  createdAt: Date;
};

export async function getOrderById(
  id: string,
  userId: string
): Promise<OrderWithDetails | null> {
  const order = await db.order.findUnique({ where: { id }, include });
  if (!order || order.userId !== userId) return null;
  return order;
}

export async function getOrdersForUser(userId: string): Promise<OrderSummary[]> {
  const orders = await db.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return orders.map((order) => ({
    id: order.id,
    status: order.status,
    total: order.total,
    itemCount: order.items.reduce((sum, i) => sum + i.quantity, 0),
    createdAt: order.createdAt,
  }));
}

export function orderItemName(name: Prisma.JsonValue): Localized {
  return name as Localized;
}
