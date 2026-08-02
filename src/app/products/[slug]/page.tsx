import { Check, Star, Truck, Undo2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AddToCartForm } from "@/components/product/add-to-cart-form";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductImage } from "@/components/product/product-image";
import { ProductMotif } from "@/components/product/product-motif";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  discountPercent,
  FREE_SHIPPING_THRESHOLD,
  formatTaka,
  SHIPPING_FLAT_RATE,
} from "@/lib/currency";
import {
  getAllProductSlugs,
  getCategory,
  getProduct,
  getRelatedProducts,
} from "@/lib/data";
import { TAG_LABELS } from "@/lib/search-params";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) return { title: "Product not found" };

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} · Maloti`,
      description: product.description,
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const [category, related] = await Promise.all([
    getCategory(product.category),
    getRelatedProducts(product, 4),
  ]);

  const discount = discountPercent(product.price, product.compareAtPrice);
  const soldOut = product.stock === 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.id,
    material: product.materials.join(", "),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "BDT",
      availability: soldOut
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        // Product data is ours, not user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
              <Link href={`/collections/${product.category}`}>
                {category?.name ?? "Shop"}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="space-y-3">
          <div className="relative aspect-square overflow-hidden rounded-xl border bg-muted">
            <ProductImage
              src={product.image}
              alt={product.name}
              seed={product.slug}
              priority
              sizes="(min-width: 1024px) 46vw, 100vw"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {["detail", "angle", "worn"].map((view) => (
              <div
                key={view}
                className="aspect-square overflow-hidden rounded-lg border bg-muted"
              >
                <ProductMotif seed={`${product.slug}-${view}`} />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {TAG_LABELS[tag]}
                </Badge>
              ))}
            </div>

            <h1 className="font-heading text-4xl leading-tight font-semibold text-balance-heading">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={
                      index < Math.round(product.rating)
                        ? "size-4 fill-gold text-gold"
                        : "size-4 text-muted-foreground/40"
                    }
                  />
                ))}
              </span>
              <span className="tabular-nums">{product.rating.toFixed(1)}</span>
              <span aria-hidden>·</span>
              <span className="tabular-nums">
                {product.reviewCount} reviews
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-baseline gap-3">
            <span className="font-heading text-3xl font-semibold lining-nums tabular-nums">
              {formatTaka(product.price)}
            </span>
            {product.compareAtPrice && (
              <>
                <span className="text-lg text-muted-foreground line-through tabular-nums">
                  {formatTaka(product.compareAtPrice)}
                </span>
                <Badge>Save {discount}%</Badge>
              </>
            )}
          </div>

          <p className="leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Colours</dt>
              <dd className="mt-1">{product.colors.join(" · ")}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Materials</dt>
              <dd className="mt-1">{product.materials.join(" · ")}</dd>
            </div>
          </dl>

          <div className="flex items-center gap-2 text-sm">
            {soldOut ? (
              <span className="text-muted-foreground">
                Out of stock — restocking soon.
              </span>
            ) : (
              <>
                <Check className="size-4 text-primary" />
                <span>
                  In stock
                  {product.stock <= 8 && (
                    <span className="text-primary">
                      {" "}
                      — only {product.stock} left
                    </span>
                  )}
                </span>
              </>
            )}
          </div>

          <AddToCartForm product={product} />

          <Separator />

          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li className="flex items-start gap-2.5">
              <Truck className="mt-0.5 size-4 shrink-0 text-primary" />
              Free delivery over {formatTaka(FREE_SHIPPING_THRESHOLD)}, otherwise{" "}
              {formatTaka(SHIPPING_FLAT_RATE)} flat. Cash on delivery available.
            </li>
            <li className="flex items-start gap-2.5">
              <Undo2 className="mt-0.5 size-4 shrink-0 text-primary" />
              7-day exchange on unworn pieces in their original packaging.
            </li>
          </ul>

          <Accordion type="single" collapsible defaultValue="details">
            <AccordionItem value="details">
              <AccordionTrigger>Details</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  {product.details.map((detail) => (
                    <li key={detail} className="flex gap-2">
                      <span aria-hidden className="text-primary">
                        —
                      </span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="care">
              <AccordionTrigger>Care</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                Keep away from perfume and water. Wipe with a soft dry cloth
                after wearing and store in the pouch it came in — plated and
                oxidised finishes last years when they stay dry.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="delivery">
              <AccordionTrigger>Delivery &amp; returns</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                Inside Dhaka 1–2 working days, outside Dhaka 2–4. We send a
                tracking message on the number you order with. Exchanges within
                7 days; made-to-order pieces are final sale.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-heading text-2xl font-semibold">
            Wears well with
          </h2>
          <ProductGrid products={related} className="mt-6" />
        </section>
      )}
    </div>
  );
}
