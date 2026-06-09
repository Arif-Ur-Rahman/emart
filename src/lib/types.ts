export type Locale = "en" | "bn";

export type Localized = {
  en: string;
  bn: string;
};

export type ProductBadge = "bestseller" | "new" | "organic";

export type WeightOption = {
  id: string;
  label: Localized;
  price: number;
  originalPrice?: number;
};

export type Product = {
  id: string;
  slug: string;
  name: Localized;
  shortDesc: Localized;
  description: Localized;
  /** Base price (BDT). When weightOptions exist, this mirrors the default option. */
  price: number;
  originalPrice?: number;
  categorySlug: string;
  weightOptions?: WeightOption[];
  rating?: number;
  reviewCount?: number;
  badges?: ProductBadge[];
  featured?: boolean;
  /** Emoji used by the placeholder image renderer. Falls back to category emoji. */
  emoji?: string;
};

export type Category = {
  slug: string;
  name: Localized;
  tagline: Localized;
  /** Emoji shown in the category card / image placeholder. */
  emoji: string;
  /** lucide-react icon name */
  icon: string;
  /** Tailwind gradient classes for placeholder backgrounds. */
  gradient: string;
};

export type CartItem = {
  /** Stable line key = productId + optional variant id */
  key: string;
  productId: string;
  slug: string;
  variantId?: string;
  name: Localized;
  variantLabel?: Localized;
  emoji: string;
  gradient: string;
  price: number;
  quantity: number;
};
