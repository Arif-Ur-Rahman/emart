import { HandHeart, Sparkles, Truck, Wallet } from "lucide-react";

const PROPS = [
  {
    Icon: HandHeart,
    title: "Made by hand",
    body: "Small batches from women artisans in Dhaka, Jamalpur and Bikrampur.",
  },
  {
    Icon: Wallet,
    title: "৳100 to ৳1,500",
    body: "A real price ceiling. Nothing in the shop goes above ৳1,500.",
  },
  {
    Icon: Truck,
    title: "Free over ৳1,000",
    body: "Countrywide delivery, ৳60 flat below the threshold. Cash on delivery.",
  },
  {
    Icon: Sparkles,
    title: "7-day exchange",
    body: "If a piece isn't right, send it back within a week — unworn.",
  },
];

export function ValueProps() {
  return (
    <section className="border-y bg-sidebar">
      <ul className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {PROPS.map(({ Icon, title, body }) => (
          <li key={title} className="flex gap-3.5">
            <Icon className="mt-0.5 size-5 shrink-0 text-primary" />
            <div className="space-y-1">
              <h3 className="text-sm font-medium">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {body}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
