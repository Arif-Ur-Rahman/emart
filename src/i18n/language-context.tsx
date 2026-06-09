"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Locale, Localized } from "@/lib/types";
import { dictionaries, type TranslationKey } from "./dictionaries";

const STORAGE_KEY = "gb.lang";

type LanguageContextValue = {
  lang: Locale;
  setLang: (lang: Locale) => void;
  toggle: () => void;
  /** Translate a static UI string key. */
  t: (key: TranslationKey) => string;
  /** Pick the active-language field from a Localized data object. */
  tl: (value: Localized) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Locale>("en");

  // Hydrate from localStorage on mount.
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "bn") {
      setLangState(stored);
    }
  }, []);

  // Keep <html lang> and persistence in sync.
  useEffect(() => {
    document.documentElement.lang = lang;
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const setLang = useCallback((next: Locale) => setLangState(next), []);
  const toggle = useCallback(
    () => setLangState((prev) => (prev === "en" ? "bn" : "en")),
    []
  );

  const t = useCallback(
    (key: TranslationKey) => dictionaries[lang][key] ?? dictionaries.en[key] ?? key,
    [lang]
  );
  const tl = useCallback((value: Localized) => value[lang] ?? value.en, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, t, tl }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
