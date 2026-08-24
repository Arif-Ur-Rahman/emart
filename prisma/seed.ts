import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { categories } from "../src/lib/categories";
import { products } from "../src/lib/products";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const db = new PrismaClient({ adapter });

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
        categoryId,
        sizeOptions: product.sizeOptions
          ? {
              create: product.sizeOptions.map((option) => ({
                sizeId: option.id,
                label: option.label,
                price: option.price,
                originalPrice: option.originalPrice,
              })),
            }
          : undefined,
      },
    });
  }

  console.log(
    `Seeded ${categories.length} categories and ${products.length} products.`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
