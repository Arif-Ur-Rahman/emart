import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DEFAULT_CATEGORY_GRADIENT } from "@/lib/category-styles";
import { PageHeader } from "@/components/admin/page-header";
import { CategoryForm } from "@/components/admin/category-form";

export const metadata = { title: "New category" };

export default function NewCategoryPage() {
  return (
    <>
      <Link
        href="/admin/categories"
        className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Categories
      </Link>
      <PageHeader title="New category" />
      <CategoryForm
        productCount={0}
        initial={{
          slug: "",
          nameEn: "",
          nameBn: "",
          taglineEn: "",
          taglineBn: "",
          emoji: "👕",
          image: "",
          gradient: DEFAULT_CATEGORY_GRADIENT,
        }}
      />
    </>
  );
}
