"use client";

import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/types";
import { getCategoryBySlug } from "@/lib/categories";
import { useLanguage } from "@/i18n/language-context";
import { useCart } from "@/context/cart-context";
import { formatPrice, formatNumber, discountPercent } from "@/lib/format";
import { ProductImage } from "./product-image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function badgeClasses(badge: string) {
  switch (badge) {
    case "bestseller":
      return "bg-primary text-primary-foreground";
    case "new":
      return "bg-foreground text-background";
    case "organic":
      return "border border-foreground/15 bg-background/90 text-foreground backdrop-blur";
    default:
      return "bg-muted text-foreground";
  }
}

export function ProductCard({ product }: { product: Product }) {
  const { t, tl, lang } = useLanguage();
  const { addItem } = useCart();
  const category = getCategoryBySlug(product.categorySlug);
  const discount = discountPercent(product.price, product.originalPrice);
  const defaultVariant = product.weightOptions?.[0];

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-md">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden"
      >
        <ProductImage
          emoji={product.emoji ?? category?.emoji ?? "🛍️"}
          gradient={category?.gradient ?? "from-stone-100 to-stone-200"}
          className="h-full w-full transition-transform duration-300 group-hover:scale-105"
          emojiClassName="text-6xl sm:text-7xl"
        />
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {discount !== null && (
            <span className="rounded-full bg-foreground px-2 py-0.5 text-xs font-semibold text-background">
              -{formatNumber(discount, lang)}%
            </span>
          )}
          {product.badges?.slice(0, 1).map((b) => (
            <span
              key={b}
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-semibold",
                badgeClasses(b)
              )}
            >
              {t(`badge.${b}` as never)}
            </span>
          ))}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        {product.rating !== undefined && (
          <div className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="font-medium text-foreground">
              {formatNumber(product.rating, lang)}
            </span>
            {product.reviewCount !== undefined && (
              <span>({formatNumber(product.reviewCount, lang)})</span>
            )}
          </div>
        )}

        <Link href={`/products/${product.slug}`} className="flex-1">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug sm:text-base">
            {tl(product.name)}
          </h3>
          <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
            {tl(product.shortDesc)}
          </p>
        </Link>

        <div className="mt-3 flex items-end justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-base font-bold text-primary sm:text-lg">
              {formatPrice(product.price, lang)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.originalPrice, lang)}
              </span>
            )}
          </div>
          <Button
            size="icon"
            aria-label={t("product.addToCart")}
            onClick={() => addItem(product, defaultVariant, 1)}
            className="h-9 w-9 shrink-0 rounded-full"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
