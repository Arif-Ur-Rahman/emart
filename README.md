# Tiffani & Blue — Storefront (Frontend)

A bilingual (English / বাংলা) ecommerce storefront for fine & fashion jewellery.
Built with **Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui**.

> **Status:** Frontend only. All product data is mock/static and the cart is
> client-side (persisted to `localStorage`). A backend will be connected later.

## Features

- **Bilingual UI** — runtime English ⇄ বাংলা toggle (no page reload), persisted to
  `localStorage`. Bangla digits and a Bangla web font (Hind Siliguri) are used when
  the language is set to বাংলা.
- **Browse** — home page (hero, trust bar, category grid, product rows), all-products
  shop with category filter + sort, per-category pages, and product detail pages with
  weight/size variants and quantity selection.
- **Cart** — add to cart from cards or the detail page, slide-out cart drawer, and a
  full `/cart` page. Subtotal, free-shipping threshold, and totals update live.
- **Static generation** — every category and product route is prerendered via
  `generateStaticParams`.

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build (also validates types + prerenders routes)
```

## Project structure

```
src/
  app/
    layout.tsx              Root layout: fonts, providers, header/footer
    page.tsx                Home
    shop/page.tsx           All products (filter + sort)
    category/[slug]/        Category listing (generateStaticParams)
    products/[slug]/        Product detail (generateStaticParams + metadata)
    cart/page.tsx           Full cart page
    not-found.tsx
  components/
    layout/                 AnnouncementBar, Header, Footer, SearchBar
    home/                   Hero, FeatureBar, CategoryGrid, ProductSection
    product/                ProductCard, ProductGrid, ProductImage,
                            QuantitySelector, ProductPurchase, ProductDetail
    cart/                   CartDrawer, CartItemRow, CartSummary
    category/               CategoryView
    ui/                     shadcn/ui primitives
    providers.tsx           LanguageProvider + CartProvider (+ global CartDrawer)
    language-toggle.tsx
  context/
    cart-context.tsx        Client cart state, localStorage persistence
  i18n/
    dictionaries.ts         en / bn UI strings
    language-context.tsx    LanguageProvider, useLanguage(), t() and tl()
  lib/
    types.ts                Product, Category, CartItem, Localized
    categories.ts           Mock categories + getters
    products.ts             Mock products + getters (the backend seam)
    format.ts               formatPrice, Bangla digits, discount %
    utils.ts                cn()
```

## Connecting a backend later

All data access goes through the getter functions in `src/lib/products.ts` and
`src/lib/categories.ts` (`getAllProducts`, `getProductBySlug`,
`getProductsByCategory`, `getFeaturedProducts`, `getRelatedProducts`,
`searchProducts`, `getAllCategories`, `getCategoryBySlug`). Replace their bodies with
`fetch`/API calls (and make them `async` where needed) to wire up a real backend —
the components and pages won't need to change shape.

## Notes

- Product images are rendered as branded gradient + emoji placeholders
  (`components/product/product-image.tsx`). Swap this component for `next/image` once
  real photos exist.
- Online checkout is intentionally disabled ("coming soon") until the backend exists.
- The brand color is green, set via CSS variables in `src/app/globals.css`.
