import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { listAdminCategories } from "@/lib/data/admin";
import { PageHeader } from "@/components/admin/page-header";
import { ProductForm } from "@/components/admin/product-form";

export const metadata = { title: "New product" };

export default async function NewProductPage() {
  const categories = await listAdminCategories();

  return (
    <>
      <Link
        href="/admin/products"
        className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Products
      </Link>
      <PageHeader title="New product" />
      <ProductForm
        orderCount={0}
        categories={categories.map((c) => ({ id: c.id, name: c.name.en }))}
        initial={{
          slug: "",
          nameEn: "",
          nameBn: "",
          shortDescEn: "",
          shortDescBn: "",
          descriptionEn: "",
          descriptionBn: "",
          categoryId: "",
          image: "",
          badges: [],
          featured: false,
          active: true,
          price: "",
          originalPrice: "",
          stock: "0",
          sizes: [],
        }}
      />
    </>
  );
}
