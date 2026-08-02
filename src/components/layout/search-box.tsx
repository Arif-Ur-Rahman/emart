"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/** Submits to /shop?q=… — the filtering itself happens on the server. */
export function SearchBox({
  className,
  onSubmitted,
}: {
  className?: string;
  onSubmitted?: () => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  return (
    <form
      role="search"
      className={cn("relative", className)}
      onSubmit={(event) => {
        event.preventDefault();
        const value = String(
          new FormData(event.currentTarget).get("q") ?? "",
        ).trim();
        router.push(value ? `/shop?q=${encodeURIComponent(value)}` : "/shop");
        onSubmitted?.();
      }}
    >
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        // Uncontrolled, re-keyed on the URL so back/forward and category links
        // reset the field without an effect syncing state.
        key={query}
        type="search"
        name="q"
        defaultValue={query}
        placeholder="Search bangles, hair bands…"
        aria-label="Search products"
        className="h-10 pl-9"
      />
    </form>
  );
}
