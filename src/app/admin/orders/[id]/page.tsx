import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Phone } from "lucide-react";
import { getAdminOrder } from "@/lib/data/admin";
import { formatDateTime, formatTaka } from "@/lib/admin-format";
import { formatOrderNumber } from "@/lib/order-status";
import type { Localized } from "@/lib/types";
import { PageHeader } from "@/components/admin/page-header";
import { OrderStatusBadge, PaymentBadge } from "@/components/admin/order-status-badge";
import { OrderActions } from "@/components/admin/order-actions";
import { AdminNoteForm } from "@/components/admin/admin-note-form";
import { ProductImage } from "@/components/product/product-image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const order = await getAdminOrder((await params).id);
  return { title: order ? `Order ${formatOrderNumber(order.number)}` : "Order" };
}

export default async function AdminOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getAdminOrder(id);
  if (!order) notFound();

  const timeline = [
    { label: "Placed", at: order.createdAt },
    { label: "Confirmed", at: order.confirmedAt },
    { label: "Shipped", at: order.shippedAt },
    { label: "Delivered · cash collected", at: order.deliveredAt },
    { label: "Cancelled", at: order.cancelledAt },
  ].filter((step) => step.at);

  return (
    <>
      <Link
        href="/admin/orders"
        className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Orders
      </Link>
      <PageHeader
        title={`Order ${formatOrderNumber(order.number)}`}
        description={`Placed ${formatDateTime(order.createdAt)}`}
        actions={
          <div className="flex items-center gap-2">
            <PaymentBadge status={order.paymentStatus} />
            <OrderStatusBadge status={order.status} />
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Next step</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderActions orderId={order.id} status={order.status} total={order.total} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="divide-y">
                {order.items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 py-3 first:pt-0">
                    <ProductImage
                      src={item.image}
                      alt={(item.name as Localized).en}
                      sizes="48px"
                      className="h-12 w-12 shrink-0 rounded-lg"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">
                        {item.productId ? (
                          <Link
                            href={`/admin/products/${item.productId}`}
                            className="underline-offset-4 hover:underline"
                          >
                            {(item.name as Localized).en}
                          </Link>
                        ) : (
                          (item.name as Localized).en
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.variantLabel != null && `Size ${(item.variantLabel as Localized).en} · `}
                        {formatTaka(item.price)} × {item.quantity}
                      </p>
                    </div>
                    <span className="font-medium tabular-nums">
                      {formatTaka(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
              <Separator />
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="tabular-nums">{formatTaka(order.subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Delivery</dt>
                  <dd className="tabular-nums">
                    {order.shipping === 0 ? "Free" : formatTaka(order.shipping)}
                  </dd>
                </div>
                <div className="flex justify-between text-base font-semibold">
                  <dt>Cash to collect</dt>
                  <dd className="tabular-nums">{formatTaka(order.total)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Internal note</CardTitle>
            </CardHeader>
            <CardContent>
              <AdminNoteForm orderId={order.id} note={order.adminNote} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {order.address && (
                <div>
                  <p className="font-medium">{order.address.fullName}</p>
                  <a
                    href={`tel:${order.address.phone}`}
                    className="mt-1 inline-flex items-center gap-1.5 font-medium text-accent-foreground hover:underline"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    {order.address.phone}
                  </a>
                  <p className="mt-2 text-muted-foreground">
                    {order.address.line1}
                    {order.address.line2 && (
                      <>
                        <br />
                        {order.address.line2}
                      </>
                    )}
                    <br />
                    {order.address.city} {order.address.postalCode}
                    <br />
                    {order.address.country}
                  </p>
                </div>
              )}
              {order.note && (
                <div className="rounded-lg bg-amber-50 p-3 text-amber-950">
                  <p className="text-xs font-semibold uppercase tracking-wide">Delivery note</p>
                  <p className="mt-1 whitespace-pre-line">{order.note}</p>
                </div>
              )}
              <Separator />
              <div className="text-muted-foreground">
                <p>{order.user.email}</p>
                <p>
                  {order.user._count.orders} order{order.user._count.orders === 1 ? "" : "s"} in
                  total
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>History</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3 border-l pl-4 text-sm">
                {timeline.map((step) => (
                  <li key={step.label} className="relative">
                    <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-primary" />
                    <p className="font-medium">{step.label}</p>
                    <p className="text-xs text-muted-foreground">{formatDateTime(step.at!)}</p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
