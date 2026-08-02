import type { Metadata } from "next";
import Link from "next/link";

import { MalotiMark } from "@/components/brand/logo";
import { ProductMotif } from "@/components/product/product-motif";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Our story",
  description:
    "Maloti works with women artisans across Bangladesh to make ornaments and crafts that stay between ৳100 and ৳1,500.",
};

const CHAPTERS = [
  {
    title: "One tray of bangles",
    body: "Maloti began at a stall in Dhaka with a single tray of glass bangles and a rule we still keep: if we would not wear it ourselves, we do not sell it.",
  },
  {
    title: "Fourteen pairs of hands",
    body: "Today fourteen artisans work with us — in Dhaka, in Jamalpur where the nakshi kantha comes from, and in Bikrampur where the terracotta is fired. They are paid per piece, at a rate they set.",
  },
  {
    title: "A price ceiling, on purpose",
    body: "Nothing in the shop costs more than ৳1,500. Ornaments should be something you buy on a Tuesday because you liked the colour, not something you save for.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="space-y-5 text-center">
        <MalotiMark className="mx-auto size-10 text-primary" />
        <h1 className="font-heading text-4xl leading-tight font-semibold text-balance-heading sm:text-5xl">
          Small, gorgeous things, made by women who sign their work.
        </h1>
        <p className="mx-auto max-w-2xl leading-relaxed text-muted-foreground">
          Maloti is a jasmine that opens after dark and smells like the whole
          courtyard. It seemed like the right name for a shop full of things
          that are easy to miss until you notice them.
        </p>
      </header>

      <div aria-hidden className="rule-gold mx-auto mt-14 h-px w-full" />

      <div className="mt-14 space-y-14">
        {CHAPTERS.map((chapter, index) => (
          <section
            key={chapter.title}
            className="grid items-center gap-8 sm:grid-cols-[10rem_1fr]"
          >
            <div className="aspect-square overflow-hidden rounded-xl border">
              <ProductMotif seed={`about-${index}`} />
            </div>
            <div className="space-y-2">
              <h2 className="font-heading text-2xl font-semibold">
                {chapter.title}
              </h2>
              <p className="leading-relaxed text-muted-foreground">
                {chapter.body}
              </p>
            </div>
          </section>
        ))}
      </div>

      <Separator className="my-14" />

      <section className="space-y-5 text-center">
        <h2 className="font-heading text-2xl font-semibold">
          Come see what is on the bench this week.
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="h-11 px-7">
            <Link href="/shop">Shop the collection</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-11 px-7">
            <Link href="/collections/handmade-crafts">Handmade crafts</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
