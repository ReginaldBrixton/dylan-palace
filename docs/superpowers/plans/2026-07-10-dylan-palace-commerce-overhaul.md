# Dylan's Palace Commerce Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform Dylan's Palace into a secure, responsive, production-oriented fashion commerce application with distinct desktop, tablet and mobile storefronts, a coherent admin portal, reliable ordering and a single migration-controlled database model.

**Architecture:** Keep the existing React 19, Vite, Tailwind CSS 4, React Router, Motion, Supabase and UploadThing stack. Introduce shared storefront and admin shells, semantic design tokens, focused feature components, server-authorized seller sessions, typed commerce services and transactional PostgreSQL functions. Deliver the work in four independently testable phases on one implementation branch.

**Tech Stack:** React 19, TypeScript 5.8, Vite 6, Tailwind CSS 4, React Router 7, Motion 12, Supabase/PostgreSQL, Prisma 5, UploadThing 7, Vitest, Testing Library, Playwright.

## Global Constraints

- Preserve the approved classic editorial commerce direction and the strongest existing landing-page identity.
- Implement intentional layouts for mobile (<768 px), tablet (768–1023 px) and desktop (>=1024 px).
- Do not keep administrative secrets, authorization decisions or privileged operations in browser code or localStorage.
- Prisma migrations are the canonical schema history; conflicting legacy SQL is retired or clearly marked archival.
- Order creation, order items and inventory deduction succeed or fail as one transaction.
- Keep Mobile Money as a selectable method without falsely presenting an unverified payment as completed.
- All new interactive components support keyboard use, visible focus, meaningful labels and prefers-reduced-motion.
- Existing product, image and order records are migrated; do not destructively reseed production data.
- Product imagery must be owned, licensed or explicitly approved and must accurately represent the listed product.
- Use small focused files and shared components rather than duplicating storefront or seller page shells.

---

## Planned file structure

### Storefront foundation
- Create `src/components/brand/BrandLogo.tsx`: accessible wordmark, monogram and symbol renderer.
- Create `src/components/storefront/StorefrontHeader.tsx`: desktop navigation and compact tablet/mobile header.
- Create `src/components/storefront/MobileNavigation.tsx`: mobile-only bottom navigation.
- Create `src/components/storefront/SearchOverlay.tsx`: global search dialog.
- Create `src/components/storefront/SiteFooter.tsx`: trust, service and newsletter footer.
- Create `src/components/storefront/ProductCard.tsx`: reusable merchandising card.
- Create `src/components/storefront/ProductGrid.tsx`: responsive catalogue grid.
- Create `src/components/storefront/FilterSidebar.tsx`: desktop filtering.
- Create `src/components/storefront/FilterSheet.tsx`: tablet/mobile filtering.
- Create `src/components/storefront/ProductGallery.tsx`: desktop/mobile image gallery.
- Create `src/components/storefront/PurchasePanel.tsx`: sticky product purchase controls.
- Modify `src/components/common/Layout.tsx`: compose the new storefront shell.
- Replace `src/components/common/Header.tsx` and `src/components/common/BottomNav.tsx` with compatibility exports or remove after route migration.
- Modify `src/index.css`: semantic tokens, responsive containers, focus styles and reduced motion.

### Public pages
- Refactor `src/pages/HomePage.tsx`: campaign hero, category rail, featured/new product sections, editorial story, services and footer handoff.
- Refactor `src/pages/ProductListPage.tsx`: shared filters, result counts, sort controls and responsive grids.
- Refactor `src/pages/ProductDetailPage.tsx`: gallery plus sticky purchase panel, specifications and recommendations.
- Refactor `src/pages/CheckoutPage.tsx`: responsive two-column checkout, Ghana address fields, clear payment state and sticky order summary.
- Refactor `src/pages/ProfilePage.tsx`: customer details, wishlist and order history states.
- Refactor `src/pages/SuccessPage.tsx`: confirmed-order language only after database success.
- Modify `src/App.tsx`: route boundaries, error pages and lazy feature loading.

