# emart — Storefront + Admin

A bilingual (English / বাংলা) fashion store for Bangladesh, with cash-on-delivery
checkout and an admin panel to run orders, products and stock.
Built with **Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui**, Prisma on
**PostgreSQL**, and Auth.js (email + password).

## Features

**Storefront**
- **Bilingual UI**: runtime English ⇄ বাংলা toggle, Bangla digits and fonts.
- **Browse**: home, all-products shop with filter + sort, category pages, product pages
  with sizes. Sold-out sizes are disabled, quantity is capped at stock, and low stock
  shows "Only N left".
- **Cart**: saved in the database (guest carts merge into the account on login).
- **Cash-on-delivery checkout**: Bangladeshi mobile number validation (accepts Bangla
  digits and +88), optional delivery note. Stock is reserved atomically when the order
  is placed, so two shoppers can't buy the last unit.
- **Orders**: order numbers (#1001…), status timeline, amount due on delivery, and
  customers can cancel while an order is still awaiting confirmation.

**Admin panel (`/admin`)**
- **Dashboard**: orders awaiting confirmation, ready to ship, out for delivery, cash
  still to collect, cash collected this month, low-stock list, recent orders.
- **Orders**: filter by status, search by order #, phone, name or email. Move orders
  through the COD lifecycle, add internal notes, call the customer from the page.
- **Products**: create/edit with English + Bangla text, sizes with per-size price and
  stock (S–XL and waist-size presets), badges, featured flag, hide from store.
- **Categories** and **Customers** (order count, delivered spend, last phone used).

### Order lifecycle (cash on delivery)

```
PENDING ──► CONFIRMED ──► SHIPPED ──► DELIVERED (cash collected)
   │            │            │
   └────────────┴────────────┴──► CANCELLED (items restocked)
```

Rules live in `src/lib/order-status.ts`. Status changes go through
`changeOrderStatus()` in `src/lib/orders.ts`, which guards against two admins
updating the same order at once and restocks on cancel.

## Getting started

Requires Node 20+ and PostgreSQL.

```bash
npm install                     # also runs `prisma generate`
cp .env.example .env            # then fill in DATABASE_URL, AUTH_SECRET, ADMIN_*
createdb emart
npm run db:migrate              # create tables
npm run db:seed                 # demo catalog + admin user from ADMIN_EMAIL/ADMIN_PASSWORD
npm run dev                     # http://localhost:3000, admin at /admin
```

`npm run db:seed` **wipes catalog, carts and orders** (users are kept), so only run
it on a development database.

### Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` / `build` / `start` | Next.js dev server / production build / production server |
| `npm run db:migrate` | Create and apply a migration after editing `prisma/schema.prisma` |
| `npm run db:deploy` | Apply pending migrations (production) |
| `npm run db:seed` | Reset the demo catalog and upsert the admin user |
| `npm run admin:promote -- you@example.com` | Give an existing account admin access (they must log in again) |
| `npm run db:studio` | Browse the database in Prisma Studio |

### Environment

| Variable | Notes |
| --- | --- |
| `DATABASE_URL` | Postgres connection string |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `AUTH_TRUST_HOST` / `AUTH_URL` | Auth.js rejects logins under `next start` without one of these. In production set `AUTH_URL` to your https domain. |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Admin account the seed creates/updates |

## Project structure

```
prisma/
  schema.prisma             Data model (users/roles, catalog, stock, carts, orders)
  migrations/               SQL migrations
  seed.ts, seed-data/       Demo catalog + admin user
scripts/make-admin.ts       Promote a user to admin
src/
  app/
    layout.tsx              Root: fonts and global CSS only
    not-found.tsx           Store-styled 404
    (store)/                Storefront routes (share header/footer via StoreShell)
    admin/                  Admin panel routes (own layout + sidebar)
    api/                    Auth.js and search route handlers
  components/
    admin/                  Admin UI (forms, tables, order actions)
    layout/ home/ product/ cart/ checkout/ orders/ ...   Storefront UI
    ui/                     shadcn/ui primitives
  lib/
    actions/                Server Actions (cart, checkout, orders, auth, admin/*)
    data/                   Read queries (storefront + admin)
    orders.ts               Stock reservation + order status changes
    order-status.ts         COD lifecycle rules (shared with the client)
    dal.ts                  verifySession / verifyAdmin
    phone.ts                Bangladeshi mobile number normalization
  proxy.ts                  Redirects logged-out users and non-admins
```

## Security notes

- `/admin` is guarded twice: `proxy.ts` redirects early using the session token, and
  every admin page and Server Action calls `verifyAdmin()`, which re-reads the role from
  the database.
- Checkout re-reads the cart and recomputes totals on the server. It never trusts
  prices sent by the client.

## Not built yet

- **Image upload**: product and category photos are a `/public` path or an `https://`
  URL. Uploading needs object storage (e.g. Cloudinary, S3, Vercel Blob).
- **Guest checkout**: shoppers must create an account to order.
- **Delivery zones**: shipping is a flat ৳60, free over ৳1,000 (`src/lib/shipping.ts`).
  Inside/outside-Dhaka rates would go there.
- **Customer notifications** (SMS/email on status changes) and courier API integration.
