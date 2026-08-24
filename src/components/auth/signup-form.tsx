"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useLanguage } from "@/i18n/language-context";
import { signup, type AuthFormState } from "@/lib/actions/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export function SignupForm() {
  const { t } = useLanguage();
  const [state, action, pending] = useActionState<AuthFormState, FormData>(
    signup,
    undefined
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{t("auth.signup.title")}</CardTitle>
        <CardDescription>{t("auth.signup.subtitle")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-medium">
              {t("auth.name")}
            </label>
            <Input id="name" name="name" required autoComplete="name" />
            {state?.errors?.name && (
              <p className="text-sm text-destructive">{state.errors.name[0]}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              {t("auth.email")}
            </label>
            <Input id="email" name="email" type="email" required autoComplete="email" />
            {state?.errors?.email && (
              <p className="text-sm text-destructive">{state.errors.email[0]}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium">
              {t("auth.password")}
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
            />
            {state?.errors?.password && (
              <p className="text-sm text-destructive">{state.errors.password[0]}</p>
            )}
          </div>
          {state?.message && (
            <p className="text-sm text-destructive">{state.message}</p>
          )}
          <Button type="submit" disabled={pending} className="w-full">
            {t("auth.signup")}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {t("auth.signup.haveAccount")}{" "}
            <Link href="/login" className="font-medium text-accent-foreground hover:underline">
              {t("auth.login")}
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