### Admin foundation
- Create `src/components/admin/AdminShell.tsx`: reusable responsive admin frame.
- Create `src/components/admin/AdminSidebar.tsx`: desktop navigation and mobile drawer.
- Create `src/components/admin/AdminHeader.tsx`: page title, search, alerts and account controls.
- Create `src/components/admin/MetricCard.tsx`: accessible dashboard metrics.
- Create `src/components/admin/DataTable.tsx`: reusable responsive table/list abstraction.
- Create `src/components/admin/StatusBadge.tsx`: order, stock and account status presentation.
- Refactor `src/pages/seller/SellerLoginPage.tsx` and `src/context/SellerAuthContext.tsx`: real Supabase seller session.
- Refactor `src/pages/seller/SellerDashboardPage.tsx`, `SellerProductsPage.tsx`, `SellerOrdersPage.tsx`, `SellerUsersPage.tsx`: use the shared admin shell.
- Create `src/pages/seller/SellerInventoryPage.tsx`, `SellerSettingsPage.tsx` and `SellerCustomerDetailPage.tsx`.
- Modify `src/pages/seller/components/ProductFormModal.tsx`: media ordering, alt text, variants and validation.

### Data and security
- Create `prisma/migrations/0002_commerce_hardening/migration.sql`: variants, inventory movements, order status events, admin audit events, transactional order function and policy changes.
- Modify `prisma/schema.prisma`: canonical models and indexes matching the migration.
- Create `src/lib/auth.ts`: seller-role session helpers.
- Split `src/lib/api.ts` into `src/lib/api/products.ts`, `orders.ts`, `customers.ts`, `dashboard.ts` and `settings.ts`, preserving a compatibility barrel.
- Create `src/lib/api/commerce.ts`: invoke the transactional order RPC.
- Modify `src/lib/database.types.ts`: generated/verified relational types.
- Modify `src/lib/product-cache.ts`: keyed invalidation and stale-data behavior.
- Mark `scripts/schema.sql` as archival or replace it with a migration notice.
- Modify `scripts/seed.sql` and `scripts/seed-db.ts`: non-destructive development seed behavior and multi-image fixtures.

### Testing and operations
- Create `vitest.config.ts`, `src/test/setup.ts` and focused unit/component tests.
- Create `playwright.config.ts` and responsive smoke tests for storefront, checkout and admin authentication.
- Modify `package.json`: test scripts and required dev dependencies.
- Create `docs/operations/admin-auth.md`, `database-migration.md` and `product-media-guidelines.md`.

---

