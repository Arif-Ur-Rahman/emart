import Image from "next/image";
import { cn, isRemoteImage } from "@/lib/utils";

export function ProductImage({
  src,
  alt,
  className,
  sizes,
  priority,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes ?? "(min-width: 1024px) 25vw, 50vw"}
        priority={priority}
        unoptimized={isRemoteImage(src)}
        className="object-cover"
      />
    </div>
  );
}
