import { categories, products } from "@/lib/data/catalog";
import type {
  Category,
  CategorySlug,
  Product,
  ProductQuery,
  SortOption,
} from "@/lib/types";

/**
 * The single seam between the storefront and its data source.
 *
 * Everything here is async and returns plain serialisable objects, so when the
 * Node.js API is ready each function body becomes a `fetch` against it and no
 * component has to change. Set `NEXT_PUBLIC_API_URL` and swap the bodies for:
 *
 *   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
 *   return res.json()
 */

const SORTERS: Record<SortOption, (a: Product, b: Product) => number> = {
  featured: (a, b) => featuredScore(b) - featuredScore(a),
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  newest: (a, b) => b.createdAt.localeCompare(a.createdAt),
  rating: (a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount,
};

function featuredScore(product: Product): number {
  let score = product.rating * 10 + Math.min(product.reviewCount, 100) / 10;
  if (product.tags.includes("bestseller")) score += 25;
  if (product.tags.includes("new")) score += 12;
  if (product.stock === 0) score -= 100;
  return score;
}

function matches(product: Product, query: ProductQuery): boolean {
  if (query.category && product.category !== query.category) return false;
  if (query.minPrice !== undefined && product.price < query.minPrice) return false;
  if (query.maxPrice !== undefined && product.price > query.maxPrice) return false;

  if (query.tags?.length && !query.tags.some((tag) => product.tags.includes(tag))) {
    return false;
  }

  if (query.search) {
    const needle = query.search.trim().toLowerCase();
    const haystack = [
      product.name,
      product.description,
      product.category,
      ...product.materials,
      ...product.colors,
      ...product.tags,
    ]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(needle)) return false;
  }

  return true;
}

export async function getCategories(): Promise<Category[]> {
  return [...categories].sort((a, b) => a.position - b.position);
}

export async function getCategory(
  slug: string,
): Promise<Category | undefined> {
  return categories.find((category) => category.slug === slug);
}

export async function getProducts(
  query: ProductQuery = {},
): Promise<Product[]> {
  const sorter = SORTERS[query.sort ?? "featured"];
  return products.filter((product) => matches(product, query)).sort(sorter);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  return products.find((product) => product.slug === slug);
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  const wanted = new Set(ids);
  return products.filter((product) => wanted.has(product.id));
}

/** Slugs for `generateStaticParams`. */
export async function getAllProductSlugs(): Promise<string[]> {
  return products.map((product) => product.slug);
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const all = await getProducts({ sort: "featured" });
  return all.slice(0, limit);
}

export async function getNewArrivals(limit = 4): Promise<Product[]> {
  const all = await getProducts({ sort: "newest" });
  return all.slice(0, limit);
}

/** Same category first, then anything else that shares a tag. */
export async function getRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  const sameCategory = products.filter(
    (candidate) =>
      candidate.category === product.category && candidate.id !== product.id,
  );

  if (sameCategory.length >= limit) {
    return sameCategory.sort((a, b) => featuredScore(b) - featuredScore(a)).slice(0, limit);
  }

  const chosen = new Set(sameCategory.map((candidate) => candidate.id));
  const sharesTag = products.filter(
    (candidate) =>
      candidate.id !== product.id &&
      !chosen.has(candidate.id) &&
      candidate.tags.some((tag) => product.tags.includes(tag)),
  );

  return [...sameCategory, ...sharesTag].slice(0, limit);
}

export async function getCategoryCounts(): Promise<Record<CategorySlug, number>> {
  return products.reduce(
    (counts, product) => {
      counts[product.category] = (counts[product.category] ?? 0) + 1;
      return counts;
    },
    {} as Record<CategorySlug, number>,
  );
}

export async function getPriceBounds(): Promise<{ min: number; max: number }> {
  const prices = products.map((product) => product.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}
