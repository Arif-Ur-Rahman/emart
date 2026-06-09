"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/language-context";
import { formatNumber } from "@/lib/format";

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
  className,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const { lang } = useLanguage();
  const btn =
    size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const text = size === "sm" ? "w-8 text-sm" : "w-12 text-base";

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border bg-background",
        className
      )}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={cn(
          "flex items-center justify-center rounded-full text-foreground/70 transition hover:text-foreground disabled:opacity-40",
          btn
        )}
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className={cn("text-center font-medium tabular-nums", text)}>
        {formatNumber(value, lang)}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={cn(
          "flex items-center justify-center rounded-full text-foreground/70 transition hover:text-foreground disabled:opacity-40",
          btn
        )}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
