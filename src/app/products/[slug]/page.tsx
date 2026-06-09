import type { Metadata } from "next";
import { getAllProducts, getProductBySlug } from "@/lib/products";
import { ProductDetail } from "@/components/product/product-detail";

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  return {
    title: product ? `${product.name.en} — Ghorer Bazar` : "Ghorer Bazar",
    description: product?.shortDesc.en,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProductDetail slug={slug} />;
}
