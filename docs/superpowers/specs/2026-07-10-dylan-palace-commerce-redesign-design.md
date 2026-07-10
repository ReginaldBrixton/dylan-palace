# Dylan's Palace Commerce Redesign Specification

**Date:** 2026-07-10  
**Status:** Approved design direction  
**Repository:** `ReginaldBrixton/dylan-palace`  
**Implementation strategy:** Phased overhaul within the existing React, Vite, Tailwind CSS, Supabase and UploadThing stack

## 1. Purpose

Dylan's Palace will be upgraded from a visually distinctive mobile-first catalogue into a complete, responsive fashion-commerce application. The redesign will preserve the strongest part of the current product—the editorial, monochrome fashion identity—while improving navigation, product discovery, product presentation, checkout, administration, database integrity and security.

The finished application must behave intentionally on desktop, tablet and mobile rather than stretching one mobile layout across all viewport sizes. The public storefront and administrative portal will share a coherent design language but use separate information architectures optimized for their different jobs.

## 2. Product principles

1. **Commerce before decoration.** Motion, 3D treatments and editorial sections must support product discovery and purchase decisions rather than delay them.
2. **Distinct responsive compositions.** Desktop, tablet and mobile layouts may share components, but their navigation, density and page composition will differ where appropriate.
3. **Premium but practical.** The visual language will remain restrained, tactile and fashion-led without sacrificing legibility, accessibility or familiar shopping conventions.
4. **Secure administration.** No administrative secret, authorization decision or privileged database operation may depend on client-side code or local storage.
5. **One database model.** Prisma migrations will become the canonical schema history. Legacy SQL files that conflict with the relational schema will be retired or converted into documented migration helpers.
6. **Reliable ordering.** Order creation, order-item creation and inventory updates must succeed or fail as one transaction.
7. **Reusable system components.** Storefront and admin pages will use shared shells, controls, status treatments and data-access boundaries instead of copying page-specific structures.

## 3. Scope

### 3.1 Public storefront

The redesign covers:

- global navigation and responsive application shell;
- landing page;
- category and product-list pages;
- product search and filters;
- product cards and quick view;
- product-detail pages;
- wishlist and cart;
- checkout and order confirmation;
- customer profile and order history;
- footer, trust messaging and empty/error/loading states.

### 3.2 Administrative portal

The redesign covers:

- secure seller authentication;
- reusable admin shell;
- dashboard;
- product catalogue management;
- product media and variants;
- inventory management;
- orders and fulfilment;
- customer list and customer detail views;
- store settings and operational controls;
- audit history for important administrative changes.

### 3.3 Data and platform

The redesign covers:

- schema reconciliation;
- variant-level inventory;
- transactional order placement;
- order-status history;
- product media metadata and ordering;
- secure role-based access;
- indexes and constraints for common storefront/admin queries;
- migration and seed cleanup;
- typed data-access modules and cache invalidation.

### 3.4 Explicit non-goals for this implementation cycle

The following are excluded unless already supported by a configured provider:

- a marketplace with multiple independent sellers;
- international tax calculation;
- multi-currency settlement;
- warehouse-management automation;
- a native iOS or Android application;
- loyalty points, gift cards or subscriptions;
- fabricated payment confirmation without a real payment provider response.

Mobile Money may remain an order-payment option, but the interface must distinguish clearly between choosing Mobile Money and completing a verified payment. A real provider integration can be added behind the same payment boundary later.

## 4. Visual direction

### 4.1 Brand character

The approved direction is **classic editorial commerce**: warm ivory surfaces, clean white merchandising areas, charcoal typography, restrained olive accents, thin rules, strong product photography and subtle physical motion.

The present landing page's strongest qualities—large campaign imagery, category storytelling and fashion-laboratory details—will be retained in a more disciplined composition. Highly interactive elements will be used selectively and will provide a reduced-motion fallback.

### 4.2 Design tokens

The design system will define semantic tokens instead of repeating raw hexadecimal values in components:

- canvas, surface, elevated surface and inverse surface;
- primary, secondary and muted text;
- border, strong border and focus ring;
- brand accent, success, warning, danger and information;
- compact, standard and spacious spacing scales;
- small, standard and large radii;
- low, medium and high elevations;
- short, standard and long motion durations;
- standard responsive container widths.

