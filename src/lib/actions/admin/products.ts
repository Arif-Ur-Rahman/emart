"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";
import { verifyAdmin } from "@/lib/dal";
import type { ProductBadge } from "@/lib/types";
import { fieldErrors, type FormState } from "./form-state";

const BADGES = ["bestseller", "new", "organic"] as const satisfies readonly ProductBadge[];

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const IMAGE_RE = /^(\/[^\s]*|https:\/\/[^\s]+)$/;

/** A required whole number ≥ 0, entered as text. */
const wholeNumber = (label: string) =>
  z
    .string()
    .trim()
    .min(1, { error: `Enter ${label}.` })
    .pipe(
      z.coerce
        .number<string>({ error: `${label} must be a number.` })
        .int({ error: `${label} must be a whole number.` })
        .min(0, { error: `${label} can't be negative.` })
    );

/** An optional "compare at" price; blank means none. */
const optionalPrice = z
  .string()
  .trim()
  .transform((value) => (value === "" ? undefined : value))
  .pipe(
    z.coerce
      .number<string>({ error: "Compare-at price must be a number." })
      .int({ error: "Compare-at price must be a whole number." })
      .positive({ error: "Compare-at price must be above zero." })
      .optional()
  );

const SizeSchema = z
  .object({
    id: z.string().optional(),
    sizeId: z
      .string()
      .trim()
      .toLowerCase()
      .regex(/^[a-z0-9-]+$/, { error: "Use letters, numbers or dashes." }),
    labelEn: z.string().trim().min(1, { error: "Enter a label." }),
    labelBn: z.string().trim().min(1, { error: "Enter a Bangla label." }),
    price: wholeNumber("a price"),
    originalPrice: optionalPrice,
    stock: wholeNumber("stock"),
  })
  .refine((s) => s.originalPrice === undefined || s.originalPrice > s.price, {
    error: "Must be higher than the price.",
    path: ["originalPrice"],
  });

const ProductSchema = z
  .object({
    slug: z.string().trim().regex(SLUG_RE, {
      error: "Use lowercase letters, numbers and dashes, e.g. black-denim-jacket.",
    }),
    nameEn: z.string().trim().min(2, { error: "Enter the English name." }),
    nameBn: z.string().trim().min(2, { error: "Enter the Bangla name." }),
    shortDescEn: z.string().trim().min(1, { error: "Enter a short description." }),
    shortDescBn: z.string().trim().min(1, { error: "Enter a Bangla short description." }),
    descriptionEn: z.string().trim().min(1, { error: "Enter a description." }),
    descriptionBn: z.string().trim().min(1, { error: "Enter a Bangla description." }),
    categoryId: z.string().min(1, { error: "Choose a category." }),
    image: z.string().trim().regex(IMAGE_RE, {
      error: "Enter a path like /cloths/shirts/photo.jpg or an https:// URL.",
    }),
    badges: z.array(z.enum(BADGES)),
    featured: z.boolean(),
    active: z.boolean(),
    hasSizes: z.boolean(),
    price: z.string(),
    originalPrice: z.string(),
    stock: z.string(),
    sizes: z.array(SizeSchema),
  })
  .superRefine((p, ctx) => {
    if (p.hasSizes) {
      if (p.sizes.length === 0) {
        ctx.addIssue({ code: "custom", path: ["sizes"], message: "Add at least one size." });
      }
      const seen = new Set<string>();
      p.sizes.forEach((size, index) => {
        if (seen.has(size.sizeId)) {
          ctx.addIssue({
            code: "custom",
            path: ["sizes", index, "sizeId"],
            message: "Each size needs a unique code.",
          });
        }
        seen.add(size.sizeId);
      });
      return;
    }

    // Single-variant product: validate the product-level price and stock.
    const checks = [
      ["price", wholeNumber("a price").safeParse(p.price)],
      ["stock", wholeNumber("stock").safeParse(p.stock)],
      ["originalPrice", optionalPrice.safeParse(p.originalPrice)],
    ] as const;
    for (const [path, result] of checks) {
      if (!result.success) {
        ctx.addIssue({ code: "custom", path: [path], message: result.error.issues[0].message });
      }
    }
    const price = Number(p.price);
    const original = p.originalPrice.trim() ? Number(p.originalPrice) : undefined;
    if (original !== undefined && original <= price) {
      ctx.addIssue({
        code: "custom",
        path: ["originalPrice"],
        message: "Must be higher than the price.",
      });
    }
  });

