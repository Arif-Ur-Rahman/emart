// Usage: npm run admin:promote -- someone@example.com
// Gives an existing account access to /admin. They must log out and back in.
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const email = process.argv[2];
if (!email) {
  console.error("Usage: npm run admin:promote -- someone@example.com");
  process.exit(1);
}

const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

db.user
  .update({ where: { email }, data: { role: "ADMIN" } })
  .then(() => console.log(`${email} is now an admin. Ask them to log out and back in.`))
  .catch(() => {
    console.error(`No account found for ${email}. They need to sign up first.`);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
