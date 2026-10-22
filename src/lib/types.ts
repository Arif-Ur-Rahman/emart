export type Locale = "en" | "bn";

export type Localized = {
  en: string;
  bn: string;
};

export type ProductBadge = "bestseller" | "new" | "organic";

export type SizeOption = {
  id: string;
  label: Localized;
  price: number;
  originalPrice?: number;
  /** Units available to order in this size. */
  stock: number;
};

export type Product = {
  id: string;
  slug: string;
  name: Localized;
  shortDesc: Localized;
  description: Localized;
  /** Base price (BDT). When sizeOptions exist, this mirrors the default option. */
  price: number;
  originalPrice?: number;
  categorySlug: string;
  /** Path to the product photo under /public, or an absolute https URL. */
  image: string;
  sizeOptions?: SizeOption[];
  /** Units available to order. With sizeOptions, the sum across all sizes. */
  stock: number;
  rating?: number;
  reviewCount?: number;
  badges?: ProductBadge[];
  featured?: boolean;
};

export type Category = {
  slug: string;
  name: Localized;
  tagline: Localized;
  /** Emoji shown in nav chips and filter dropdowns. */
  emoji: string;
  /** lucide-react icon name */
  icon: string;
  /** Tailwind gradient classes used behind photos. */
  gradient: string;
  /** Path to the representative category photo under /public. */
  image: string;
};

export type CartItem = {
  /** Stable line key = productId + optional variant id */
  key: string;
  productId: string;
  slug: string;
  variantId?: string;
  name: Localized;
  variantLabel?: Localized;
  image: string;
  price: number;
  quantity: number;
};
