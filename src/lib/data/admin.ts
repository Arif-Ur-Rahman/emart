import "server-only";
import { db } from "@/lib/db";
import type { OrderStatus, Prisma } from "@/generated/prisma/client";
import { OrderStatus as OrderStatusValues } from "@/generated/prisma/enums";
import { startOfStoreDay, startOfStoreMonth } from "@/lib/admin-format";
import { normalizeBdPhone } from "@/lib/phone";
import type { Localized } from "@/lib/types";

// Every function here is only called from admin pages, after verifyAdmin().

export const ADMIN_PAGE_SIZE = 25;
const LOW_STOCK_THRESHOLD = 3;

export type Paginated<T> = { rows: T[]; total: number; page: number; pageCount: number };

function paginate(page: number | undefined) {
  const current = Math.max(1, Math.floor(page ?? 1) || 1);
  return { current, skip: (current - 1) * ADMIN_PAGE_SIZE, take: ADMIN_PAGE_SIZE };
}

export function isOrderStatus(value: unknown): value is OrderStatus {
  return typeof value === "string" && value in OrderStatusValues;
}

// ---------------- Dashboard ----------------

export async function getPendingOrderCount(): Promise<number> {
  return db.order.count({ where: { status: "PENDING" } });
}

export async function getDashboardStats() {
  const [byStatus, ordersToday, outstanding, collectedThisMonth, lowStockSizes, lowStockProducts, recentOrders] =
    await Promise.all([
      db.order.groupBy({ by: ["status"], _count: { _all: true } }),
      db.order.count({ where: { createdAt: { gte: startOfStoreDay() } } }),
      db.order.aggregate({
        where: { status: { in: ["CONFIRMED", "SHIPPED"] } },
        _sum: { total: true },
      }),
      db.order.aggregate({
        where: { status: "DELIVERED", deliveredAt: { gte: startOfStoreMonth() } },
        _sum: { total: true },
        _count: { _all: true },
      }),
      db.sizeOption.findMany({
        where: { stock: { lte: LOW_STOCK_THRESHOLD }, product: { active: true } },
        select: {
          id: true,
          label: true,
          stock: true,
          product: { select: { id: true, name: true } },
        },
        orderBy: { stock: "asc" },
        take: 10,
      }),
      db.product.findMany({
        where: { active: true, stock: { lte: LOW_STOCK_THRESHOLD }, sizeOptions: { none: {} } },
        select: { id: true, name: true, stock: true },
        orderBy: { stock: "asc" },
        take: 10,
      }),
      listOrdersQuery({}, { skip: 0, take: 8 }),
    ]);

  const countFor = (status: OrderStatus) =>
    byStatus.find((row) => row.status === status)?._count._all ?? 0;

  const lowStock = [
    ...lowStockSizes.map((size) => ({
      key: size.id,
      productId: size.product.id,
      name: `${(size.product.name as Localized).en} — ${(size.label as Localized).en}`,
      stock: size.stock,
    })),
    ...lowStockProducts.map((product) => ({
      key: product.id,
      productId: product.id,
      name: (product.name as Localized).en,
      stock: product.stock,
    })),
  ]
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 10);

  return {
    ordersToday,
    pending: countFor("PENDING"),
    toShip: countFor("CONFIRMED"),
    inTransit: countFor("SHIPPED"),
    cashOutstanding: outstanding._sum.total ?? 0,
    collectedThisMonth: collectedThisMonth._sum.total ?? 0,
    deliveredThisMonth: collectedThisMonth._count._all,
    lowStock,
    recentOrders,
  };
}

// ---------------- Orders ----------------

const orderListSelect = {
  id: true,
  number: true,
  status: true,
  paymentStatus: true,
  total: true,
  createdAt: true,
  address: { select: { fullName: true, phone: true, city: true } },
  items: { select: { quantity: true } },
} satisfies Prisma.OrderSelect;

export type AdminOrderRow = Prisma.OrderGetPayload<{ select: typeof orderListSelect }>;

export type OrderFilters = { status?: OrderStatus; q?: string };

