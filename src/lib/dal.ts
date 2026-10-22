import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const verifySession = cache(async () => {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }
  return { isAuth: true, userId: session.user.id };
});

/**
 * Authoritative admin check for admin pages and Server Actions. Reads the
 * role from the database rather than the session token, so a demoted admin
 * loses access immediately.
 */
export const verifyAdmin = cache(async () => {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/admin");
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, role: true },
  });
  if (user?.role !== "ADMIN") {
    redirect("/");
  }
  return user;
});

export const getCurrentUser = cache(async () => {
  const session = await auth();
  if (!session?.user?.id) return null;

  return db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true },
  });
});
