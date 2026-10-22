import Link from "next/link";
import { Search } from "lucide-react";
import { getOrderStatusCounts, isOrderStatus, listAdminOrders } from "@/lib/data/admin";
import { ORDER_STATUS_LABEL, formatDateTime, formatTaka } from "@/lib/admin-format";
import { formatOrderNumber } from "@/lib/order-status";
import { OrderStatus } from "@/generated/prisma/enums";
import { PageHeader } from "@/components/admin/page-header";
import { OrderStatusBadge, PaymentBadge } from "@/components/admin/order-status-badge";
import { Pagination } from "@/components/admin/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata = { title: "Orders" };

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const status = isOrderStatus(params.status) ? params.status : undefined;
  const q = params.q?.trim() || undefined;

  const [orders, counts] = await Promise.all([
    listAdminOrders({ status, q, page: Number(params.page) || 1 }),
    getOrderStatusCounts(),
  ]);
  const allCount = Object.values(counts).reduce((sum, n) => sum + n, 0);

  const tabHref = (value?: string) => {
    const search = new URLSearchParams();
    if (value) search.set("status", value);
    if (q) search.set("q", q);
    const query = search.toString();
    return query ? `/admin/orders?${query}` : "/admin/orders";
  };
  const tabs = [
    { value: undefined, label: "All", count: allCount },
    ...Object.values(OrderStatus).map((value) => ({
      value,
      label: ORDER_STATUS_LABEL[value],
      count: counts[value],
    })),
  ];

  return (
    <>
      <PageHeader title="Orders" description="Every order is cash on delivery." />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <Link
              key={tab.label}
              href={tabHref(tab.value)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition",
                status === tab.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-foreground/80 ring-1 ring-foreground/10 hover:bg-accent"
              )}
            >
              {tab.label} <span className="opacity-70">{tab.count}</span>
            </Link>
          ))}
        </div>
        <form action="/admin/orders" className="flex w-full gap-2 sm:w-auto">
          {status && <input type="hidden" name="status" value={status} />}
          <Input
            name="q"
            defaultValue={q}
            placeholder="Order #, phone, name or email"
            className="sm:w-64"
            aria-label="Search orders"
          />
          <Button type="submit" variant="outline" size="icon" aria-label="Search">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>

      <Card className="py-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Items</th>
                <th className="px-4 py-3 text-right font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Payment</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    No orders match.
                  </td>
                </tr>
              )}
              {orders.rows.map((order) => (
                <tr key={order.id} className="hover:bg-muted/40">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-semibold underline-offset-4 hover:underline"
                    >
                      {formatOrderNumber(order.number)}
                    </Link>
                    <p className="text-xs text-muted-foreground">{formatDateTime(order.createdAt)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{order.address?.fullName}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.address?.phone} · {order.address?.city}
                    </p>
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </td>
                  <td className="px-4 py-3 text-right font-medium tabular-nums">
                    {formatTaka(order.total)}
                  </td>
                  <td className="px-4 py-3">
                    <PaymentBadge status={order.paymentStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Pagination
        page={orders.page}
        pageCount={orders.pageCount}
        total={orders.total}
        basePath="/admin/orders"
        params={{ status, q }}
      />
    </>
  );
}
