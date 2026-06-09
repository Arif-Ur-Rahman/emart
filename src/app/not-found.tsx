"use client";

import Link from "next/link";
import { useLanguage } from "@/i18n/language-context";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <span className="text-6xl">🧺</span>
      <h1 className="text-3xl font-bold">{t("common.notFound")}</h1>
      <p className="text-muted-foreground">{t("common.notFound.desc")}</p>
      <Link href="/" className={cn(buttonVariants(), "rounded-full")}>
        {t("common.backHome")}
      </Link>
    </div>
  );
}