### Task 1: Establish test harness and semantic design foundation

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`
- Create: `src/styles/tokens.css`
- Modify: `src/index.css`
- Test: `src/styles/tokens.test.ts`

**Interfaces:**
- Produces CSS variables `--color-canvas`, `--color-surface`, `--color-ink`, `--color-muted`, `--color-accent`, `--space-page`, `--container-store` and `--container-admin`.
- Produces npm scripts `test`, `test:run`, `test:e2e` and `typecheck`.

- [ ] Add Vitest, jsdom, Testing Library and Playwright dev dependencies and scripts.
- [ ] Write `tokens.test.ts` to assert semantic variables exist and reduced-motion rules are present.
- [ ] Run `npm run test:run -- src/styles/tokens.test.ts`; expect failure before implementation.
- [ ] Add token definitions, responsive page gutters, focus-visible treatment and reduced-motion overrides.
- [ ] Run `npm run test:run -- src/styles/tokens.test.ts` and `npm run typecheck`; expect both to pass.
- [ ] Commit as `test: add commerce UI test harness and design tokens`.

### Task 2: Build brand and storefront shell

**Files:**
- Create: `src/components/brand/BrandLogo.tsx`
- Create: `src/components/brand/BrandLogo.test.tsx`
- Create: `src/components/storefront/StorefrontHeader.tsx`
- Create: `src/components/storefront/StorefrontHeader.test.tsx`
- Create: `src/components/storefront/MobileNavigation.tsx`
- Create: `src/components/storefront/SearchOverlay.tsx`
- Create: `src/components/storefront/SiteFooter.tsx`
- Modify: `src/components/common/Layout.tsx`
- Modify: `public/favicon.svg`

**Interfaces:**
- `BrandLogo({ variant: 'wordmark' | 'monogram' | 'symbol', tone?: 'dark' | 'light', className?: string })`.
- `StorefrontHeader({ cartCount: number, onOpenCart(): void })`.
- `SearchOverlay({ open: boolean, onOpenChange(open: boolean): void })`.

- [ ] Write rendering and accessibility tests for all logo variants and header landmarks.
- [ ] Run the focused tests; expect missing-module failures.
- [ ] Implement the accessible SVG brand system and replace the favicon using the same geometry.
- [ ] Implement desktop category navigation, tablet/mobile compact controls, search overlay and mobile navigation.
- [ ] Refactor `Layout.tsx` so seller routes bypass storefront chrome and public routes receive header, cart, footer and mobile navigation correctly.
- [ ] Run focused tests, typecheck and build.
- [ ] Commit as `feat: add responsive storefront shell and brand system`.

### Task 3: Introduce reusable product discovery components

**Files:**
- Create: `src/components/storefront/ProductCard.tsx`
- Create: `src/components/storefront/ProductCard.test.tsx`
- Create: `src/components/storefront/ProductGrid.tsx`
- Create: `src/components/storefront/FilterSidebar.tsx`
- Create: `src/components/storefront/FilterSheet.tsx`
- Create: `src/hooks/useProductFilters.ts`
- Create: `src/hooks/useProductFilters.test.ts`
- Refactor: `src/pages/ProductListPage.tsx`

**Interfaces:**
- `useProductFilters(products, initialCategory)` returns `{ query, setQuery, filters, setFilter, sort, setSort, filteredProducts, reset, activeCount }`.
- `ProductCard({ product, onQuickAdd, onToggleWishlist, wishlisted })`.

- [ ] Write filter-hook tests for query, brand, gender, subtype, price sorting and reset behavior.
- [ ] Write product-card tests for accessible name, price, image fallback, wishlist and quick-add events.
- [ ] Run focused tests; expect failures.
- [ ] Implement the hook and components with a desktop sidebar, mobile filter sheet, result count and URL-safe category behavior.
- [ ] Refactor the product-list page to remove long-press-only discovery and expose explicit quick-view/quick-add controls.
- [ ] Run tests, typecheck and build.
- [ ] Commit as `feat: redesign product discovery and responsive catalogue`.

### Task 4: Redesign the landing page and product merchandising

**Files:**
- Create: `src/components/storefront/HeroCampaign.tsx`
- Create: `src/components/storefront/CategoryShowcase.tsx`
- Create: `src/components/storefront/ProductRail.tsx`
- Create: `src/components/storefront/ServiceStrip.tsx`
- Create: `src/components/storefront/EditorialStory.tsx`
- Refactor: `src/pages/HomePage.tsx`
- Modify: `src/components/ui/BagsInteractive.tsx`
- Modify: `src/components/ui/ShoesInteractive.tsx`
- Modify: `src/components/ui/TrousersInteractive.tsx`

**Interfaces:**
- `ProductRail({ title, products, href })`.
- `CategoryShowcase({ category, title, description, image, href, artwork })`.

- [ ] Write smoke tests for hero CTA, category links, featured products and reduced-motion behavior.
- [ ] Run tests; expect failures.
- [ ] Implement a desktop split hero, tablet crop and mobile full-bleed composition.
- [ ] Add new arrivals, featured products, category campaigns, service assurances and editorial content.
- [ ] Simplify existing interactive SVGs, replace raw colors with semantic tokens and make controls keyboard-operable.
- [ ] Run tests, typecheck and build.
- [ ] Commit as `feat: rebuild editorial commerce landing page`.

### Task 5: Rebuild product detail, cart and wishlist interactions

**Files:**
- Create: `src/components/storefront/ProductGallery.tsx`
- Create: `src/components/storefront/ProductGallery.test.tsx`
- Create: `src/components/storefront/PurchasePanel.tsx`
- Create: `src/components/storefront/PurchasePanel.test.tsx`
- Refactor: `src/pages/ProductDetailPage.tsx`
- Refactor: `src/components/ui/CartDrawer.tsx`
- Modify: `src/context/AppContext.tsx`

**Interfaces:**
- `ProductGallery({ images, productName, activeIndex, onActiveIndexChange })`.
- `PurchasePanel({ product, selectedSize, onSizeChange, onAddToCart, wishlisted, onToggleWishlist })`.

- [ ] Write gallery keyboard-navigation and purchase-validation tests.
- [ ] Run focused tests; expect failures.
- [ ] Implement desktop gallery with thumbnails, mobile swipe-friendly presentation and image fallbacks.
- [ ] Implement sticky desktop purchase panel and sticky mobile add-to-bag bar with stock-aware size selection.
- [ ] Upgrade cart drawer with editable variants, delivery threshold feedback and accessible announcements.
- [ ] Run tests, typecheck and build.
- [ ] Commit as `feat: redesign product purchase and cart experience`.

### Task 6: Secure seller authentication

**Files:**
- Create: `src/lib/auth.ts`
- Create: `src/lib/auth.test.ts`
- Refactor: `src/context/SellerAuthContext.tsx`
- Refactor: `src/pages/seller/SellerLoginPage.tsx`
- Modify: `src/components/seller/ProtectedRoute.tsx`
- Create: `docs/operations/admin-auth.md`

**Interfaces:**
- `getCurrentSeller(): Promise<Profile | null>`.
- `signInSeller(email: string, password: string): Promise<void>`.
- `signOutSeller(): Promise<void>`.
- `subscribeToAuthState(callback): () => void`.

- [ ] Write tests proving localStorage alone cannot authenticate and non-seller profiles are rejected.
- [ ] Run tests; expect current implementation to fail the security assertions.
- [ ] Replace the hardcoded PIN path with Supabase session authentication and a verified `profiles.role === 'seller'` check.
- [ ] Remove the browser-visible PIN and clear legacy `dylan_seller_auth` state during migration.
- [ ] Add operational documentation for creating, rotating and revoking seller accounts.
- [ ] Run tests, typecheck and build.
- [ ] Commit as `fix: secure seller authentication and authorization`.

### Task 7: Harden the canonical commerce schema

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/0002_commerce_hardening/migration.sql`
- Modify: `src/lib/database.types.ts`
- Modify: `scripts/schema.sql`
- Create: `docs/operations/database-migration.md`