Typography will use a display face for editorial headings and a highly legible sans-serif for controls and body content. The current font imports may be retained initially, but their roles and scales will be formalized.

### 4.3 Motion

Motion will be subtle and functional:

- page transitions limited to opacity and small translation;
- product-card image crossfades and restrained scale changes;
- bottom sheets and drawers with spring-based entry;
- button feedback and cart-count changes;
- no continuous decorative animation unless it communicates state;
- full support for `prefers-reduced-motion`.

## 5. Responsive architecture

### 5.1 Breakpoint intent

- **Mobile:** below 768 px. Compact two-column merchandising, touch-first sheets, sticky actions and minimal chrome.
- **Tablet:** 768–1199 px. Three-column merchandising, condensed desktop-style header, split forms where useful and slide-over admin navigation.
- **Desktop:** 1200 px and above. Full commerce header, persistent catalogue filters where appropriate, four-column merchandising and persistent admin sidebar.

Breakpoints express layout intent rather than device names; components must remain fluid between them.

### 5.2 Storefront shell

#### Desktop

The desktop header will contain:

- brand mark;
- primary category navigation;
- expandable search;
- account, wishlist and cart actions;
- optional announcement strip;
- active-route and keyboard-focus states.

The header may become compact after scrolling but must not collapse into the current mobile icon bar.

#### Tablet

Tablet receives a condensed header with visible category access, search and account/cart actions. Secondary categories may open in a popover or drawer.

#### Mobile

Mobile receives:

- a compact fixed header;
- menu/search/cart actions;
- horizontally scrollable category navigation where useful;
- bottom navigation only on high-frequency shopping routes;
- safe-area padding and 44 px minimum touch targets.

### 5.3 Admin shell

A single `AdminShell` will own:

- sidebar/drawer navigation;
- active route state;
- top bar;
- page title and optional breadcrumbs;
- store-status and notification affordances;
- responsive content container;
- sign-out controls.

Desktop uses a persistent sidebar. Tablet and mobile use a drawer plus a compact top bar. Individual admin pages will no longer duplicate navigation markup.

## 6. Storefront experience

### 6.1 Landing page

The landing page will be reorganized into a conversion-oriented editorial sequence:

1. announcement or service strip;
2. full-bleed hero with one primary call to action and one optional secondary action;
3. category navigation tiles;
4. featured or new-arrival product rail;
5. one interactive editorial feature retained from the current experience;
6. campaign blocks for priority categories;
7. trust and service information for delivery, pickup and payments;
8. newsletter or contact capture;
9. full footer.

Images must have explicit aspect ratios, responsive sources where possible, descriptive alternative text and intentional focal positioning. The hero must not rely on the first product returned by the database; merchandising content will be configurable.

### 6.2 Product-list pages

#### Desktop

- category title, description and product count;
- persistent left filter rail or a structured top filter bar depending on available width;
- four-column product grid;
- sort selector;
- active-filter chips with clear-all action;
- pagination or cursor-based loading rather than an unexplained fixed display limit;
- no long-press-only interaction.

#### Tablet

- three-column product grid;
- filters in a slide-over sheet;
- sticky compact toolbar for sort and filters.

#### Mobile

- two-column product grid;
- compact product metadata;
- filter and sort bottom sheets;
- visible quick-view or quick-add affordance rather than requiring a long press;
- optional one-column editorial cards inserted sparingly.

Search will match name, brand, category, subcategory and relevant tags. Filter state will be represented in the URL so results can be shared and browser navigation behaves correctly.

### 6.3 Product cards

A shared product-card component will support:

- primary image;
- optional secondary image on hover-capable devices;
- name, brand and price;
- sale, new, featured and low-stock badges where supported by data;
- wishlist action;
- explicit quick view;
- quick add when the product has one selectable variant, otherwise opening the product page;
- consistent unavailable and out-of-stock states;
- image skeleton and failure fallback.

### 6.4 Product-detail page

#### Desktop

