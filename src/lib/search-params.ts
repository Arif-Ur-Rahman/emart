import { categories } from "@/lib/data/catalog";
import type {
  CategorySlug,
  ProductQuery,
  ProductTag,
  SortOption,
} from "@/lib/types";

/** The raw shape Next.js hands a page via the `searchParams` prop. */
export type RawSearchParams = Record<string, string | string[] | undefined>;

const SORT_OPTIONS: SortOption[] = [
  "featured",
  "price-asc",
  "price-desc",
  "newest",
  "rating",
];

export const SORT_LABELS: Record<SortOption, string> = {
  featured: "Featured",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  newest: "Newest first",
  rating: "Top rated",
};

const TAGS: ProductTag[] = ["new", "bestseller", "handmade", "limited"];

export const TAG_LABELS: Record<ProductTag, string> = {
  new: "New in",
  bestseller: "Bestseller",
  handmade: "Handmade",
  limited: "Limited run",
};

/** Price buckets, in Taka, matching the ৳100–৳1,500 range of the shop. */
export const PRICE_BANDS = [
  { id: "under-250", label: "Under ৳250", min: 0, max: 249 },
  { id: "250-500", label: "৳250 – ৳500", min: 250, max: 500 },
  { id: "500-1000", label: "৳500 – ৳1,000", min: 500, max: 1000 },
  { id: "over-1000", label: "Over ৳1,000", min: 1001, max: undefined },
] as const;

export type PriceBandId = (typeof PRICE_BANDS)[number]["id"];

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function list(value: string | string[] | undefined): string[] {
  if (!value) return [];
  const raw = Array.isArray(value) ? value : [value];
  return raw.flatMap((entry) => entry.split(",")).filter(Boolean);
}

export interface ParsedShopParams {
  search?: string;
  categories: CategorySlug[];
  tags: ProductTag[];
  band?: PriceBandId;
  sort: SortOption;
}

export function parseShopParams(params: RawSearchParams): ParsedShopParams {
  const validCategories = new Set(categories.map((category) => category.slug));

  const rawSort = first(params.sort);
  const sort = SORT_OPTIONS.includes(rawSort as SortOption)
    ? (rawSort as SortOption)
    : "featured";

  const rawBand = first(params.price);
  const band = PRICE_BANDS.some((option) => option.id === rawBand)
    ? (rawBand as PriceBandId)
    : undefined;

  return {
    search: first(params.q)?.trim() || undefined,
    categories: list(params.category).filter((slug): slug is CategorySlug =>
      validCategories.has(slug as CategorySlug),
    ),
    tags: list(params.tag).filter((tag): tag is ProductTag =>
      TAGS.includes(tag as ProductTag),
    ),
    band,
    sort,
  };
}

/**
 * The data layer filters one category at a time, so multi-select categories are
 * resolved by querying each and merging. This returns the non-category part.
 */
export function toProductQuery(parsed: ParsedShopParams): ProductQuery {
  const band = PRICE_BANDS.find((option) => option.id === parsed.band);
  return {
    search: parsed.search,
    tags: parsed.tags.length ? parsed.tags : undefined,
    minPrice: band?.min,
    maxPrice: band?.max,
    sort: parsed.sort,
  };
}

/**
 * Builds a shop URL with one facet flipped on or off, preserving the rest.
 * Used by the filter links so filtering works without client-side JS.
 */
export function buildShopHref(
  params: RawSearchParams,
  change: { key: string; value?: string; toggle?: boolean },
): string {
  const next = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    for (const entry of list(value)) {
      next.append(key, entry);
    }
  }

  if (change.value === undefined) {
    next.delete(change.key);
  } else if (change.toggle) {
    const existing = next.getAll(change.key);
    next.delete(change.key);
    const remaining = existing.filter((entry) => entry !== change.value);
    if (remaining.length === existing.length) remaining.push(change.value);
    for (const entry of remaining) next.append(change.key, entry);
  } else {
    next.delete(change.key);
    next.set(change.key, change.value);
  }

  const query = next.toString();
  return query ? `/shop?${query}` : "/shop";
}

export function hasActiveFilters(parsed: ParsedShopParams): boolean {
  return Boolean(
    parsed.search ||
      parsed.categories.length ||
      parsed.tags.length ||
      parsed.band,
  );
}
