import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProductGrid({
  products,
  /** Marks the first row as priority so LCP images aren't lazy-loaded. */
  priorityCount = 0,
  className,
}: {
  products: Product[];
  priorityCount?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4",
        className,
      )}
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={index < priorityCount}
        />
      ))}
    </div>
  );
}
