import { Mail, Phone } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/brand/logo";
import { Separator } from "@/components/ui/separator";
import { getCategories } from "@/lib/data";

// lucide dropped brand marks in v1, so the two we need live here.
function FacebookGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M14 8.5V7c0-.8.2-1.2 1.3-1.2H17V3h-2.6c-2.9 0-3.9 1.4-3.9 3.7v1.8H8.5V11h2v10h3.2V11h2.3l.4-2.5H14Z" />
    </svg>
  );
}

function InstagramGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden
      className={className}
    >
      <rect x={3} y={3} width={18} height={18} rx={5} />
      <circle cx={12} cy={12} r={4} />
      <circle cx={17.2} cy={6.8} r={1.1} fill="currentColor" stroke="none" />
    </svg>
  );
}

const HELP_LINKS = [
  { href: "/about", label: "Our story" },
  { href: "/shop?sort=newest", label: "New arrivals" },
  { href: "/cart", label: "Your bag" },
  { href: "/shop", label: "Shop all" },
];

export async function SiteFooter() {
  const categories = await getCategories();

  return (
    <footer className="mt-24 border-t bg-sidebar">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Handmade ornaments and women&apos;s crafts from Bangladesh. Nothing
            in the shop costs more than ৳1,500, and most of it is made in small
            batches by hand.
          </p>
          <div className="flex gap-2">
            {[
              {
                href: "https://facebook.com",
                label: "Facebook",
                Icon: FacebookGlyph,
              },
              {
                href: "https://instagram.com",
                label: "Instagram",
                Icon: InstagramGlyph,
              },
            ].map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                rel="noreferrer noopener"
                target="_blank"
                className="grid size-9 place-items-center rounded-full border text-muted-foreground transition hover:border-primary hover:text-primary"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <nav className="space-y-3">
          <h2 className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
            Collections
          </h2>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/collections/${category.slug}`}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="space-y-3">
          <h2 className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
            Shop
          </h2>
          <ul className="space-y-2">
            {HELP_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-3">
          <h2 className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
            Reach us
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0" />
              <a href="tel:+8801700000000" className="hover:text-primary">
                +880 17 0000 0000
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 shrink-0" />
              <a href="mailto:hello@maloti.shop" className="hover:text-primary">
                hello@maloti.shop
              </a>
            </li>
          </ul>
          <p className="text-sm text-muted-foreground">
            Saturday–Thursday, 10:00–19:00
            <br />
            Dhaka, Bangladesh
          </p>
        </div>
      </div>

      <Separator />

      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} Maloti. All rights reserved.</p>
        <p>Cash on delivery · bKash · Nagad</p>
      </div>
    </footer>
  );
}
