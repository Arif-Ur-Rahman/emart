"use client";

import { useLanguage } from "@/i18n/language-context";

export function AnnouncementBar() {
  const { t } = useLanguage();
  return (
    <div className="bg-brand text-brand-foreground">
      <p className="mx-auto max-w-7xl px-4 py-2 text-center text-xs font-medium sm:text-sm">
        {t("announce.text")}
      </p>
    </div>
  );
}
