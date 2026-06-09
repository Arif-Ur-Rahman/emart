"use client";

import { useLanguage } from "@/i18n/language-context";
import { cn } from "@/lib/utils";

export function LanguageToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLanguage();
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border bg-background p-0.5 text-xs font-medium",
        className
      )}
    >
      <button
        type="button"
        onClick={() => setLang("en")}
        className={cn(
          "rounded-full px-2.5 py-1 transition",
          lang === "en"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang("bn")}
        className={cn(
          "rounded-full px-2.5 py-1 transition",
          lang === "bn"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        বাংলা
      </button>
    </div>
  );
}
