"use client";

import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { useLanguage } from "@/i18n/language-context";
import { formatPrice } from "@/lib/format";
import { calculateShipping } from "@/lib/shipping";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function CartSummary() {
  const { subtotal, setOpen } = useCart();
  const { t, lang } = useLanguage();

  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{t("cart.subtotal")}</span>
        <span className="font-medium">{formatPrice(subtotal, lang)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{t("cart.shipping")}</span>
        <span className="font-medium">
          {shipping === 0 ? t("cart.shipping.free") : formatPrice(shipping, lang)}
        </span>
      </div>
      <Separator />
      <div className="flex justify-between text-base font-bold">
        <span>{t("cart.total")}</span>
        <span className="text-primary">{formatPrice(total, lang)}</span>
      </div>
      <Link
        href="/checkout"
        onClick={() => setOpen(false)}
        className={cn(buttonVariants({ size: "lg" }), "w-full")}
      >
        {t("cart.checkout")}
      </Link>
    </div>
  );
}
