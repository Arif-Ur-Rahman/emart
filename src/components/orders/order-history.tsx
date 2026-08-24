"use client";

import Link from "next/link";
import { Package } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import type { TranslationKey } from "@/i18n/dictionaries";
import { formatPrice, formatNumber } from "@/lib/format";
import type { OrderSummary } from "@/lib/data/orders";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function OrderHistory({ orders }: { orders: OrderSummary[] }) {
  const { t, lang } = useLanguage();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-heading text-2xl font-semibold sm:text-3xl">
        {t("account.myOrders.title")}
      </h1>

      {orders.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <Package className="h-16 w-16 text-muted-foreground/30" />
          <p className="text-muted-foreground">{t("account.myOrders.empty")}</p>
          <Link href="/shop" className={cn(buttonVariants({ size: "lg" }), "rounded-full")}>
            {t("cart.empty.cta")}
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {orders.map((order) => (
            <li key={order.id}>
              <Card>
                <CardContent className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">
                      {t("order.number")} #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString(
                        lang === "bn" ? "bn-BD" : "en-US",
                        { year: "numeric", month: "short", day: "numeric" }
                      )}
                      {" · "}
                      {formatNumber(order.itemCount, lang)} {t("order.items")}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(order.total, lang)}</p>
                      <p className="text-xs text-muted-foreground">
                        {t(`order.status.${order.status}` as TranslationKey)}
                      </p>
                    </div>
                    <Link
                      href={`/orders/${order.id}`}
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                    >
                      {t("order.viewOrder")}
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
