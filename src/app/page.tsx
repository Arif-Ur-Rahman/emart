import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { CategoryStrip } from "@/components/home/category-strip";
import { Hero } from "@/components/home/hero";
import { ValueProps } from "@/components/home/value-props";
import { ProductGrid } from "@/components/product/product-grid";
import { Button } from "@/components/ui/button";
import { getFeaturedProducts, getNewArrivals } from "@/lib/data";

export default async function HomePage() {
  const [featured, newArrivals] = await Promise.all([
    getFeaturedProducts(8),
    getNewArrivals(4),
  ]);

  return (
    <>
      <Hero />
      <ValueProps />
      <CategoryStrip />

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="font-heading text-3xl font-semibold">
              Most loved this season
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              The pieces our customers keep coming back for.
            </p>
          </div>
          <Link
            href="/shop?sort=rating"
            className="hidden shrink-0 text-sm text-primary underline-offset-4 hover:underline sm:block"
          >
            See all
          </Link>
        </div>

        <ProductGrid products={featured} priorityCount={4} className="mt-8" />
      </section>

      <section className="border-y bg-secondary/50">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-[1fr_auto] md:items-center lg:px-8">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs tracking-[0.24em] text-primary uppercase">
              Our story
            </p>
            <h2 className="font-heading text-3xl leading-tight font-semibold text-balance-heading">
              Maloti started with one tray of glass bangles at a Dhaka market.
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              We work with fourteen artisans across Bangladesh — women who cut,
              string, embroider and fire every piece we sell. We keep the
              catalogue small on purpose, and we keep the prices where they are
              so that something beautiful stays an ordinary purchase.
            </p>
          </div>
          <Button asChild variant="outline" size="lg" className="h-11 w-fit px-7">
            <Link href="/about">
              Read the story
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="font-heading text-3xl font-semibold">Just arrived</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Fresh off the workbench.
            </p>
          </div>
          <Link
            href="/shop?sort=newest"
            className="hidden shrink-0 text-sm text-primary underline-offset-4 hover:underline sm:block"
          >
            See all
          </Link>
        </div>

        <ProductGrid products={newArrivals} className="mt-8" />
      </section>
    </>
  );
}