- two-column composition;
- large media gallery with thumbnails or a two-up editorial grid;
- sticky purchase panel;
- product title, price, stock state and variant selectors;
- size guide;
- delivery/pickup estimate;
- add-to-cart and buy-now actions;
- accordion or tabbed product details;
- related products and recently viewed products.

#### Mobile and tablet

- swipeable image gallery;
- concise product summary;
- accessible variant selectors;
- sticky bottom purchase bar after the primary call to action leaves the viewport;
- accordions for supporting details.

The page must handle products with one image gracefully while making three to five images the preferred merchandising standard.

### 6.5 Cart

Desktop cart opens as a right-side drawer. Mobile cart opens as a full-height sheet. Both include:

- product image and selected variant;
- quantity controls;
- remove action with optional undo;
- subtotal and shipping-progress message;
- unavailable-item handling;
- checkout action;
- empty-cart recommendations.

Cart data remains locally resilient but is normalized around variant IDs rather than only product ID and size text.

### 6.6 Checkout

Desktop checkout becomes a two-column layout with a sticky order summary. Mobile remains a single guided flow.

The form will include:

- contact details;
- recipient details;
- phone validation suitable for Ghanaian numbers;
- delivery or pickup choice;
- address, city/area and optional GhanaPost GPS/digital address;
- optional location assistance without making ZIP code mandatory for Ghana;
- payment-method selection;
- order notes;
- clear validation messages adjacent to fields;
- final review before submission.

Order submission will be idempotent and transactional. The success page will display confirmed order data returned by the backend, not merely navigate after a client-side callback.

### 6.7 Customer account

The account area will support:

- profile details;
- saved addresses if introduced during implementation;
- order history and order-detail view;
- wishlist;
- sign-in/sign-out state;
- guest-order lookup by order number plus verified contact detail if guest checkout remains enabled.

## 7. Administrative experience

### 7.1 Authentication and authorization

The current browser-embedded PIN and local-storage authorization flag will be removed.

The seller portal will use Supabase Auth with a seller profile role. Administrative routes will require a valid Supabase session and seller role. Database RLS remains the final authorization layer.

The existing PIN must be considered compromised because it was shipped in client code. It will not be retained as a production secret. If a passcode-style experience is later required, it must be implemented server-side with a hashed secret, rate limiting, expiry and a real authenticated session.

### 7.2 Dashboard

The dashboard will present actionable operational information:

- revenue from non-cancelled orders for a selected period;
- order count and average order value;
- pending/confirmed fulfilment queue;
- low-stock and out-of-stock products;
- best-selling products;
- recent orders;
- customer count;
- trend comparison to the previous equivalent period where enough data exists.

Metrics must have explicit definitions and avoid using placeholders that appear financially authoritative.

### 7.3 Product management

The products page will include:

- searchable, filterable table on desktop;
- card/list hybrid on mobile;
- category, stock, featured and publication filters;
- bulk feature/unfeature, stock-state and archival operations where safe;
- clearly separated create and edit flows;
- duplicate-product action;
- confirmation for destructive actions;
- optimistic UI only where rollback is reliable.

The product editor will support:

- product identity and description;
- category and subcategory;
- brand, gender, tags and colors;
- price and optional compare-at price;
- variants and variant-level stock;
- multiple-image upload;
- drag-to-reorder images;
- primary-image selection;
- alt text;
- featured and publication state;
- AI-assisted metadata as an optional suggestion, never an automatic overwrite.

Image deletion will occur only after the database update succeeds or through a recoverable cleanup process, preventing broken product records if storage deletion fails.

### 7.4 Orders

The order workspace will provide:

- status tabs and filters;
- search by order number, customer, email or phone;
- sortable desktop table;
- compact mobile cards;
- order-detail drawer/page;
- line items and variant snapshots;
- payment state distinct from fulfilment state;
- tracking and fulfilment notes;
- valid status transitions;
- status-history timeline;
- customer contact actions;
- printable packing summary if practical within the existing stack.

### 7.5 Customers

The customer area will show:

- profile/contact details;
- total orders and lifetime order value;
- most recent order;
- order history;
- account status;
- search and filtering.

Sensitive data will be displayed only to authenticated sellers and protected by RLS.

### 7.6 Settings

A basic settings area will centralize operational values currently scattered through constants or copy:

