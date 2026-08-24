import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";
import type { Category } from "@/lib/types";

function toCategory(row: {
  slug: string;
  name: unknown;
  tagline: unknown;
  emoji: string;
  icon: string;
  gradient: string;
  image: string;
}): Category {
  return {
    slug: row.slug,
    name: row.name as Category["name"],
    tagline: row.tagline as Category["tagline"],
    emoji: row.emoji,
    icon: row.icon,
    gradient: row.gradient,
    image: row.image,
  };
}

export const getAllCategories = cache(async (): Promise<Category[]> => {
  const rows = await db.category.findMany({ orderBy: { slug: "asc" } });
  return rows.map(toCategory);
});

export const getCategoryBySlug = cache(
  async (slug: string): Promise<Category | undefined> => {
    const row = await db.category.findUnique({ where: { slug } });
    return row ? toCategory(row) : undefined;
  }
);
