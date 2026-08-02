import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { ProductMotif } from "@/components/product/product-motif";
import { Button } from "@/components/ui/button";

/**
 * Editorial opener: a stacked ornament collage on the right, the price promise
 * on the left. No photography needed.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-br from-secondary via-background to-accent/60">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24 lg:px-8">
        <div className="space-y-6">
          <p className="text-xs tracking-[0.24em] text-primary uppercase">
            Handmade in Bangladesh
          </p>

          <h1 className="font-heading text-4xl leading-[1.05] font-semibold text-balance-heading sm:text-5xl lg:text-6xl">
            Small, gorgeous things
            <span className="block text-primary">worn every day.</span>
          </h1>

          <p className="max-w-md text-base leading-relaxed text-muted-foreground">
            Bangles, hair bands, jhumkas and nakshi crafts — made in small
            batches by women artisans. Everything in the shop sits between{" "}
            <span className="font-medium text-foreground">৳100</span> and{" "}
            <span className="font-medium text-foreground">৳1,500</span>.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="h-11 px-7">
              <Link href="/shop">
                Shop the collection
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-11 px-7">
              <Link href="/collections/handmade-crafts">Handmade crafts</Link>
            </Button>
          </div>

          <dl className="flex flex-wrap gap-x-10 gap-y-4 pt-4">
            {[
              { value: "32", label: "pieces in stock" },
              { value: "৳100+", label: "starting price" },
              { value: "Free", label: "delivery over ৳1,000" },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="font-heading text-2xl font-semibold lining-nums">
                  {stat.value}
                </dt>
                <dd className="text-xs tracking-wide text-muted-foreground uppercase">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <Collage seed="kanchan-glass-bangle-set" className="aspect-4/5" />
              <Collage seed="tiny-lotus-studs" className="aspect-square" />
            </div>
            <div className="space-y-4 pt-10">
              <Collage seed="chandbali-jhumka" className="aspect-square" />
              <Collage
                seed="malati-flower-headband"
                className="aspect-4/5"
              />
            </div>
          </div>

          <div
            aria-hidden
            className="absolute -bottom-6 -left-6 -z-10 size-40 rounded-full bg-gold/25 blur-3xl"
          />
        </div>
      </div>
    </section>
  );
}

function Collage({ seed, className }: { seed: string; className?: string }) {
  return (
    <div
      className={`overflow-hidden rounded-xl border shadow-sm ${className ?? ""}`}
    >
      <ProductMotif seed={seed} className="size-full object-cover" />
    </div>
  );
}
