"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SORT_LABELS } from "@/lib/search-params";
import type { SortOption } from "@/lib/types";

export function SortSelect({ value }: { value: SortOption }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <Select
      value={value}
      onValueChange={(next) => {
        const params = new URLSearchParams(searchParams.toString());
        if (next === "featured") {
          params.delete("sort");
        } else {
          params.set("sort", next);
        }
        const query = params.toString();
        router.push(query ? `${pathname}?${query}` : pathname, {
          scroll: false,
        });
      }}
    >
      <SelectTrigger className="h-9 w-[11.5rem]" aria-label="Sort products">
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
          <SelectItem key={option} value={option}>
            {SORT_LABELS[option]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
