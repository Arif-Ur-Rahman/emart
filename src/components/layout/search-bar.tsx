"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { searchProducts } from "@/lib/products";
import { getCategoryBySlug } from "@/lib/categories";
import { useLanguage } from "@/i18n/language-context";
import { formatPrice } from "@/lib/format";
import { ProductImage } from "@/components/product/product-image";
import { cn } from "@/lib/utils";

export function SearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const { t, tl, lang } = useLanguage();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const results = query.trim() ? searchProducts(query).slice(0, 6) : [];
  const showDropdown = focused && query.trim().length > 0;

  function go(slug: string) {
    setQuery("");
    setFocused(false);
    router.push(`/products/${slug}`);
  }

  return (
    <div className={cn("relative", className)}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (results[0]) go(results[0].slug);
          else router.push("/shop");
        }}
        className="relative"
      >
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            blurTimer.current = setTimeout(() => setFocused(false), 150);
          }}
          placeholder={t("search.placeholder")}
          className="h-10 w-full rounded-full border bg-muted/50 pl-9 pr-4 text-sm outline-none transition focus:border-primary focus:bg-background"
        />
      </form>

      {showDropdown && (
        <div
          className="absolute left-0 right-0 top-12 z-50 overflow-hidden rounded-xl border bg-popover shadow-lg"
          onMouseDown={() => {
            if (blurTimer.current) clearTimeout(blurTimer.current);
          }}
        >
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted-foreground">
              {t("search.empty")}
            </p>
          ) : (
            <ul className="max-h-80 overflow-auto py-1">
              {results.map((p) => {
                const category = getCategoryBySlug(p.categorySlug);
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => go(p.slug)}
                      className="flex w-full items-center gap-3 px-3 py-2 text-left transition hover:bg-accent"
                    >
                      <ProductImage
                        emoji={p.emoji ?? category?.emoji ?? "🛍️"}
                        gradient={category?.gradient ?? "from-stone-100 to-stone-200"}
                        className="h-10 w-10 shrink-0 rounded-lg"
                        emojiClassName="text-lg"
                      />
                      <span className="flex-1 truncate text-sm font-medium">
                        {tl(p.name)}
                      </span>
                      <span className="text-sm font-semibold text-primary">
                        {formatPrice(p.price, lang)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
