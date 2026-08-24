"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { db } from "@/lib/db";
import { signIn, signOut } from "@/lib/auth";
import { mergeGuestCartIntoUser } from "@/lib/actions/cart";

const SignupSchema = z.object({
  name: z.string().min(2, { error: "Name must be at least 2 characters long." }).trim(),
  email: z.email({ error: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters long." })
    .trim(),
});

export type AuthFormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export async function signup(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const validated = SignupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { name, email, password } = validated.data;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { message: "An account with this email already exists." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await db.user.create({ data: { name, email, passwordHash } });

  await signIn("credentials", { email, password, redirect: false });
  await mergeGuestCartIntoUser(user.id);
  redirect("/");
}

export async function login(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return { message: "Enter your email and password." };
  }

  try {
    await signIn("credentials", { email, password, redirect: false });
  } catch (error) {
    if (error instanceof AuthError) {
      return { message: "Invalid email or password." };
    }
    throw error;
  }

  const user = await db.user.findUnique({ where: { email } });
  if (user) await mergeGuestCartIntoUser(user.id);
  redirect("/");
}

export async function logout() {
  // redirect: false so the client can force a hard navigation afterward —
  // a seeded RSC redirect only refreshes the current page, and can leave
  // other already-visited routes showing a stale logged-in header until a
  // hard refresh.
  await signOut({ redirect: false });
}
