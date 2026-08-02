"use client";

import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

/**
 * Wraps the server-rendered <ShopFilters> in a drawer for small screens.
 * The filters themselves stay a Server Component — they're passed as children.
 */
export function MobileFilters({
  children,
  activeCount,
}: {
  children: React.ReactNode;
  activeCount: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="lg" className="h-9 lg:hidden">
          <SlidersHorizontal className="size-4" />
          Filters
          {activeCount > 0 && (
            <span className="ml-1 grid size-4.5 place-items-center rounded-full bg-primary text-[0.625rem] text-primary-foreground tabular-nums">
              {activeCount}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[19rem] overflow-y-auto px-6 pb-10">
        <SheetHeader className="px-0">
          <SheetTitle className="font-heading text-lg">Filters</SheetTitle>
        </SheetHeader>
        {/* Every filter is a link, so a click here means we've navigated. */}
        <div onClick={() => setOpen(false)}>{children}</div>
      </SheetContent>
    </Sheet>
  );
}
