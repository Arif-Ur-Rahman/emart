"use client";

import { Truck, ShieldCheck, BadgeDollarSign } from "lucide-react";
import { useLanguage } from "@/i18n/language-context";

export function FeatureBar() {
  const { t } = useLanguage();
  const features = [
    { icon: Truck, title: t("feature.delivery.title"), desc: t("feature.delivery.desc") },
    { icon: ShieldCheck, title: t("feature.authentic.title"), desc: t("feature.authentic.desc") },
    { icon: BadgeDollarSign, title: t("feature.cod.title"), desc: t("feature.cod.desc") },
  ];

  return (
    <section className="border-y bg-muted/30">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:grid-cols-3">
        {features.map((f) => (
          <div key={f.title} className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <f.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">{f.title}</p>
              <p className="text-xs text-muted-foreground">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
