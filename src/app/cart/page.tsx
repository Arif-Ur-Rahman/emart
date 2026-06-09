"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useLanguage } from "@/i18n/language-context";
import { formatNumber } from "@/lib/format";
import { CartItemRow } from "@/components/cart/cart-item-row";
import { CartSummary } from "@/components/cart/cart-summary";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CartPage() {
  const { items, count } = useCart();
  const { t, lang } = useLanguage();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
        <h1 className="text-2xl font-bold">{t("cart.title")}</h1>
        <p className="text-muted-foreground">{t("cart.empty")}</p>
        <Link
          href="/shop"
          className={cn(buttonVariants({ size: "lg" }), "rounded-full")}
        >
          {t("cart.empty.cta")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold sm:text-3xl">
        {t("cart.title")}
        <span className="ml-2 text-base font-normal text-muted-foreground">
          ({formatNumber(count, lang)} {count === 1 ? t("cart.item") : t("cart.items")})
        </span>
      </h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="divide-y rounded-2xl border px-4">
            {items.map((item) => (
              <CartItemRow key={item.key} item={item} />
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-2xl border p-5 lg:sticky lg:top-24">
            <CartSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
