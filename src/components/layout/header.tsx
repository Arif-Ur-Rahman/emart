"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, ShoppingCart, Leaf } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import { useCart } from "@/context/cart-context";
import { getAllCategories } from "@/lib/categories";
import { formatNumber } from "@/lib/format";
import { LanguageToggle } from "@/components/language-toggle";
import { SearchBar } from "./search-bar";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function CartButton() {
  const { count, setOpen } = useCart();
  const { lang } = useLanguage();
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label="Open cart"
      className="relative flex h-10 w-10 items-center justify-center rounded-full text-foreground transition hover:bg-accent"
    >
      <ShoppingCart className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">
          {formatNumber(count, lang)}
        </span>
      )}
    </button>
  );
}

function Logo() {
  const { t } = useLanguage();
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Leaf className="h-5 w-5" />
      </span>
      <span className="text-lg font-bold leading-none tracking-tight">
        {t("footer.about.title")}
      </span>
    </Link>
  );
}

export function Header() {
  const { t, tl } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const categories = getAllCategories();

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/shop", label: t("nav.shop") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
        {/* Mobile menu */}
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger
            aria-label="Open menu"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "md:hidden"
            )}
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle>{t("footer.about.title")}</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-2">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent"
                >
                  {l.label}
                </Link>
              ))}
              <p className="mt-3 px-3 text-xs font-semibold uppercase text-muted-foreground">
                {t("nav.categories")}
              </p>
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/category/${c.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-accent"
                >
                  <span className="text-lg">{c.emoji}</span>
                  {tl(c.name)}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <Logo />

        {/* Desktop nav */}
        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-foreground/80 transition hover:bg-accent hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden flex-1 px-4 lg:block">
          <SearchBar />
        </div>

        <div className="ml-auto flex items-center gap-1 sm:gap-2 lg:ml-0">
          <LanguageToggle className="hidden sm:inline-flex" />
          <CartButton />
        </div>
      </div>

      {/* Mobile search row */}
      <div className="border-t px-4 py-2 lg:hidden">
        <SearchBar />
      </div>
    </header>
  );
}
