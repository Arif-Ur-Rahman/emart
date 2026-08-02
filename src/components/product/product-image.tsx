import Image from "next/image";

import { ProductMotif } from "@/components/product/product-motif";
import { cn } from "@/lib/utils";

/**
 * Renders product photography when it exists and falls back to the generated
 * ornament motif when it doesn't, so the catalogue looks finished either way.
 */
export function ProductImage({
  src,
  alt,
  seed,
  sizes,
  priority,
  className,
}: {
  src?: string;
  alt: string;
  seed: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  if (!src) {
    return <ProductMotif seed={seed} className={className} />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={cn("object-cover", className)}
    />
  );
}
