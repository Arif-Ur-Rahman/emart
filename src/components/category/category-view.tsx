"use client";

import Image from "next/image";
import { notFound } from "next/navigation";
import { useLanguage } from "@/i18n/language-context";
import { getCategoryBySlug } from "@/lib/categories";
import { getProductsByCategory } from "@/lib/products";
import { formatNumber } from "@/lib/format";
import { ProductGrid } from "@/components/product/product-grid";

export function CategoryView({ slug }: { slug: string }) {
  const { t, tl, lang } = useLanguage();
  const category = getCategoryBySlug(slug);
  if (!category) return notFound();

  const products = getProductsByCategory(slug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div
        className={`relative h-48 overflow-hidden rounded-3xl bg-gradient-to-br ${category.gradient} sm:h-64`}
      >
        <Image
          src={category.image}
          alt={tl(category.name)}
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/10 to-transparent p-6 sm:p-8">
          <div>
            <h1 className="font-heading text-2xl font-semibold text-white sm:text-3xl">
              {tl(category.name)}
            </h1>
            <p className="mt-1 text-sm text-white/80">{tl(category.tagline)}</p>
          </div>
        </div>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        {formatNumber(products.length, lang)} {t("shop.results")}
      </p>

      <div className="mt-4">
        {products.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">
            {t("shop.none")}
          </p>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  );
}