**Interfaces:**
- New models/tables: `product_variants`, `inventory_movements`, `order_status_events`, `admin_audit_events`, `store_settings`.
- RPC `place_order(payload jsonb, items jsonb) returns uuid`.

- [ ] Add schema-level verification SQL covering foreign keys, unique constraints, non-negative inventory and seller-only writes.
- [ ] Run Prisma validation; expect schema mismatch before implementation.
- [ ] Add variant inventory, audit/status tables, indexes, triggers and RLS policies.
- [ ] Implement `place_order` as a security-definer transaction that validates items, locks variants, decrements stock and inserts order records atomically.
- [ ] Mark legacy array-based schema SQL as archival and document migration order, backup and rollback steps.
- [ ] Run `npx prisma validate` and migration SQL verification in a disposable database when credentials are available.
- [ ] Commit as `feat: add transactional commerce schema and inventory model`.

### Task 8: Split and harden the data-access layer

**Files:**
- Create: `src/lib/api/products.ts`
- Create: `src/lib/api/orders.ts`
- Create: `src/lib/api/customers.ts`
- Create: `src/lib/api/dashboard.ts`
- Create: `src/lib/api/settings.ts`
- Create: `src/lib/api/commerce.ts`
- Create: `src/lib/api/index.ts`
- Refactor: `src/lib/api.ts`
- Modify: `src/lib/product-cache.ts`
- Test: `src/lib/api/commerce.test.ts`

**Interfaces:**
- `placeOrder(input: CheckoutOrderInput): Promise<{ orderId: string; orderNumber: string }>`.
- `fetchProducts(filters?: ProductQuery): Promise<Product[]>`.
- `updateVariantInventory(variantId: string, quantity: number, reason: InventoryReason): Promise<void>`.

