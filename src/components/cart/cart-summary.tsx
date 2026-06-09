"use client";

import { useCart } from "@/context/cart-context";
import { useLanguage } from "@/i18n/language-context";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const FREE_SHIPPING_THRESHOLD = 1000;
const SHIPPING_FEE = 60;

export function CartSummary() {
  const { subtotal } = useCart();
  const { t, lang } = useLanguage();

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
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
      <Button className="w-full" size="lg" disabled>
        {t("cart.checkout")}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        {t("cart.checkout.note")}
      </p>
    </div>
  );
}