function orderWhere({ status, q }: OrderFilters): Prisma.OrderWhereInput {
  const where: Prisma.OrderWhereInput = {};
  if (status) where.status = status;

  const query = q?.trim();
  if (query) {
    const asNumber = Number(query.replace(/^#/, ""));
    where.OR = [
      ...(Number.isInteger(asNumber) && asNumber > 0 ? [{ number: asNumber }] : []),
      { address: { phone: { contains: normalizeBdPhone(query) } } },
      { address: { fullName: { contains: query, mode: "insensitive" } } },
      { user: { email: { contains: query, mode: "insensitive" } } },
    ];
  }
  return where;
}

function listOrdersQuery(filters: OrderFilters, range: { skip: number; take: number }) {
  return db.order.findMany({
    where: orderWhere(filters),
    select: orderListSelect,
    orderBy: { createdAt: "desc" },
    ...range,
  });
}

export async function listAdminOrders(
  filters: OrderFilters & { page?: number }
): Promise<Paginated<AdminOrderRow>> {
  const { current, skip, take } = paginate(filters.page);
  const [rows, total] = await Promise.all([
    listOrdersQuery(filters, { skip, take }),
    db.order.count({ where: orderWhere(filters) }),
  ]);
  return { rows, total, page: current, pageCount: Math.max(1, Math.ceil(total / take)) };
}

export async function getOrderStatusCounts(): Promise<Record<OrderStatus, number>> {
  const rows = await db.order.groupBy({ by: ["status"], _count: { _all: true } });
  const counts = Object.fromEntries(
    Object.keys(OrderStatusValues).map((status) => [status, 0])
  ) as Record<OrderStatus, number>;
  for (const row of rows) counts[row.status] = row._count._all;
  return counts;
}

export async function getAdminOrder(id: string) {
  return db.order.findUnique({
    where: { id },
    include: {
      address: true,
      items: { orderBy: { id: "asc" } },
      user: {
        select: { id: true, name: true, email: true, _count: { select: { orders: true } } },
      },
    },
  });
}

export type AdminOrder = NonNullable<Awaited<ReturnType<typeof getAdminOrder>>>;

// ---------------- Products ----------------

export async function listAdminProducts({ q, categoryId }: { q?: string; categoryId?: string }) {
  const query = q?.trim();
  const rows = await db.product.findMany({
    where: categoryId ? { categoryId } : undefined,
    include: {
      category: { select: { name: true } },
      sizeOptions: { select: { stock: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Names are JSON (en/bn), so search is done here rather than in SQL.
  // Fine for a single-brand catalog of hundreds of products.
  return rows
    .map((row) => ({
      id: row.id,
      slug: row.slug,
      name: row.name as Localized,
      image: row.image,
      category: row.category.name as Localized,
      price: row.price,
      active: row.active,
      featured: row.featured,
      sizeCount: row.sizeOptions.length,
      stock: row.sizeOptions.length
        ? row.sizeOptions.reduce((sum, size) => sum + size.stock, 0)
        : row.stock,
      outOfStockSizes: row.sizeOptions.filter((size) => size.stock === 0).length,
    }))
    .filter(
      (row) =>
        !query ||
        row.name.en.toLowerCase().includes(query.toLowerCase()) ||
        row.name.bn.includes(query) ||
        row.slug.includes(query.toLowerCase())
    );
}

export async function getAdminProduct(id: string) {
  return db.product.findUnique({
    where: { id },
    include: {
      sizeOptions: { orderBy: { position: "asc" } },
      _count: { select: { orderItems: true } },
    },
  });
}

// ---------------- Categories ----------------

export async function listAdminCategories() {
  const rows = await db.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { slug: "asc" },
  });
  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name as Localized,
    tagline: row.tagline as Localized,
    emoji: row.emoji,
    image: row.image,
    gradient: row.gradient,
    productCount: row._count.products,
  }));
}

export async function getAdminCategory(id: string) {
  return db.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  });
}

// ---------------- Customers ----------------

export async function listCustomers({ q, page }: { q?: string; page?: number }) {
  const { current, skip, take } = paginate(page);
  const query = q?.trim();
  const where: Prisma.UserWhereInput = query
    ? {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    db.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { orders: true } },
        orders: {
          select: { createdAt: true, address: { select: { phone: true } } },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take,
    }),
    db.user.count({ where }),
  ]);

  const spend = await db.order.groupBy({
    by: ["userId"],
    where: { userId: { in: users.map((u) => u.id) }, status: "DELIVERED" },
    _sum: { total: true },
  });
  const spendByUser = new Map(spend.map((row) => [row.userId, row._sum.total ?? 0]));

  return {
    rows: users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      orderCount: user._count.orders,
      lastOrderAt: user.orders[0]?.createdAt ?? null,
      phone: user.orders[0]?.address?.phone ?? null,
      spent: spendByUser.get(user.id) ?? 0,
    })),
    total,
    page: current,
    pageCount: Math.max(1, Math.ceil(total / take)),
  };
}