- store contact details;
- pickup location;
- base shipping fee;
- free-shipping threshold;
- delivery messaging;
- announcement text and enabled state;
- enabled payment methods;
- storefront social links.

Secrets and provider credentials will never be editable through or returned to the browser.

## 8. Database design

### 8.1 Canonical schema

`prisma/schema.prisma` and Prisma migrations will become the canonical schema definition. Legacy scripts that define incompatible array-based product images and sizes will be removed from active setup instructions or replaced with migration-safe equivalents.

Generated TypeScript database types must be refreshed after schema changes.

### 8.2 Product and merchandising changes

The product model will gain or formalize:

- `slug` with uniqueness constraint;
- `status` or publication state (`draft`, `active`, `archived`);
- optional `compareAtPrice`;
- optional merchandising timestamps such as `publishedAt`;
- image metadata including position, alt text and primary status;
- consistent timestamps.

Variant-level inventory will replace the ambiguous combination of global stock quantity and size-level Boolean stock. A `ProductVariant` model will contain:

- product relationship;
- SKU;
- size and optional color or option values;
- price override only when necessary;
- stock quantity;
- active state;
- uniqueness constraint across product and option combination.

Product availability will be derived from active variants, with a controlled fallback for one-size products.

### 8.3 Orders and payments

Order records will separate:

- fulfilment status;
- payment status;
- selected payment method;
- provider reference where available;
- subtotal, shipping, discount and total snapshots;
- delivery or pickup mode;
- GhanaPost GPS/digital address when provided.

Order items will snapshot:

- product and variant IDs where still available;
- product name;
- SKU;
- selected options;
- image;
- unit price;
- quantity.

A status-history table will record actor, previous state, new state, note and timestamp.

### 8.4 Transactional order placement

Order placement will move into a PostgreSQL function or protected server endpoint that performs, in one transaction:

1. validate product/variant availability;
2. calculate authoritative prices and shipping;
3. create the order;
4. create order items;
5. decrement inventory safely;
6. return the complete confirmed order record.

Repeated submissions will use an idempotency key. Insufficient stock will return a structured conflict response without creating a partial order.

### 8.5 Security and RLS

RLS policies will be reviewed for every table. Requirements include:

- public read access only to active storefront product data;
- seller-only product, inventory, customer and fulfilment writes;
- customers limited to their own profile, wishlist and orders;
- guest order creation only through the protected order-placement boundary;
- no service-role key in the browser;
- no administrative bypass based on UI route protection.

### 8.6 Auditability

An `AdminAuditLog` table will record high-impact actions such as:

- product creation, archive and deletion;
- stock adjustments;
- order-status changes;
- settings changes.

The log is append-only to client roles.

## 9. Application architecture

### 9.1 Component boundaries

The frontend will be organized around clear layers:

- `components/storefront`: public shopping components;
- `components/admin`: admin shell and reusable controls;
- `components/ui`: low-level primitives;
- `features/catalog`, `features/cart`, `features/checkout`, `features/orders`, `features/admin-products`;
- `lib/api`: typed data-access boundaries;
- `lib/validation`: shared input schemas;
- `lib/format`: currency, phone, date and address formatting;
- `routes`: route composition and guards.

Large pages will be decomposed into focused components with explicit props. Route-level components will coordinate data and layout rather than contain every interaction inline.

### 9.2 Data fetching and caching

The existing request deduplication may remain initially, but cache keys and invalidation will be centralized. Mutations must invalidate related product, category, dashboard and order caches deterministically.

URL-driven catalogue state will prevent filter state from being trapped in local component state.

Real-time subscriptions may be used selectively for admin orders or stock, but polling or manual refresh is acceptable if it is more reliable within the current deployment.

### 9.3 Error handling

The application will define reusable states for:

- route-level failure;
- empty result;
- offline/network failure;
- permission denied;
- validation errors;
- stock conflict;
- upload failure;
- partial storage cleanup.

User-facing errors will be actionable. Technical details remain in controlled logs.

## 10. Product imagery strategy

The database and admin experience will support multiple product images immediately. Existing products will retain their current primary images.

