"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/i18n/language-context";
import { getAllProducts } from "@/lib/products";
import { getAllCategories } from "@/lib/categories";
import { formatNumber } from "@/lib/format";
import { ProductGrid } from "@/components/product/product-grid";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SortKey = "featured" | "priceLow" | "priceHigh" | "rating";

export default function ShopPage() {
  const { t, tl, lang } = useLanguage();
  const categories = getAllCategories();
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("featured");

  const products = useMemo(() => {
    let list = getAllProducts();
    if (category !== "all") {
      list = list.filter((p) => p.categorySlug === category);
    }
    const sorted = [...list];
    switch (sort) {
      case "priceLow":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "priceHigh":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      default:
        sorted.sort(
          (a, b) => Number(b.featured ?? false) - Number(a.featured ?? false)
        );
    }
    return sorted;
  }, [category, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold sm:text-3xl">{t("shop.title")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {formatNumber(products.length, lang)} {t("shop.results")}
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Select value={category} onValueChange={(v) => setCategory(v ?? "all")}>
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("shop.filter.all")}</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.slug} value={c.slug}>
                {c.emoji} {tl(c.name)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={(v) => setSort((v as SortKey) ?? "featured")}>
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">{t("shop.sort.featured")}</SelectItem>
            <SelectItem value="priceLow">{t("shop.sort.priceLow")}</SelectItem>
            <SelectItem value="priceHigh">{t("shop.sort.priceHigh")}</SelectItem>
            <SelectItem value="rating">{t("shop.sort.rating")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-8">
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
