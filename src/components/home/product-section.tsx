"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { useLanguage } from "@/i18n/language-context";
import { ProductGrid } from "@/components/product/product-grid";

export function ProductSection({
  title,
  subtitle,
  products,
  viewAllHref,
}: {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
}) {
  const { t } = useLanguage();
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="flex shrink-0 items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            {t("home.viewAll")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      <ProductGrid products={products} />
    </section>
  );
}
