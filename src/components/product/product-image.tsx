import { cn } from "@/lib/utils";

/**
 * Lightweight placeholder "image" — a branded gradient tile with the product's
 * emoji. Avoids shipping real image assets while the catalog is still mock data.
 * Swap this component for next/image once real product photos exist.
 */
export function ProductImage({
  emoji,
  gradient,
  className,
  emojiClassName,
}: {
  emoji: string;
  gradient: string;
  className?: string;
  emojiClassName?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "flex items-center justify-center bg-gradient-to-br",
        gradient,
        className
      )}
    >
      <span className={cn("select-none drop-shadow-sm", emojiClassName)}>
        {emoji}
      </span>
    </div>
  );
}
