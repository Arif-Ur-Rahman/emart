"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import type { Category } from "@/lib/types";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero({ categories }: { categories: Category[] }) {
  const { t, tl } = useLanguage();
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-accent/40 via-background to-background">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:py-20">
        <div className="text-center md:text-left">
          <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
            ✨ New Season · নতুন কালেকশন
          </span>
          <h1 className="font-heading mt-4 whitespace-pre-line text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-5xl">
            {t("home.hero.title")}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base text-muted-foreground md:mx-0">
            {t("home.hero.subtitle")}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
            <Link
              href="/shop"
              className={cn(buttonVariants({ size: "lg" }), "rounded-full")}
            >
              {t("home.hero.cta")}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
            <Link
              href="/#categories"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "rounded-full"
              )}
            >
              {t("home.hero.cta2")}
            </Link>
          </div>
        </div>

        <div className="relative hidden justify-center md:flex">
          <div className="grid grid-cols-2 gap-4">
            {categories.map((c, i) => (
              <div
                key={c.slug}
                className={`relative h-32 w-32 overflow-hidden rounded-3xl border border-foreground/5 bg-gradient-to-br shadow-sm ${c.gradient} ${
                  i % 2 === 1 ? "translate-y-6" : ""
                }`}
              >
                <Image
                  src={c.image}
                  alt={tl(c.name)}
                  fill
                  sizes="128px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
