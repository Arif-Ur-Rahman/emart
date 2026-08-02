import Link from "next/link";

import { ProductMotif } from "@/components/product/product-motif";
import { getCategories, getCategoryCounts } from "@/lib/data";

export async function CategoryStrip() {
  const [categories, counts] = await Promise.all([
    getCategories(),
    getCategoryCounts(),
  ]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h2 className="font-heading text-3xl font-semibold">
            Shop by collection
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Eight small collections, all made by hand.
          </p>
        </div>
        <Link
          href="/shop"
          className="hidden shrink-0 text-sm text-primary underline-offset-4 hover:underline sm:block"
        >
          View everything
        </Link>
      </div>

      <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((category) => (
          <li key={category.slug}>
            <Link
              href={`/collections/${category.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-lg border bg-card transition hover:border-primary/40 hover:shadow-sm"
            >
              <div className="aspect-16/10 overflow-hidden bg-muted">
                <ProductMotif
                  seed={category.slug}
                  className="transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col gap-0.5 p-4">
                <h3 className="font-heading text-lg leading-tight font-medium group-hover:text-primary">
                  {category.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {category.nameBn}
                </p>
                <p className="mt-auto pt-3 text-xs text-muted-foreground tabular-nums">
                  {counts[category.slug] ?? 0} pieces
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
