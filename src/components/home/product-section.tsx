"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { useLanguage } from "@/i18n/language-context";
import type { TranslationKey } from "@/i18n/dictionaries";
import { ProductGrid } from "@/components/product/product-grid";

export function ProductSection({
  title,
  titleKey,
  subtitleKey,
  products,
  viewAllHref,
}: {
  /** Literal, already-resolved title (for text that isn't a dictionary key, e.g. an emoji label). */
  title?: string;
  titleKey?: TranslationKey;
  subtitleKey?: TranslationKey;
  products: Product[];
  viewAllHref?: string;
}) {
  const { t } = useLanguage();
  if (products.length === 0) return null;

  const resolvedTitle = titleKey ? t(titleKey) : title;

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-semibold sm:text-3xl">{resolvedTitle}</h2>
          {subtitleKey && (
            <p className="mt-1 text-sm text-muted-foreground">{t(subtitleKey)}</p>
          )}
        </div>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="flex shrink-0 items-center gap-1 text-sm font-semibold text-accent-foreground hover:underline"
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
