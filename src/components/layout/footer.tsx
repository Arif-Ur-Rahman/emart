"use client";

import Link from "next/link";
import { Leaf, Send, MessageCircle, Globe, Phone, Mail } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";
import { getAllCategories } from "@/lib/categories";

export function Footer() {
  const { t, tl } = useLanguage();
  const categories = getAllCategories().slice(0, 6);
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t bg-muted/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Leaf className="h-5 w-5" />
            </span>
            <span className="text-lg font-bold">{t("footer.about.title")}</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            {t("footer.about.desc")}
          </p>
          <div className="mt-4 flex gap-2">
            {[Send, MessageCircle, Globe].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="social link"
                className="flex h-9 w-9 items-center justify-center rounded-full border text-muted-foreground transition hover:bg-primary hover:text-primary-foreground"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">{t("footer.shop")}</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/category/${c.slug}`}
                  className="transition hover:text-primary"
                >
                  {tl(c.name)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">{t("footer.help")}</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/shop" className="transition hover:text-primary">
                {t("footer.help.faq")}
              </Link>
            </li>
            <li>
              <Link href="/shop" className="transition hover:text-primary">
                {t("footer.help.shipping")}
              </Link>
            </li>
            <li>
              <Link href="/cart" className="transition hover:text-primary">
                {t("footer.help.track")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">{t("footer.contact")}</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> +880 1700-000000
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> hello@ghorerbazar.demo
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground sm:flex-row">
          <span>
            © {year} {t("footer.about.title")}. {t("footer.rights")}
          </span>
          <span>{t("footer.madeWith")}</span>
        </div>
      </div>
    </footer>
  );
}
