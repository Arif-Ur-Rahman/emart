"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import type { Product, SizeOption } from "@/lib/types";
import { useCart } from "@/context/cart-context";
import { useLanguage } from "@/i18n/language-context";
import { formatPrice, discountPercent } from "@/lib/format";
import { QuantitySelector } from "./quantity-selector";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ProductPurchase({ product }: { product: Product }) {
  const { t, tl, lang } = useLanguage();
  const { addItem } = useCart();
  const [variant, setVariant] = useState<SizeOption | undefined>(
    product.sizeOptions?.[0]
  );
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const price = variant?.price ?? product.price;
  const originalPrice = variant?.originalPrice ?? product.originalPrice;
  const discount = discountPercent(price, originalPrice);

  function handleAdd() {
    addItem(product, variant, qty);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-baseline gap-3">
        <span className="text-3xl font-bold text-primary">
          {formatPrice(price, lang)}
        </span>
        {originalPrice && (
          <span className="text-lg text-muted-foreground line-through">
            {formatPrice(originalPrice, lang)}
          </span>
        )}
        {discount !== null && (
          <span className="rounded-full bg-accent px-2 py-0.5 text-sm font-semibold text-accent-foreground">
            {t("product.save")} {discount}%
          </span>
        )}
      </div>

      {product.sizeOptions && product.sizeOptions.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium">{t("product.size")}</p>
          <div className="flex flex-wrap gap-2">
            {product.sizeOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setVariant(opt)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition",
                  variant?.id === opt.id
                    ? "border-brand bg-brand text-brand-foreground"
                    : "hover:border-brand"
                )}
              >
                {tl(opt.label)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 text-sm font-medium">{t("product.quantity")}</p>
        <QuantitySelector value={qty} onChange={setQty} min={1} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          size="lg"
          className="flex-1 rounded-full"
          onClick={handleAdd}
        >
          {justAdded ? (
            <>
              <Check className="mr-1 h-5 w-5" />
              {t("product.added")}
            </>
          ) : (
            <>
              <ShoppingCart className="mr-1 h-5 w-5" />
              {t("product.addToCart")}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
