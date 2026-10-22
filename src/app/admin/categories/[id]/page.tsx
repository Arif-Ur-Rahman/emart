import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAdminCategory } from "@/lib/data/admin";
import type { Localized } from "@/lib/types";
import { PageHeader } from "@/components/admin/page-header";
import { CategoryForm } from "@/components/admin/category-form";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const category = await getAdminCategory((await params).id);
  return { title: category ? (category.name as Localized).en : "Category" };
}

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await getAdminCategory(id);
  if (!category) notFound();

  const name = category.name as Localized;
  const tagline = category.tagline as Localized;

  return (
    <>
      <Link
        href="/admin/categories"
        className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Categories
      </Link>
      <PageHeader title={name.en} />
      <CategoryForm
        productCount={category._count.products}
        initial={{
          id: category.id,
          slug: category.slug,
          nameEn: name.en,
          nameBn: name.bn,
          taglineEn: tagline.en,
          taglineBn: tagline.bn,
          emoji: category.emoji,
          image: category.image,
          gradient: category.gradient,
        }}
      />
    </>
  );
}
