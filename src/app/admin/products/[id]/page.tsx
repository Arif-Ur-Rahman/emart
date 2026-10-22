import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getAdminProduct, listAdminCategories } from "@/lib/data/admin";
import type { Localized } from "@/lib/types";
import { PageHeader } from "@/components/admin/page-header";
import { ProductForm } from "@/components/admin/product-form";
import { buttonVariants } from "@/components/ui/button";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const product = await getAdminProduct((await params).id);
  return { title: product ? (product.name as Localized).en : "Product" };
}

const text = (value: number | null) => (value == null ? "" : String(value));

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([getAdminProduct(id), listAdminCategories()]);
  if (!product) notFound();

  const name = product.name as Localized;
  const shortDesc = product.shortDesc as Localized;
  const description = product.description as Localized;

  return (
    <>
      <Link
        href="/admin/products"
        className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Products
      </Link>
      <PageHeader
        title={name.en}
        actions={
          product.active && (
            <Link
              href={`/products/${product.slug}`}
              target="_blank"
              className={buttonVariants({ variant: "outline" })}
            >
              View in store <ExternalLink className="h-4 w-4" />
            </Link>
          )
        }
      />
      <ProductForm
        orderCount={product._count.orderItems}
        categories={categories.map((c) => ({ id: c.id, name: c.name.en }))}
        initial={{
          id: product.id,
          slug: product.slug,
          nameEn: name.en,
          nameBn: name.bn,
          shortDescEn: shortDesc.en,
          shortDescBn: shortDesc.bn,
          descriptionEn: description.en,
          descriptionBn: description.bn,
          categoryId: product.categoryId,
          image: product.image,
          badges: (product.badges as string[] | null) ?? [],
          featured: product.featured,
          active: product.active,
          price: text(product.price),
          originalPrice: text(product.originalPrice),
          stock: text(product.stock),
          sizes: product.sizeOptions.map((size) => ({
            id: size.id,
            sizeId: size.sizeId,
            labelEn: (size.label as Localized).en,
            labelBn: (size.label as Localized).bn,
            price: text(size.price),
            originalPrice: text(size.originalPrice),
            stock: text(size.stock),
          })),
        }}
      />
    </>
  );
}