Additional imagery will be added only from assets the store owns, licensed sources, or newly produced/generated assets approved for commercial use. Images must represent the actual product accurately; generic fashion photography will not be attached to a product as though it depicts that item.

Preferred image set per product:

1. front or primary view;
2. rear or alternate angle;
3. material/detail close-up;
4. styled view;
5. scale or fit reference where relevant.

The migration will not fabricate unavailable angles. Products with one image will remain valid and will be flagged in admin as needing more media.

## 11. Accessibility and quality requirements

The redesign must meet the following baseline:

- semantic landmarks and headings;
- keyboard-operable navigation, drawers, filters, galleries and modals;
- visible focus states;
- correctly associated labels and validation messages;
- accessible dialog focus trapping and escape behavior;
- no hover-only critical action;
- minimum touch-target sizing;
- sufficient text and control contrast;
- reduced-motion support;
- meaningful image alternative text;
- responsive text without clipping at 200% zoom.

## 12. Testing strategy

### 12.1 Automated checks

- TypeScript compilation;
- production build;
- unit tests for formatters, calculations, validation and status transitions;
- integration tests for product queries, cart normalization and transactional order placement;
- component tests for filters, variant selection, cart and admin product form;
- route tests for protected seller access;
- accessibility checks for major page templates.

### 12.2 Responsive verification

At minimum, verify:

- 360 × 800 mobile;
- 390 × 844 mobile;
- 768 × 1024 tablet portrait;
- 1024 × 768 tablet landscape;
- 1280 × 800 desktop;
- 1440 × 900 desktop;
- 1920 × 1080 wide desktop.

### 12.3 Critical user journeys

1. browse category, filter products, open a product and add a variant to cart;
2. edit cart, complete checkout and receive a confirmed order;
3. sign in as seller and view dashboard;
4. create a product with multiple images and variants;
5. update inventory;
6. process an order through valid fulfilment states;
7. verify a customer can see only their own data;
8. verify a non-seller cannot access or mutate admin data.

## 13. Migration and rollout

Implementation will proceed in controlled phases on a feature branch:

### Phase 1: foundations and security

- establish semantic design tokens;
- create storefront and admin shells;
- replace insecure seller authentication;
- reconcile schema ownership and migration process;
- add protected transactional order boundary.

### Phase 2: storefront conversion

- responsive global navigation;
- landing page;
- catalogue, filters and product cards;
- product-detail page;
- cart and checkout;
- customer account states.

### Phase 3: admin conversion

- unified admin shell;
- dashboard;
- products, media and variants;
- inventory;
- orders;
- customers and settings.

### Phase 4: data enrichment and polish

- migrate variant inventory;
- add image-quality/admin completeness indicators;
- add approved additional product media;
- performance and accessibility pass;
- responsive visual regression pass;
- deployment documentation and rollback notes.

Database migrations must be backward-aware. Destructive schema removal will occur only after application code no longer depends on the old fields and migrated data has been verified.

## 14. Acceptance criteria

The redesign is complete when:

1. Storefront layouts are intentionally composed for mobile, tablet and desktop.
2. Desktop has full commerce navigation and no longer resembles a stretched mobile application.
3. Product discovery supports URL-backed search, filtering and sorting.
4. Product detail uses a responsive gallery and clear variant purchasing flow.
5. Checkout creates orders transactionally and handles stock conflicts safely.
6. Seller authentication is server-backed/Supabase-backed; no passcode or authorization flag is trusted from client code.
7. All admin routes use one reusable admin shell.
8. Products support ordered multiple images and variant-level inventory.
9. Orders expose distinct payment and fulfilment states plus status history.
10. Conflicting schema setup files are removed from active use and Prisma migrations are authoritative.
11. Major storefront and admin journeys pass type, build, responsive and accessibility verification.
12. Existing usable product and order data is preserved through documented migrations.

## 15. Implementation boundary decision

The project will remain on React, Vite, Tailwind CSS, Supabase and UploadThing for this cycle. A Next.js migration is not part of the approved approach. Security-sensitive operations will be placed behind Supabase-native or server-side boundaries rather than forcing a framework migration.

This specification deliberately separates visual redesign from data integrity and security, but they will be implemented as one coordinated programme so the final interface reflects real system state and does not mask unsafe behavior.