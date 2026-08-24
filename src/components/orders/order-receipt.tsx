"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import type { TranslationKey } from "@/i18n/dictionaries";
import { formatPrice, formatNumber } from "@/lib/format";
import type { Localized } from "@/lib/types";
import type { OrderWithDetails } from "@/lib/data/orders";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function OrderReceipt({ order }: { order: OrderWithDetails }) {
  const { t, tl, lang } = useLanguage();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 flex flex-col items-center text-center">
        <CheckCircle2 className="h-12 w-12 text-primary" />
        <h1 className="font-heading mt-3 text-2xl font-semibold sm:text-3xl">
          {t("order.confirmed.title")}
        </h1>
        <p className="mt-1 text-muted-foreground">{t("order.confirmed.desc")}</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">
            {t("order.number")} #{order.id.slice(-8).toUpperCase()}
          </CardTitle>
          <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
            {t(`order.status.${order.status}` as TranslationKey)}
          </span>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-3">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate">
                  {tl(item.name as Localized)}
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
        </CardContent>
      </Card>

      <div className="mt-6 text-center">
        <Link href="/shop" className={cn(buttonVariants({ variant: "outline" }))}>
          {t("order.backToShop")}
        </Link>
      </div>
    </div>
  );
}
