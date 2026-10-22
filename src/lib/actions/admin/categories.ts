"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";
import { verifyAdmin } from "@/lib/dal";
import { CATEGORY_GRADIENTS } from "@/lib/category-styles";
import { fieldErrors, type FormState } from "./form-state";

const CategorySchema = z.object({
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      error: "Use lowercase letters, numbers and dashes, e.g. panjabi.",
    }),
  nameEn: z.string().trim().min(2, { error: "Enter the English name." }),
  nameBn: z.string().trim().min(2, { error: "Enter the Bangla name." }),
  taglineEn: z.string().trim().min(1, { error: "Enter a tagline." }),
  taglineBn: z.string().trim().min(1, { error: "Enter a Bangla tagline." }),
  emoji: z.string().trim().min(1, { error: "Pick an emoji." }).max(8),
  image: z
    .string()
    .trim()
    .regex(/^(\/[^\s]*|https:\/\/[^\s]+)$/, {
      error: "Enter a path like /cloths/shirts/photo.jpg or an https:// URL.",
    }),
  gradient: z.enum(CATEGORY_GRADIENTS.map((g) => g.value)),
});

export async function saveCategory(_prev: FormState, formData: FormData): Promise<FormState> {
  await verifyAdmin();

  const id = (formData.get("id") as string | null) || null;
  const parsed = CategorySchema.safeParse(
    Object.fromEntries(
      ["slug", "nameEn", "nameBn", "taglineEn", "taglineBn", "emoji", "image", "gradient"].map(
        (field) => [field, formData.get(field) ?? ""]
      )
    )
  );
  if (!parsed.success) {
    return { errors: fieldErrors(parsed.error), message: "Please fix the highlighted fields." };
  }

  const c = parsed.data;
  const data = {
    slug: c.slug,
    name: { en: c.nameEn, bn: c.nameBn },
    tagline: { en: c.taglineEn, bn: c.taglineBn },
    emoji: c.emoji,
    image: c.image,
    gradient: c.gradient,
  };

  try {
    if (id) {
      await db.category.update({ where: { id }, data });
    } else {
      await db.category.create({ data: { ...data, icon: "Shirt" } });
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { errors: { slug: "Another category already uses this slug." } };
    }
    throw error;
  }

  revalidatePath("/", "layout");
  redirect("/admin/categories");
}

export async function deleteCategory(id: string): Promise<FormState> {
  await verifyAdmin();

  const productCount = await db.product.count({ where: { categoryId: id } });
  if (productCount > 0) {
    return {
      message: `Move or delete its ${productCount} product${productCount === 1 ? "" : "s"} first.`,
    };
  }

  await db.category.delete({ where: { id } });
  revalidatePath("/", "layout");
  redirect("/admin/categories");
}
