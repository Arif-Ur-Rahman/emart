import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { ProductGrid } from "@/components/product/product-grid";
import { MobileFilters } from "@/components/shop/mobile-filters";
import { ShopFilters } from "@/components/shop/shop-filters";
import { SortSelect } from "@/components/shop/sort-select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getProducts } from "@/lib/data";
import {
  parseShopParams,
  toProductQuery,
  type RawSearchParams,
} from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Shop all",
  description:
    "Every Maloti piece in one place — bangles, hair bands, earrings, necklaces and handmade crafts from ৳100 to ৳1,500.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const params = await searchParams;
  const parsed = parseShopParams(params);

  const allMatching = await getProducts(toProductQuery(parsed));
  // Category is multi-select in the UI but single-valued in the query API, so
  // the narrowing happens here — order from the sorted result is preserved.
  const products = parsed.categories.length
    ? allMatching.filter((product) => parsed.categories.includes(product.category))
    : allMatching;

  const activeCount =
    parsed.categories.length + parsed.tags.length + (parsed.band ? 1 : 0);

  const filters = <ShopFilters params={params} parsed={parsed} />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-2">
        <h1 className="font-heading text-4xl font-semibold">
          {parsed.search ? `Results for “${parsed.search}”` : "Shop all"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Handmade ornaments and crafts, ৳100 to ৳1,500.
        </p>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[15rem_1fr]">
        <div className="hidden lg:block">{filters}</div>

        <div>
          <div className="flex items-center justify-between gap-4 border-b pb-4">
            <div className="flex items-center gap-3">
              <Suspense
                fallback={<Skeleton className="h-9 w-24 lg:hidden" />}
              >
                <MobileFilters activeCount={activeCount}>
                  {filters}
                </MobileFilters>
              </Suspense>
              <p className="text-sm text-muted-foreground tabular-nums">
                {products.length}{" "}
                {products.length === 1 ? "piece" : "pieces"}
              </p>
            </div>

            <Suspense fallback={<Skeleton className="h-9 w-[11.5rem]" />}>
              <SortSelect value={parsed.sort} />
            </Suspense>
          </div>

          {products.length === 0 ? (
            <EmptyState />
          ) : (
            <ProductGrid
              products={products}
              priorityCount={4}
              className="mt-8"
            />
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 py-24 text-center">
      <h2 className="font-heading text-2xl font-semibold">
        Nothing matches that yet
      </h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        Try widening the price range or clearing a collection — the shop is
        small on purpose.
      </p>
      <Button asChild variant="outline">
        <Link href="/shop">Clear all filters</Link>
      </Button>
    </div>
  );
}
