"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, ChevronRight } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import { getCategoryBySlug } from "@/lib/categories";
import { formatNumber } from "@/lib/format";
import { ProductImage } from "./product-image";
import { ProductPurchase } from "./product-purchase";
import { ProductSection } from "@/components/home/product-section";

export function ProductDetail({ slug }: { slug: string }) {
  const { t, tl, lang } = useLanguage();
  const product = getProductBySlug(slug);
  if (!product) return notFound();

  const category = getCategoryBySlug(product.categorySlug);
  const related = getRelatedProducts(product);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-primary">
          {t("nav.home")}
        </Link>
        <ChevronRight className="h-4 w-4" />
        {category && (
          <>
            <Link
              href={`/category/${category.slug}`}
              className="hover:text-primary"
            >
              {tl(category.name)}
            </Link>
            <ChevronRight className="h-4 w-4" />
          </>
        )}
        <span className="truncate text-foreground">{tl(product.name)}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Gallery */}
        <div className="md:sticky md:top-24 md:self-start">
          <ProductImage
            emoji={product.emoji ?? category?.emoji ?? "🛍️"}
            gradient={category?.gradient ?? "from-stone-100 to-stone-200"}
            className="aspect-square w-full rounded-3xl"
            emojiClassName="text-[8rem]"
          />
        </div>

        {/* Info */}
        <div>
          {category && (
            <Link
              href={`/category/${category.slug}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              {tl(category.name)}
            </Link>
          )}
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
            {tl(product.name)}
          </h1>

          {product.rating !== undefined && (
            <div className="mt-2 flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={
                      i < Math.round(product.rating!)
                        ? "h-4 w-4 fill-amber-400 text-amber-400"
                        : "h-4 w-4 text-muted-foreground/30"
                    }
                  />
                ))}
              </div>
              <span className="font-medium">
                {formatNumber(product.rating, lang)}
              </span>
              {product.reviewCount !== undefined && (
                <span className="text-muted-foreground">
                  ({formatNumber(product.reviewCount, lang)} {t("product.reviews")})
                </span>
              )}
            </div>
          )}

          <p className="mt-3 text-muted-foreground">{tl(product.shortDesc)}</p>

          <div className="mt-6">
            <ProductPurchase product={product} />
          </div>

          <div className="mt-8 border-t pt-6">
            <h2 className="mb-2 text-lg font-semibold">
              {t("product.description")}
            </h2>
            <p className="leading-relaxed text-muted-foreground">
              {tl(product.description)}
            </p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-8">
          <ProductSection title={t("product.related")} products={related} />
        </div>
      )}
    </div>
  );
}
