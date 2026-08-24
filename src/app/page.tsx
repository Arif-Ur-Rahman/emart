import { Hero } from "@/components/home/hero";
import { FeatureBar } from "@/components/home/feature-bar";
import { CategoryGrid } from "@/components/home/category-grid";
import { ProductSection } from "@/components/home/product-section";
import { getAllCategories } from "@/lib/data/categories";
import { getFeaturedProducts, getAllProducts } from "@/lib/data/products";

export default async function HomePage() {
  const [categories, featured, allProducts] = await Promise.all([
    getAllCategories(),
    getFeaturedProducts(),
    getAllProducts(),
  ]);

  const newArrivals = allProducts.filter((p) => p.badges?.includes("new"));
  const trending = allProducts
    .filter((p) => (p.rating ?? 0) >= 4.6 && !p.featured)
    .slice(0, 8);

  return (
    <>
      <Hero categories={categories} />
      <FeatureBar />
      <CategoryGrid categories={categories} />
      <ProductSection
        titleKey="home.featured.title"
        subtitleKey="home.featured.subtitle"
        products={featured}
        viewAllHref="/shop"
      />
      {newArrivals.length > 0 && (
        <ProductSection
          titleKey="home.new.title"
          products={newArrivals}
          viewAllHref="/shop"
        />
      )}
      <ProductSection title="🔥 Trending" products={trending} viewAllHref="/shop" />
    </>
  );
}