function parseSizes(raw: FormDataEntryValue | null): unknown {
  try {
    return JSON.parse(String(raw ?? "[]"));
  } catch {
    return [];
  }
}

export async function saveProduct(_prev: FormState, formData: FormData): Promise<FormState> {
  await verifyAdmin();

  const id = (formData.get("id") as string | null) || null;
  const parsed = ProductSchema.safeParse({
    slug: formData.get("slug") ?? "",
    nameEn: formData.get("nameEn") ?? "",
    nameBn: formData.get("nameBn") ?? "",
    shortDescEn: formData.get("shortDescEn") ?? "",
    shortDescBn: formData.get("shortDescBn") ?? "",
    descriptionEn: formData.get("descriptionEn") ?? "",
    descriptionBn: formData.get("descriptionBn") ?? "",
    categoryId: formData.get("categoryId") ?? "",
    image: formData.get("image") ?? "",
    badges: formData.getAll("badges"),
    featured: formData.get("featured") === "on",
    active: formData.get("active") === "on",
    hasSizes: formData.get("hasSizes") === "on",
    price: formData.get("price") ?? "",
    originalPrice: formData.get("originalPrice") ?? "",
    stock: formData.get("stock") ?? "",
    sizes: formData.get("hasSizes") === "on" ? parseSizes(formData.get("sizes")) : [],
  });

  if (!parsed.success) {
    return { errors: fieldErrors(parsed.error), message: "Please fix the highlighted fields." };
  }
  const p = parsed.data;

  const category = await db.category.findUnique({ where: { id: p.categoryId } });
  if (!category) return { errors: { categoryId: "Choose a category." } };

  // With sizes, the product's own price mirrors its first size (see Product type).
  const first = p.sizes[0];
  const data = {
    slug: p.slug,
    name: { en: p.nameEn, bn: p.nameBn },
    shortDesc: { en: p.shortDescEn, bn: p.shortDescBn },
    description: { en: p.descriptionEn, bn: p.descriptionBn },
    categoryId: p.categoryId,
    image: p.image,
    badges: p.badges,
    featured: p.featured,
    active: p.active,
    price: p.hasSizes ? first.price : Number(p.price),
    originalPrice: p.hasSizes
      ? (first.originalPrice ?? null)
      : p.originalPrice.trim()
        ? Number(p.originalPrice)
        : null,
    stock: p.hasSizes ? 0 : Number(p.stock),
  };
  const sizeData = (size: (typeof p.sizes)[number], position: number) => ({
    sizeId: size.sizeId,
    label: { en: size.labelEn, bn: size.labelBn },
    price: size.price,
    originalPrice: size.originalPrice ?? null,
    stock: size.stock,
    position,
  });

  try {
    await db.$transaction(async (tx) => {
      if (!id) {
        await tx.product.create({
          data: { ...data, sizeOptions: { create: p.sizes.map(sizeData) } },
        });
        return;
      }

      await tx.product.update({ where: { id }, data });

      const keepIds = p.sizes.flatMap((size) => (size.id ? [size.id] : []));
      await tx.sizeOption.deleteMany({ where: { productId: id, id: { notIn: keepIds } } });

      // Park kept sizes on temporary codes first so renaming or swapping
      // codes (e.g. "m" ↔ "l") can't trip the per-product unique constraint.
      for (const sizeId of keepIds) {
        await tx.sizeOption.updateMany({
          where: { id: sizeId, productId: id },
          data: { sizeId: `__tmp_${sizeId}` },
        });
      }
      for (const [position, size] of p.sizes.entries()) {
        if (size.id) {
          await tx.sizeOption.updateMany({
            where: { id: size.id, productId: id },
            data: sizeData(size, position),
          });
        } else {
          await tx.sizeOption.create({ data: { ...sizeData(size, position), productId: id } });
        }
      }
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { errors: { slug: "Another product already uses this URL slug." } };
    }
    throw error;
  }

  revalidatePath("/", "layout");
  redirect("/admin/products");
}

export async function deleteProduct(id: string): Promise<FormState> {
  await verifyAdmin();

  const orderCount = await db.orderItem.count({ where: { productId: id } });
  if (orderCount > 0) {
    return {
      message: "This product appears in past orders, so it can't be deleted. Hide it instead.",
    };
  }

  await db.product.delete({ where: { id } });
  revalidatePath("/", "layout");
  redirect("/admin/products");
}
