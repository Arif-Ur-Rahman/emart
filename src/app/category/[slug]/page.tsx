import type { Metadata } from "next";
import { getAllCategories, getCategoryBySlug } from "@/lib/categories";
import { CategoryView } from "@/components/category/category-view";

export function generateStaticParams() {
  return getAllCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  return {
    title: category ? `${category.name.en} — Ghorer Bazar` : "Ghorer Bazar",
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CategoryView slug={slug} />;
}
