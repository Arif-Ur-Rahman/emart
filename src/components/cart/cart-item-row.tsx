"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import type { CartItem } from "@/lib/types";
import { useCart } from "@/context/cart-context";
import { useLanguage } from "@/i18n/language-context";
import { formatPrice } from "@/lib/format";
import { ProductImage } from "@/components/product/product-image";
import { QuantitySelector } from "@/components/product/quantity-selector";

export function CartItemRow({
  item,
  onNavigate,
}: {
  item: CartItem;
  onNavigate?: () => void;
}) {
  const { updateQty, removeItem } = useCart();
  const { tl, lang } = useLanguage();

  return (
    <div className="flex gap-3 py-4">
      <Link
        href={`/products/${item.slug}`}
        onClick={onNavigate}
        className="shrink-0"
      >
        <ProductImage
          emoji={item.emoji}
          gradient={item.gradient}
          className="h-20 w-20 rounded-xl"
          emojiClassName="text-3xl"
        />
      </Link>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/products/${item.slug}`}
            onClick={onNavigate}
            className="text-sm font-semibold leading-snug hover:text-primary"
          >
            {tl(item.name)}
          </Link>
          <button
            type="button"
            onClick={() => removeItem(item.key)}
            aria-label="Remove item"
            className="text-muted-foreground transition hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {item.variantLabel && (
          <span className="mt-0.5 text-xs text-muted-foreground">
            {tl(item.variantLabel)}
          </span>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          <QuantitySelector
            size="sm"
            value={item.quantity}
            onChange={(q) => updateQty(item.key, q)}
            min={1}
          />
          <span className="font-semibold text-primary">
            {formatPrice(item.price * item.quantity, lang)}
          </span>
        </div>
      </div>
    </div>
  );
}
