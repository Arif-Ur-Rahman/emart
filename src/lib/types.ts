/**
 * Domain types for the Maloti storefront.
 *
 * These mirror the shapes the Node.js API will return, so swapping the mock
 * catalog for real HTTP calls only changes `src/lib/data/index.ts`.
 */

export type CategorySlug =
  | "wrist-bands"
  | "hair-bands"
  | "hair-clips"
  | "earrings"
  | "necklaces"
  | "rings"
  | "anklets"
  | "handmade-crafts";

export interface Category {
  slug: CategorySlug;
  name: string;
  /** Bengali name, shown as a subtitle. */
  nameBn: string;
  description: string;
  /** Ordering weight for nav and category strips. */
  position: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  /** Price in Bangladeshi Taka, always a whole number. */
  price: number;
  /** Struck-through original price, when the item is discounted. */
  compareAtPrice?: number;
  description: string;
  /** Short bullets rendered on the product page. */
  details: string[];
  materials: string[];
  colors: string[];
  /** Units on hand. 0 means sold out. */
  stock: number;
  rating: number;
  reviewCount: number;
  tags: ProductTag[];
  /**
   * Optional image path served from `/public`. When absent the UI falls back
   * to a generated ornament motif, so the catalog renders before photography
   * exists.
   */
  image?: string;
  createdAt: string;
}

export type ProductTag = "new" | "bestseller" | "handmade" | "limited";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image?: string;
  category: CategorySlug;
  quantity: number;
}

export type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "newest"
  | "rating";

export interface ProductQuery {
  category?: CategorySlug;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: ProductTag[];
  sort?: SortOption;
}
