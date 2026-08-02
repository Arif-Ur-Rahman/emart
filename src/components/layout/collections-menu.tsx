"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Category } from "@/lib/types";

export function CollectionsMenu({ categories }: { categories: Category[] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 text-sm font-normal">
          Collections
          <ChevronDown className="size-3.5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-72">
        {categories.map((category) => (
          <DropdownMenuItem key={category.slug} asChild>
            <Link
              href={`/collections/${category.slug}`}
              className="flex cursor-pointer flex-col items-start gap-0.5 py-2"
            >
              <span className="flex w-full items-baseline justify-between gap-3">
                <span className="font-medium">{category.name}</span>
                <span className="text-xs text-muted-foreground">
                  {category.nameBn}
                </span>
              </span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
