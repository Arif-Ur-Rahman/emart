import Link from "next/link";

import { cn } from "@/lib/utils";

/** The maloti bloom that sits beside the wordmark. */
export function MalotiMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={cn("size-7", className)}
    >
      <g fill="none" stroke="currentColor" strokeWidth={1.6}>
        {[0, 72, 144, 216, 288].map((angle) => (
          <ellipse
            key={angle}
            cx={16}
            cy={9.5}
            rx={4.2}
            ry={7}
            transform={`rotate(${angle} 16 16)`}
          />
        ))}
      </g>
      <circle cx={16} cy={16} r={2.6} fill="currentColor" />
    </svg>
  );
}

export function Logo({
  className,
  href = "/",
}: {
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      aria-label="Maloti — home"
      className={cn(
        "flex items-center gap-2 text-primary transition-opacity hover:opacity-80",
        className,
      )}
    >
      <MalotiMark />
      <span className="flex flex-col leading-none">
        <span className="font-heading text-xl font-semibold tracking-[0.14em] uppercase">
          Maloti
        </span>
        <span className="text-[0.6rem] tracking-[0.24em] text-muted-foreground uppercase">
          Ornaments
        </span>
      </span>
    </Link>
  );
}
