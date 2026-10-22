import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { categories } from "./seed-data/categories";
import { products } from "./seed-data/products";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

/** Units seeded per size (or per product when it has no sizes). */
const DEFAULT_STOCK = 20;

/**
 * Per-size stock overrides as "product-slug:size-id", so the storefront shows
 * a sold-out size and a low-stock warning out of the box.
 */
const STOCK_OVERRIDES: Record<string, number> = {
  "classic-black-coat:xl": 0,
  "classic-blue-jeans:w36": 2,
};

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.log("ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin user.");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await db.user.upsert({
    where: { email },
    update: { role: "ADMIN", passwordHash },
    create: { email, name: "Store Admin", role: "ADMIN", passwordHash },
  });
  console.log(`Admin user ready: ${email}`);
}

async function main() {
  // Wipe in dependency order so re-running the seed is idempotent.
  await db.orderItem.deleteMany();
  await db.address.deleteMany();
  await db.order.deleteMany();
  await db.cartItem.deleteMany();
  await db.cart.deleteMany();
  await db.sizeOption.deleteMany();
  await db.product.deleteMany();
  await db.category.deleteMany();

  const categoryIdBySlug = new Map<string, string>();
  for (const category of categories) {
    const created = await db.category.create({
      data: {
        slug: category.slug,
        name: category.name,
        tagline: category.tagline,
        emoji: category.emoji,
        icon: category.icon,
        gradient: category.gradient,
        image: category.image,
      },
    });
    categoryIdBySlug.set(category.slug, created.id);
  }

  for (const product of products) {
    const categoryId = categoryIdBySlug.get(product.categorySlug);
    if (!categoryId) {
      throw new Error(
        `Product "${product.slug}" references unknown category "${product.categorySlug}"`
      );
    }

    await db.product.create({
      data: {
        slug: product.slug,
        name: product.name,
        shortDesc: product.shortDesc,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        rating: product.rating,
        reviewCount: product.reviewCount,
        badges: product.badges ?? undefined,
        featured: product.featured ?? false,
        stock: product.sizeOptions ? 0 : DEFAULT_STOCK,
        categoryId,
        sizeOptions: product.sizeOptions
          ? {
              create: product.sizeOptions.map((option, position) => ({
                sizeId: option.id,
                label: option.label,
                price: option.price,
                originalPrice: option.originalPrice,
                stock:
                  STOCK_OVERRIDES[`${product.slug}:${option.id}`] ?? DEFAULT_STOCK,
                position,
              })),
            }
          : undefined,
      },
    });
  }

  console.log(
    `Seeded ${categories.length} categories and ${products.length} products.`
  );

  await seedAdmin();
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
