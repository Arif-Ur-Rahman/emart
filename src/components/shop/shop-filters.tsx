import { Check } from "lucide-react";
import Link from "next/link";

import { Separator } from "@/components/ui/separator";
import { getCategories, getCategoryCounts } from "@/lib/data";
import {
  buildShopHref,
  hasActiveFilters,
  PRICE_BANDS,
  TAG_LABELS,
  type ParsedShopParams,
  type RawSearchParams,
} from "@/lib/search-params";
import { cn } from "@/lib/utils";

/**
 * Filters are plain links that rewrite the query string, so the shop filters
 * without any client JavaScript and every filtered view is linkable.
 */
export async function ShopFilters({
  params,
  parsed,
}: {
  params: RawSearchParams;
  parsed: ParsedShopParams;
}) {
  const [categories, counts] = await Promise.all([
    getCategories(),
    getCategoryCounts(),
  ]);

  return (
    <aside className="space-y-6">
      <div className="flex items-center justify-between">
        {/* The mobile drawer supplies its own title, so this one is desktop-only. */}
        <h2 className="hidden text-xs tracking-[0.18em] text-muted-foreground uppercase lg:block">
          Filter
        </h2>
        {hasActiveFilters(parsed) && (
          <Link
            href="/shop"
            className="ml-auto text-xs text-primary underline-offset-4 hover:underline"
          >
            Clear all
          </Link>
        )}
      </div>

      <FilterGroup title="Collection">
        {categories.map((category) => (
          <FilterLink
            key={category.slug}
            href={buildShopHref(params, {
              key: "category",
              value: category.slug,
              toggle: true,
            })}
            checked={parsed.categories.includes(category.slug)}
            label={category.name}
            hint={String(counts[category.slug] ?? 0)}
          />
        ))}
      </FilterGroup>

      <Separator />

      <FilterGroup title="Price">
        {PRICE_BANDS.map((band) => (
          <FilterLink
            key={band.id}
            href={buildShopHref(params, {
              key: "price",
              value: parsed.band === band.id ? undefined : band.id,
            })}
            checked={parsed.band === band.id}
            label={band.label}
          />
        ))}
      </FilterGroup>

      <Separator />

      <FilterGroup title="Made for">
        {(Object.keys(TAG_LABELS) as (keyof typeof TAG_LABELS)[]).map((tag) => (
          <FilterLink
            key={tag}
            href={buildShopHref(params, {
              key: "tag",
              value: tag,
              toggle: true,
            })}
            checked={parsed.tags.includes(tag)}
            label={TAG_LABELS[tag]}
          />
        ))}
      </FilterGroup>
    </aside>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">{title}</h3>
      <ul className="space-y-0.5">{children}</ul>
    </div>
  );
}

function FilterLink({
  href,
  checked,
  label,
  hint,
}: {
  href: string;
  checked: boolean;
  label: string;
  hint?: string;
}) {
  return (
    <li>
      <Link
        href={href}
        scroll={false}
        aria-pressed={checked}
        className="group flex items-center gap-2.5 rounded-md py-1.5 text-sm hover:text-primary"
      >
        <span
          className={cn(
            "grid size-4 shrink-0 place-items-center rounded-[4px] border transition",
            checked
              ? "border-primary bg-primary text-primary-foreground"
              : "border-input group-hover:border-primary/50",
          )}
        >
          {checked && <Check className="size-3" strokeWidth={3} />}
        </span>
        <span className={cn("flex-1", checked && "font-medium")}>{label}</span>
        {hint && (
          <span className="text-xs text-muted-foreground tabular-nums">
            {hint}
          </span>
        )}
      </Link>
    </li>
  );
}
