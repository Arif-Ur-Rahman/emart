# Maloti

Storefront for **Maloti**, a handmade ornaments and women's crafts shop in
Bangladesh — bangles, hair bands, jhumkas, nakshi crafts. Everything in the
catalogue is priced between **৳100 and ৳1,500**.

Built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4 and shadcn/ui.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

## What's here

| Route                 | What it does                                                |
| --------------------- | ----------------------------------------------------------- |
| `/`                   | Hero, collections, most-loved and new-arrival grids          |
| `/shop`               | Full catalogue with filters (collection, price, tag) + sort  |
| `/collections/[slug]` | One collection, statically generated for all 8               |
| `/products/[slug]`    | Product page with gallery, details, related items, JSON-LD   |
| `/cart`               | Full bag with quantities and order summary                   |
| `/about`              | Brand story                                                  |

The shop page is server-rendered from the query string, so every filtered view
is a shareable URL and filtering works without client JavaScript. Collection
and product pages are prerendered at build time.

## Structure

```
src/
├── app/                      # routes (App Router)
├── components/
│   ├── brand/                # logo and mark
│   ├── cart/                 # provider, slide-out bag, cart page view
│   ├── home/                 # homepage sections
│   ├── layout/               # header, footer, nav, search
│   ├── product/              # cards, grid, motif art, add-to-bag
│   ├── shop/                 # filters and sort
│   └── ui/                   # shadcn/ui primitives
└── lib/
    ├── data/                 # ← the seam to the backend
    │   ├── catalog.ts        # seed products and categories
    │   └── index.ts          # async accessors used by every page
    ├── cart-store.ts         # localStorage-backed bag
    ├── currency.ts           # Taka formatting, shipping rules
    ├── search-params.ts      # query-string parsing for /shop
    └── types.ts              # domain types
```

## Wiring up the Node.js backend

`src/lib/data/index.ts` is the only file that knows where products come from.
Every function there is already `async` and returns plain serialisable objects
matching `src/lib/types.ts`, so swapping the seed catalogue for the API means
replacing the function bodies:

```ts
export async function getProducts(query: ProductQuery = {}): Promise<Product[]> {
  const res = await fetch(`${process.env.API_URL}/products?${toQueryString(query)}`);
  if (!res.ok) throw new Error("Failed to load products");
  return res.json();
}
```

No page or component imports `catalog.ts` directly, so nothing else changes.

Still to build once the API exists:

- **Checkout** — the checkout button in `CartView` currently shows a toast. It
  needs an order endpoint, an address form, and bKash/Nagad/COD selection.
- **Stock validation** — the bag trusts the price and stock snapshot it stored.
  Re-validate against the API before an order is placed.
- **Product images** — `Product.image` is optional; when it's absent the UI
  draws a deterministic ornament motif (`ProductMotif`). Populate `image` with
  paths under `/public` (or add the CDN host to `images.remotePatterns` in
  `next.config.ts`) and photography takes over automatically.

## Design notes

- Brand tokens live in `src/app/globals.css` — warm ivory ground, deep
  berry-rose primary, antique gold accent. Light and dark are both defined.
- Headings use Cormorant Garamond, body copy uses Inter. Prices carry
  `lining-nums` because Cormorant defaults to old-style figures.
- The bag is stored in `localStorage` and read through `useSyncExternalStore`,
  which gives correct hydration and cross-tab sync without effects.

## Conventions

`AGENTS.md` applies: this repo pins Next.js 16, whose APIs differ from older
releases. Check `node_modules/next/dist/docs/` before writing framework code.
