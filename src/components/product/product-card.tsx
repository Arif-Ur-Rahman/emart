import { Star } from "lucide-react";
import Link from "next/link";

import { ProductImage } from "@/components/product/product-image";
import { QuickAddButton } from "@/components/product/quick-add-button";
import { Badge } from "@/components/ui/badge";
import { discountPercent, formatTaka } from "@/lib/currency";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

const TAG_LABELS: Record<Product["tags"][number], string> = {
  new: "New",
  bestseller: "Bestseller",
  handmade: "Handmade",
  limited: "Limited",
};

export function ProductCard({
  product,
  priority,
  className,
}: {
  product: Product;
  priority?: boolean;
  className?: string;
}) {
  const discount = discountPercent(product.price, product.compareAtPrice);
  const soldOut = product.stock === 0;
  const lowStock = !soldOut && product.stock <= 8;
  // One badge only — the card gets noisy fast.
  const headlineTag = product.tags.find(
    (tag) => tag === "new" || tag === "limited" || tag === "bestseller",
  );

  return (
    <article className={cn("group relative", className)}>
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
          <ProductImage
            src={product.image}
            alt={product.name}
            seed={product.slug}
            priority={priority}
            sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 45vw"
            className="transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
            {discount > 0 && (
              <Badge className="bg-primary text-primary-foreground">
                −{discount}%
              </Badge>
            )}
            {headlineTag && discount === 0 && (
              <Badge variant="secondary" className="bg-background/90 backdrop-blur">
                {TAG_LABELS[headlineTag]}
              </Badge>
            )}
          </div>

          {soldOut && (
            <div className="absolute inset-0 grid place-items-center bg-background/70">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-foreground">
                Sold out
              </span>
            </div>
          )}
        </div>

        <div className="mt-3 space-y-1">
          <h3 className="text-sm leading-snug font-medium group-hover:text-primary">
            {product.name}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Star className="size-3 fill-gold text-gold" />
            <span className="tabular-nums">{product.rating.toFixed(1)}</span>
            <span aria-hidden>·</span>
            <span className="tabular-nums">{product.reviewCount} reviews</span>
          </div>

          <div className="flex items-baseline gap-2 pt-0.5">
            <span className="font-heading text-base font-semibold lining-nums tabular-nums">
              {formatTaka(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-muted-foreground line-through tabular-nums">
                {formatTaka(product.compareAtPrice)}
              </span>
            )}
          </div>

          {lowStock && (
            <p className="text-xs text-primary">Only {product.stock} left</p>
          )}
        </div>
      </Link>

      {/* Overlaid on the image, outside the <Link> so the click doesn't navigate.
          Always visible on touch, revealed on hover for pointer devices. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 aspect-square">
        <div className="pointer-events-auto absolute bottom-2.5 right-2.5 transition duration-200 md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:focus-within:translate-y-0 md:focus-within:opacity-100">
          <QuickAddButton product={product} />
        </div>
      </div>
    </article>
  );
}