- [ ] Write tests for RPC payload mapping, error normalization, cache invalidation and stale response handling.
- [ ] Run tests; expect failures.
- [ ] Split the monolithic API module into domain modules and retain a temporary compatibility barrel.
- [ ] Route all order creation through `place_order`; remove separate client inserts for order items.
- [ ] Add explicit invalidation after product, inventory, order and settings mutations.
- [ ] Run tests, typecheck and build.
- [ ] Commit as `refactor: create typed commerce data services`.

### Task 9: Rebuild checkout and order confirmation

**Files:**
- Create: `src/components/checkout/ContactSection.tsx`
- Create: `src/components/checkout/DeliverySection.tsx`
- Create: `src/components/checkout/PaymentSection.tsx`
- Create: `src/components/checkout/OrderSummary.tsx`
- Create: `src/components/checkout/checkoutValidation.ts`
- Create: `src/components/checkout/checkoutValidation.test.ts`
- Refactor: `src/pages/CheckoutPage.tsx`
- Refactor: `src/pages/SuccessPage.tsx`
- Modify: `src/context/AppContext.tsx`

**Interfaces:**
- `validateCheckout(details): CheckoutValidationResult`.
- Checkout success navigation carries only the persisted order identifier, not an optimistic local completion flag.

- [ ] Write validation tests for Ghana phone numbers, required address fields, delivery/pickup modes and conditional Mobile Money fields.
- [ ] Run tests; expect failures.
- [ ] Implement responsive checkout: form left and sticky summary right on desktop; compact single column on mobile.
- [ ] Call transactional `placeOrder`, keep cart contents when persistence fails and show actionable inline errors.
- [ ] Update success page to fetch the persisted order and display pending-payment language when payment is not verified.
- [ ] Run tests, typecheck and build.
- [ ] Commit as `feat: add reliable responsive checkout flow`.

### Task 10: Build reusable admin shell and dashboard

**Files:**
- Create: `src/components/admin/AdminShell.tsx`
- Create: `src/components/admin/AdminSidebar.tsx`
- Create: `src/components/admin/AdminHeader.tsx`
- Create: `src/components/admin/MetricCard.tsx`
- Create: `src/components/admin/DataTable.tsx`
- Create: `src/components/admin/StatusBadge.tsx`
- Create: `src/components/admin/AdminShell.test.tsx`
- Refactor: `src/pages/seller/SellerDashboardPage.tsx`

**Interfaces:**
- `AdminShell({ title, description, actions, children })`.
- `DataTable<T>({ columns, rows, getRowKey, mobileCard })`.

- [ ] Write tests for active navigation, mobile drawer, accessible table labels and sign-out.
- [ ] Run tests; expect failures.
- [ ] Implement responsive admin shell with persistent desktop sidebar, tablet collapse and mobile drawer.
- [ ] Rebuild dashboard with revenue/order/product/customer metrics, pending-action queues and recent-order table.
- [ ] Run tests, typecheck and build.
- [ ] Commit as `feat: add responsive admin workspace`.

### Task 11: Rebuild product and inventory administration

**Files:**
- Refactor: `src/pages/seller/SellerProductsPage.tsx`
- Create: `src/pages/seller/SellerInventoryPage.tsx`
- Refactor: `src/pages/seller/components/ProductFormModal.tsx`
- Modify: `src/pages/seller/components/ProductCard.tsx`
- Create: `src/components/admin/ProductMediaManager.tsx`
- Create: `src/components/admin/VariantEditor.tsx`
- Create: `src/components/admin/InventoryAdjustmentDialog.tsx`

**Interfaces:**
- `ProductMediaManager` emits ordered `{ url, altText, position }[]`.
- `VariantEditor` emits `{ id?, size, color?, sku, priceOverride?, stockQuantity, active }[]`.

- [ ] Write component tests for media ordering, primary image, alt text, variant validation and inventory adjustment reason.
- [ ] Run tests; expect failures.
- [ ] Implement desktop table and mobile product cards with bulk selection, search, filters and stock states.
- [ ] Upgrade product editing to support three-to-five ordered images, alt text, variants, featured state and clear validation.
- [ ] Add inventory ledger and seller-only stock adjustment workflow.
- [ ] Run tests, typecheck and build.
- [ ] Commit as `feat: overhaul product media and inventory administration`.

### Task 12: Rebuild orders, customers and settings administration

