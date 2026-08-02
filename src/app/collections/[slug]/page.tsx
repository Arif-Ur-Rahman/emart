import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductGrid } from "@/components/product/product-grid";
import { ProductMotif } from "@/components/product/product-motif";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { getCategories, getCategory, getProducts } from "@/lib/data";
import type { CategorySlug } from "@/lib/types";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) return { title: "Collection not found" };

  return {
    title: category.name,
    description: category.description,
    openGraph: { title: `${category.name} · Maloti`, description: category.description },
  };
}

export default async function CollectionPage({ params }: { params: Params }) {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) notFound();

  const products = await getProducts({
    category: category.slug as CategorySlug,
    sort: "featured",
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/shop">Shop</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{category.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mt-6 grid gap-8 overflow-hidden rounded-xl border bg-card md:grid-cols-[1fr_18rem]">
        <div className="space-y-3 p-8">
          <p className="text-xs tracking-[0.24em] text-primary uppercase">
            Collection
          </p>
          <h1 className="font-heading text-4xl font-semibold">
            {category.name}
            <span className="ml-3 align-middle text-xl text-muted-foreground">
              {category.nameBn}
            </span>
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            {category.description}
          </p>
          <p className="pt-1 text-sm text-muted-foreground tabular-nums">
            {products.length} {products.length === 1 ? "piece" : "pieces"}
          </p>
        </div>
        <div className="hidden md:block">
          <ProductMotif seed={category.slug} className="size-full" />
        </div>
      </header>

      {products.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-24 text-center">
          <p className="text-sm text-muted-foreground">
            This collection is being restocked.
          </p>
          <Button asChild variant="outline">
            <Link href="/shop">Browse everything else</Link>
          </Button>
        </div>
      ) : (
        <ProductGrid products={products} priorityCount={4} className="mt-10" />
      )}
    </div>
  );
}
