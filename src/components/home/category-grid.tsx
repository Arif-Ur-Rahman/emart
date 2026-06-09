"use client";

import Link from "next/link";
import { getAllCategories } from "@/lib/categories";
import { useLanguage } from "@/i18n/language-context";

export function CategoryGrid() {
  const { t, tl } = useLanguage();
  const categories = getAllCategories();

  return (
    <section id="categories" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-12">
      <h2 className="mb-6 text-center text-2xl font-bold sm:text-3xl">
        {t("home.categories.title")}
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-8">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            className="group flex flex-col items-center gap-2 rounded-2xl border bg-card p-4 text-center transition-shadow hover:shadow-md"
          >
            <span
              className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${c.gradient} transition-transform group-hover:scale-110`}
            >
              <span className="text-3xl">{c.emoji}</span>
            </span>
            <span className="text-xs font-semibold sm:text-sm">{tl(c.name)}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
