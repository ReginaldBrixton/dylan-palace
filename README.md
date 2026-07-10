# Dylan's Palace

Dylan's Palace is a responsive fashion-commerce application built with React, Vite, Tailwind CSS, Supabase/PostgreSQL and UploadThing. It includes a public storefront, variant-aware cart and checkout, and a seller-authorized operations portal.

## Application areas

The storefront includes editorial merchandising, category catalogues, search and filters, product galleries, wishlist, cart, Ghana-focused delivery information and transactional order placement.

The seller portal includes dashboard, products, ordered product media, inventory adjustments, orders, customers and store settings. Seller authorization uses Supabase Auth plus `profiles.role = 'seller'`; browser-only passcodes and localStorage authorization are not supported.

## Local development

```bash
npm install
npm run dev
```

Create `.env.local` with the public browser configuration required by the current integrations:

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
GEMINI_API_KEY=...
```

Do not place seller passwords, service-role keys or database credentials in `VITE_*` variables.

## Verification

```bash
npm run typecheck
npm run test:run
npm run build
npx playwright install chromium
npm run test:e2e
```

The Playwright suite checks mobile, tablet and desktop viewports and mocks public database reads for deterministic interface tests.

## Database rollout

`prisma/schema.prisma` is the canonical data model. Apply migrations in order from `prisma/migrations/` to a staging Supabase project before production. Read:

- `docs/operations/database-migration.md`
- `docs/operations/admin-auth.md`
- `docs/operations/product-media-guidelines.md`

Back up production before migration. After migrations, create a Supabase Auth account for each administrator and set the corresponding profile role to `seller`.

## Product media

The application supports ordered multi-image galleries. Use only owned, licensed or product-owner-supplied images that accurately represent the item. Do not use unrelated stock photography to fill galleries.
