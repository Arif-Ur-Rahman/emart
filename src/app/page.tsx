"use client";

import { Hero } from "@/components/home/hero";
import { FeatureBar } from "@/components/home/feature-bar";
import { CategoryGrid } from "@/components/home/category-grid";
import { ProductSection } from "@/components/home/product-section";
import { useLanguage } from "@/i18n/language-context";
import { getFeaturedProducts, getAllProducts } from "@/lib/products";

export default function HomePage() {
  const { t } = useLanguage();
  const featured = getFeaturedProducts();
  const newArrivals = getAllProducts().filter((p) =>
    p.badges?.includes("new")
  );
  const trending = getAllProducts()
    .filter((p) => (p.rating ?? 0) >= 4.6 && !p.featured)
    .slice(0, 8);

  return (
    <>
      <Hero />
      <FeatureBar />
      <CategoryGrid />
      <ProductSection
        title={t("home.featured.title")}
        subtitle={t("home.featured.subtitle")}
        products={featured}
        viewAllHref="/shop"
      />
      {newArrivals.length > 0 && (
        <ProductSection
          title={t("home.new.title")}
          products={newArrivals}
          viewAllHref="/shop"
        />
      )}
      <ProductSection title="🔥 Trending" products={trending} viewAllHref="/shop" />
    </>
  );
}
