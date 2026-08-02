"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { SearchBox } from "@/components/layout/search-box";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Category } from "@/lib/types";

export function MobileNav({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon-lg"
          className="md:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[19rem] p-0">
        <SheetHeader className="border-b">
          <SheetTitle className="font-heading tracking-[0.14em] uppercase">
            Maloti
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4 overflow-y-auto px-6 pb-8">
          <SearchBox onSubmitted={() => setOpen(false)} />

          {/* Any link inside bubbles up here, so the drawer closes on navigation
              without an effect watching the pathname. */}
          <nav className="flex flex-col" onClick={() => setOpen(false)}>
            <Link
              href="/shop"
              className="py-2.5 text-sm font-medium hover:text-primary"
            >
              All products
            </Link>
            <Separator className="my-2" />
            <p className="pb-1 text-xs tracking-[0.18em] text-muted-foreground uppercase">
              Collections
            </p>
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/collections/${category.slug}`}
                className="flex items-baseline justify-between gap-3 py-2.5 text-sm hover:text-primary"
              >
                {category.name}
                <span className="text-xs text-muted-foreground">
                  {category.nameBn}
                </span>
              </Link>
            ))}
            <Separator className="my-2" />
            <Link
              href="/about"
              className="py-2.5 text-sm hover:text-primary"
            >
              Our story
            </Link>
            <Link href="/cart" className="py-2.5 text-sm hover:text-primary">
              Your bag
            </Link>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
