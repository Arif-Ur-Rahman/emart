import Link from "next/link";
import { AlertTriangle, Banknote, CalendarCheck, Clock, PackageCheck, Truck } from "lucide-react";
import { getDashboardStats } from "@/lib/data/admin";
import { formatDateTime, formatTaka } from "@/lib/admin-format";
import { formatOrderNumber } from "@/lib/order-status";
import { PageHeader } from "@/components/admin/page-header";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function Stat({
  label,
  value,
  detail,
  icon: Icon,
  href,
  highlight,
}: {
  label: string;
  value: string | number;
  detail?: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  highlight?: boolean;
}) {
  const body = (
    <Card className={cn("h-full transition-shadow", href && "hover:shadow-md", highlight && "ring-2 ring-brand")}>
      <CardContent className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
          {detail && <p className="mt-0.5 text-xs text-muted-foreground">{detail}</p>}
        </div>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardContent>
    </Card>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <>
      <PageHeader title="Dashboard" description="Today at a glance. Times are Bangladesh time." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stat
          label="Awaiting confirmation"
          value={stats.pending}
          detail="Call to confirm, then mark confirmed"
          icon={Clock}
          href="/admin/orders?status=PENDING"
          highlight={stats.pending > 0}
        />
        <Stat
          label="Ready to ship"
          value={stats.toShip}
          detail="Confirmed, not yet handed to courier"
          icon={PackageCheck}
          href="/admin/orders?status=CONFIRMED"
        />
        <Stat
          label="Out for delivery"
          value={stats.inTransit}
          icon={Truck}
          href="/admin/orders?status=SHIPPED"
        />
        <Stat label="Orders today" value={stats.ordersToday} icon={CalendarCheck} />
        <Stat
          label="Cash to collect"
          value={formatTaka(stats.cashOutstanding)}
          detail="Confirmed and shipped orders"
          icon={Banknote}
        />
        <Stat
          label="Collected this month"
          value={formatTaka(stats.collectedThisMonth)}
          detail={`${stats.deliveredThisMonth} delivered order${stats.deliveredThisMonth === 1 ? "" : "s"}`}
          icon={Banknote}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent orders</CardTitle>
            <Link href="/admin/orders" className="text-sm text-muted-foreground hover:text-foreground">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {stats.recentOrders.length === 0 ? (
              <p className="py-6 text-center text-muted-foreground">No orders yet.</p>
            ) : (
              <ul className="divide-y">
                {stats.recentOrders.map((order) => (
                  <li key={order.id}>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="flex items-center justify-between gap-3 py-2.5 hover:bg-muted/50"
                    >
                      <div className="min-w-0">
                        <p className="font-medium">
                          {formatOrderNumber(order.number)}{" "}
                          <span className="font-normal text-muted-foreground">
                            · {order.address?.fullName}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground">{formatDateTime(order.createdAt)}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span className="font-medium tabular-nums">{formatTaka(order.total)}</span>
                        <OrderStatusBadge status={order.status} />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-brand" />
              Low stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.lowStock.length === 0 ? (
              <p className="py-6 text-center text-muted-foreground">Everything is well stocked.</p>
            ) : (
              <ul className="divide-y">
                {stats.lowStock.map((item) => (
                  <li key={item.key}>
                    <Link
                      href={`/admin/products/${item.productId}`}
                      className="flex items-center justify-between gap-3 py-2 hover:bg-muted/50"
                    >
                      <span className="truncate">{item.name}</span>
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold",
                          item.stock === 0 ? "bg-destructive/10 text-destructive" : "bg-amber-100 text-amber-900"
                        )}
                      >
                        {item.stock === 0 ? "Sold out" : `${item.stock} left`}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