**Files:**
- Refactor: `src/pages/seller/SellerOrdersPage.tsx`
- Refactor: `src/pages/seller/SellerUsersPage.tsx`
- Create: `src/pages/seller/SellerCustomerDetailPage.tsx`
- Create: `src/pages/seller/SellerSettingsPage.tsx`
- Create: `src/components/admin/OrderDetailDrawer.tsx`
- Create: `src/components/admin/OrderTimeline.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Order status updates insert `order_status_events` and optional tracking metadata.
- Store settings expose contact, pickup, shipping threshold, base shipping fee and public service copy.

- [ ] Write tests for allowed order transitions, customer navigation and settings validation.
- [ ] Run tests; expect failures.
- [ ] Implement responsive order queue, order detail drawer, fulfilment actions and event timeline.
- [ ] Implement customer list/detail with order totals and contact information.
- [ ] Implement settings forms backed by `store_settings` and add the new routes.
- [ ] Run tests, typecheck and build.
- [ ] Commit as `feat: complete orders customers and store settings admin`.

### Task 13: Upgrade customer profile, imagery and seed fixtures

**Files:**
- Refactor: `src/pages/ProfilePage.tsx`
- Modify: `scripts/seed.sql`
- Modify: `scripts/seed-db.ts`
- Create: `docs/operations/product-media-guidelines.md`

**Interfaces:**
- Profile provides tabs/sections for account details, orders and wishlist.
- Development fixtures contain multiple image records per featured product without modifying existing production rows.

- [ ] Write profile-state tests for signed-out, empty-order, populated-order and wishlist views.
- [ ] Run tests; expect failures.
- [ ] Implement responsive profile navigation and grounded empty/error states.
- [ ] Convert seed scripts to idempotent development fixtures and support multiple ordered image records.
- [ ] Document required image views, dimensions, licensing, alt text and replacement process.
- [ ] Run tests, typecheck and build.
- [ ] Commit as `feat: improve customer account and product media fixtures`.

### Task 14: Responsive end-to-end verification and release preparation

**Files:**
- Create: `playwright.config.ts`
- Create: `e2e/storefront.spec.ts`
- Create: `e2e/checkout.spec.ts`
- Create: `e2e/admin.spec.ts`
- Modify: `README.md`
- Modify: `vercel.json` if route or security headers require updates.

**Interfaces:**
- Viewports: mobile 390x844, tablet 834x1112 and desktop 1440x1000.

- [ ] Write Playwright smoke tests for navigation, search, catalogue filters, product selection, cart, checkout error recovery and seller-route protection.
- [ ] Run tests against the current implementation; record expected failures.
- [ ] Fix responsive overflow, keyboard traps, contrast, focus and reduced-motion failures found by the suite.
- [ ] Run `npm run test:run`, `npm run typecheck`, `npm run build` and `npm run test:e2e`; all must pass before release.
- [ ] Compare the implementation branch with `main`, verify no secrets are committed and verify migration documentation matches the SQL.
- [ ] Commit as `test: verify responsive commerce overhaul`.

## Release sequence

1. Deploy database migration to a staging Supabase project after backup.
2. Create and verify a seller account with `profiles.role = 'seller'`.
3. Deploy the implementation branch to a preview environment.
4. Run automated and manual checks at the three target viewport classes.
5. Verify order placement and rollback using test products and inventory.
6. Rotate the exposed legacy PIN and remove any deployment references to it.
7. Deploy application and migration during a controlled window.
8. Monitor order failures, auth failures and inventory adjustments.

## Definition of done

- Public and admin interfaces are purposefully composed at mobile, tablet and desktop sizes.
- The landing page retains its premium editorial identity but prioritizes product discovery.
- Product listing, detail, cart, wishlist, profile and checkout flows are usable by keyboard and touch.
- Seller access uses a real authenticated seller session; client-only PIN authentication is absent.
- Product variants and stock are represented relationally and order placement is transactional.
- Admin dashboard, products, inventory, orders, customers and settings share one coherent shell.
- Product media supports ordered multi-image galleries with alt text.
- Unit/component tests, typecheck, production build and responsive E2E checks pass.
- Migration, authentication and media operations are documented.
