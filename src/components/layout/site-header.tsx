import Link from "next/link";
import { Suspense } from "react";

import { Logo } from "@/components/brand/logo";
import { CartButton } from "@/components/layout/cart-button";
import { CollectionsMenu } from "@/components/layout/collections-menu";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SearchBox } from "@/components/layout/search-box";
import { Skeleton } from "@/components/ui/skeleton";
import { getCategories } from "@/lib/data";

export async function SiteHeader() {
  const categories = await getCategories();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <p className="bg-primary px-4 py-2 text-center text-xs text-primary-foreground">
        Free delivery across Bangladesh on orders over ৳1,000 · Cash on delivery
        available
      </p>

      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 sm:px-6 lg:px-8">
        <MobileNav categories={categories} />
        <Logo />

        <nav className="ml-6 hidden items-center gap-1 md:flex">
          <Link
            href="/shop"
            className="rounded-md px-2.5 py-2 text-sm hover:text-primary"
          >
            Shop all
          </Link>
          <CollectionsMenu categories={categories} />
          <Link
            href="/collections/handmade-crafts"
            className="rounded-md px-2.5 py-2 text-sm hover:text-primary"
          >
            Handmade
          </Link>
          <Link
            href="/about"
            className="rounded-md px-2.5 py-2 text-sm hover:text-primary"
          >
            Our story
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          {/* useSearchParams needs a Suspense boundary so the rest of the
              header can still be prerendered. */}
          <Suspense fallback={<Skeleton className="hidden h-10 w-64 lg:block" />}>
            <SearchBox className="hidden w-64 lg:block" />
          </Suspense>
          <CartButton />
        </div>
      </div>
    </header>
  );
}
