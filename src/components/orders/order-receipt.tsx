"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Check, CheckCircle2, XCircle } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import { formatPrice, formatNumber } from "@/lib/format";
import { CUSTOMER_CANCELLABLE, ORDER_STEPS, formatOrderNumber } from "@/lib/order-status";
import { cancelMyOrder } from "@/lib/actions/orders";
import type { Locale, Localized } from "@/lib/types";
import type { OrderWithDetails } from "@/lib/data/orders";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

function formatDate(date: Date, lang: Locale) {
  return new Date(date).toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US", {
    month: "short",
    day: "numeric",
  });
}

function OrderTimeline({ order }: { order: OrderWithDetails }) {
  const { t, lang } = useLanguage();
  const reachedAt = {
    PENDING: order.createdAt,
    CONFIRMED: order.confirmedAt,
    SHIPPED: order.shippedAt,
    DELIVERED: order.deliveredAt,
  };
  const current = ORDER_STEPS.indexOf(order.status as (typeof ORDER_STEPS)[number]);

  return (
    <ol className="grid grid-cols-4 gap-2">
      {ORDER_STEPS.map((step, index) => {
        const done = index <= current;
        const date = reachedAt[step];
        return (
          <li key={step} className="flex flex-col items-center text-center">
            <div className="flex w-full items-center">
              <span
                className={cn(
                  "h-0.5 flex-1",
                  index === 0 ? "invisible" : done ? "bg-primary" : "bg-border"
                )}
              />
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2",
                  done
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground"
                )}
              >
                {done ? <Check className="h-4 w-4" /> : formatNumber(index + 1, lang)}
              </span>
              <span
                className={cn(
                  "h-0.5 flex-1",
                  index === ORDER_STEPS.length - 1
                    ? "invisible"
                    : index < current
                      ? "bg-primary"
                      : "bg-border"
                )}
              />
            </div>
            <p className={cn("mt-2 text-xs font-medium", !done && "text-muted-foreground")}>
              {t(`order.step.${step}`)}
            </p>
            {done && date && (
              <p className="text-[11px] text-muted-foreground">{formatDate(date, lang)}</p>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function CancelOrder({ orderId }: { orderId: string }) {
  const { t } = useLanguage();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (!confirming) {
    return (
      <div className="flex flex-col items-center gap-1">
        <Button variant="outline" onClick={() => setConfirming(true)}>
          {t("order.cancel")}
        </Button>
        <p className="text-xs text-muted-foreground">{t("order.cancel.hint")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-2">
        <Button
          variant="destructive"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const result = await cancelMyOrder(orderId);
              if (!result.ok) setError(result.error);
              setConfirming(false);
            })
          }
        >
          {t("order.cancel.confirm")}
        </Button>
        <Button variant="ghost" disabled={pending} onClick={() => setConfirming(false)}>
          {t("order.cancel.keep")}
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export function OrderReceipt({ order }: { order: OrderWithDetails }) {
  const { t, tl, lang } = useLanguage();
  const cancelled = order.status === "CANCELLED";
  const paid = order.paymentStatus === "PAID";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 flex flex-col items-center text-center">
        {cancelled ? (
          <XCircle className="h-12 w-12 text-muted-foreground" />
        ) : (
          <CheckCircle2 className="h-12 w-12 text-primary" />
        )}
        <h1 className="font-heading mt-3 text-2xl font-semibold sm:text-3xl">
          {t(cancelled ? "order.cancelled.title" : "order.placed.title")}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {t(cancelled ? "order.cancelled.desc" : "order.placed.desc")}
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">
            {t("order.number")} {formatOrderNumber(order.number)}
          </CardTitle>
          <span
            className={cn(
              "rounded-full px-3 py-1 text-xs font-semibold",
              cancelled ? "bg-muted text-muted-foreground" : "bg-accent text-accent-foreground"
            )}
          >
            {t(`order.status.${order.status}`)}
          </span>
        </CardHeader>
        <CardContent className="space-y-4">
          {!cancelled && (
            <>
              <OrderTimeline order={order} />
              <Separator />
            </>
          )}

          <ul className="space-y-3">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate">
                  {tl(item.name as Localized)}
                  {item.variantLabel != null && ` (${tl(item.variantLabel as Localized)})`}
                  <span className="text-muted-foreground">
                    {" "}
                    × {formatNumber(item.quantity, lang)}
                  </span>
                </span>
                <span className="shrink-0 font-medium">
                  {formatPrice(item.price * item.quantity, lang)}
                </span>
              </li>
            ))}
          </ul>

          <Separator />

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t("cart.subtotal")}</span>
            <span className="font-medium">{formatPrice(order.subtotal, lang)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t("cart.shipping")}</span>
            <span className="font-medium">
              {order.shipping === 0
                ? t("cart.shipping.free")
                : formatPrice(order.shipping, lang)}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between text-base font-bold">
            <span>{t("cart.total")}</span>
            <span className="text-primary">{formatPrice(order.total, lang)}</span>
          </div>

          <Separator />
          <div className="flex items-start justify-between gap-4 text-sm">
            <div>
              <p className="font-semibold">{t("order.payment")}</p>
              <p className="text-muted-foreground">{t("order.payment.cod")}</p>
            </div>
            {!cancelled && (
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold",
                  paid ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                )}
              >
                {paid
                  ? t("order.payment.paid")
                  : `${t("order.payment.due")}: ${formatPrice(order.total, lang)}`}
              </span>
            )}
          </div>

          {order.address && (
            <>
              <Separator />
              <div>
                <p className="mb-1 text-sm font-semibold">{t("order.deliverTo")}</p>
                <p className="text-sm text-muted-foreground">
                  {order.address.fullName} · {order.address.phone}
                  <br />
                  {order.address.line1}
                  {order.address.line2 ? `, ${order.address.line2}` : ""}
                  <br />
                  {order.address.city}, {order.address.postalCode}
                </p>
              </div>
            </>
          )}

          {order.note && (
            <div>
              <p className="mb-1 text-sm font-semibold">{t("order.note")}</p>
              <p className="whitespace-pre-line text-sm text-muted-foreground">{order.note}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 flex flex-col items-center gap-4">
        {CUSTOMER_CANCELLABLE.includes(order.status) && <CancelOrder orderId={order.id} />}
        <Link href="/shop" className={cn(buttonVariants({ variant: "outline" }))}>
          {t("order.backToShop")}
        </Link>
      </div>
    </div>
  );
}
