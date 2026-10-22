import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";
import type { Product, ProductBadge, SizeOption } from "@/lib/types";

const include = {
  category: { select: { slug: true } },
  sizeOptions: { orderBy: { position: "asc" } },
} satisfies Prisma.ProductInclude;

/** Storefront queries only ever see products that aren't hidden. */
const visible = { active: true } satisfies Prisma.ProductWhereInput;
const orderBy = { createdAt: "asc" } satisfies Prisma.ProductOrderByWithRelationInput;

type ProductRow = Prisma.ProductGetPayload<{ include: typeof include }>;

function toProduct(row: ProductRow): Product {
  const sizeOptions: SizeOption[] = row.sizeOptions.map((option) => ({
    id: option.id,
    label: option.label as SizeOption["label"],
    price: option.price,
    originalPrice: option.originalPrice ?? undefined,
    stock: option.stock,
  }));

  return {
    id: row.id,
    slug: row.slug,
    name: row.name as Product["name"],
    shortDesc: row.shortDesc as Product["shortDesc"],
    description: row.description as Product["description"],
    price: row.price,
    originalPrice: row.originalPrice ?? undefined,
    categorySlug: row.category.slug,
    image: row.image,
    sizeOptions: sizeOptions.length ? sizeOptions : undefined,
    stock: sizeOptions.length
      ? sizeOptions.reduce((sum, option) => sum + option.stock, 0)
      : row.stock,
    rating: row.rating ?? undefined,
    reviewCount: row.reviewCount ?? undefined,
    badges: (row.badges as ProductBadge[] | null) ?? undefined,
    featured: row.featured,
  };
}

export const getAllProducts = cache(async (): Promise<Product[]> => {
  const rows = await db.product.findMany({ where: visible, include, orderBy });
  return rows.map(toProduct);
});

export const getProductBySlug = cache(
  async (slug: string): Promise<Product | undefined> => {
    const row = await db.product.findUnique({ where: { slug, ...visible }, include });
    return row ? toProduct(row) : undefined;
  }
);

export const getProductsByCategory = cache(
  async (categorySlug: string): Promise<Product[]> => {
    const rows = await db.product.findMany({
      where: { category: { slug: categorySlug }, ...visible },
      include,
      orderBy,
    });
    return rows.map(toProduct);
  }
);

export const getFeaturedProducts = cache(async (): Promise<Product[]> => {
  const rows = await db.product.findMany({
    where: { featured: true, ...visible },
    include,
    orderBy,
  });
  return rows.map(toProduct);
});

export async function getRelatedProducts(
  product: Product,
  limit = 4
): Promise<Product[]> {
  const rows = await db.product.findMany({
    where: {
      category: { slug: product.categorySlug },
      id: { not: product.id },
      ...visible,
    },
    include,
    orderBy,
    take: limit,
  });
  return rows.map(toProduct);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const rows = await db.product.findMany({ where: visible, include, orderBy });
  return rows
    .map(toProduct)
    .filter(
      (p) =>
        p.name.en.toLowerCase().includes(q) ||
        p.name.bn.includes(query.trim()) ||
        p.shortDesc.en.toLowerCase().includes(q)
    );
}
