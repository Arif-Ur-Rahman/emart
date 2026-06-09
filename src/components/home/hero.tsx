"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  const { t } = useLanguage();
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-amber-50/60 via-background to-background">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:py-20">
        <div className="text-center md:text-left">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            🌿 100% Organic · খাঁটি পণ্য
          </span>
          <h1 className="mt-4 whitespace-pre-line text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl">
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
            {[
              { e: "🍯", g: "from-amber-50 to-amber-100" },
              { e: "🧈", g: "from-amber-50 to-yellow-100" },
              { e: "🌰", g: "from-orange-50 to-amber-100" },
              { e: "🥜", g: "from-amber-50 to-orange-100" },
            ].map((it, i) => (
              <div
                key={i}
                className={`flex h-32 w-32 items-center justify-center rounded-3xl border border-foreground/5 bg-gradient-to-br shadow-sm ${it.g} ${
                  i % 2 === 1 ? "translate-y-6" : ""
                }`}
              >
                <span className="text-6xl">{it.e}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
