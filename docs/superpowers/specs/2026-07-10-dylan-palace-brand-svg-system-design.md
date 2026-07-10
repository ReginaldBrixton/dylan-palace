# Dylan's Palace Brand and SVG System Specification

**Date:** 2026-07-10  
**Parent specification:** `2026-07-10-dylan-palace-commerce-redesign-design.md`

## 1. Purpose

This companion specification makes the requested SVG and brand-asset redesign explicit. The current project contains a simple crown-style favicon and several hand-built interactive product diagrams. These assets will be redesigned as one coherent, reusable visual system rather than replaced with unrelated decorative icons.

## 2. Brand asset set

The implementation will provide:

- a primary Dylan's Palace wordmark;
- a compact `DP` monogram;
- a refined palace/crown symbol suitable for small sizes;
- light and dark SVG variants;
- favicon and application-icon exports based on the same geometry;
- an accessible inline logo component with configurable title, size and color;
- social-preview artwork using the approved brand mark and editorial direction.

The new symbol must remain recognizable at 16–32 px, avoid fragile detail and work in one color. It must not imitate a protected fashion-house logo.

## 3. Interface SVG system

Custom SVGs will be limited to places where they add brand value or explain a product feature. Standard functional controls will continue to use a consistent icon library.

The custom set will include:

- refined category marks for shirts, trousers, shoes and bags;
- empty-cart, empty-wishlist and no-results illustrations;
- secure checkout and delivery/pickup service marks;
- compact admin empty-state illustrations;
- revised interactive product diagrams for the landing page.

All interface SVGs must use semantic current-color or design tokens instead of embedding inconsistent hexadecimal values throughout components.

## 4. Interactive landing-page diagrams

The existing bag, shoe and trouser SVG experiences will be evaluated individually. The redesign will retain at most one prominent interactive laboratory experience in the main landing-page flow; additional diagrams may become lighter product-education modules or be removed if they distract from shopping.

Revised diagrams must:

- use cleaner fashion-technical linework;
- share one grid, stroke and annotation language;
- respond to touch as well as hover;
- expose visible controls instead of hidden hover-only actions;
- include reduced-motion behavior;
- avoid continuous animation that consumes attention or battery;
- remain legible on compact mobile widths;
- provide an accessible textual explanation of the demonstrated feature.

## 5. SVG engineering requirements

- Use stable `viewBox` dimensions and no fixed rendered width or height unless required by the context.
- Remove editor metadata, unused groups and redundant path points.
- Use unique IDs for gradients, masks and patterns to prevent collisions when multiple instances render on one page.
- Do not put meaningful text only inside an SVG; important labels must exist in accessible HTML or an SVG title/description.
- Decorative SVGs use `aria-hidden="true"`; meaningful SVGs receive an accessible name.
- Preserve sharp rendering at common device-pixel ratios.
- Keep static brand assets small enough for immediate loading and inline only assets that benefit from CSS theming.
- Test light, dark, high-contrast and reduced-motion states.

## 6. Product imagery relationship

SVG illustrations will not substitute for real product photography. Product pages and cards will prioritize accurate product images; technical SVGs may supplement them only when they explain construction, measurements or product features.

## 7. Acceptance criteria

The SVG work is complete when:

1. The favicon, monogram, symbol and wordmark form one recognizable family.
2. Brand marks render correctly on light and dark surfaces from mobile through desktop.
3. Existing custom product diagrams either meet the shared SVG system or are intentionally retired.
4. No critical shopping action depends on an unlabeled or hover-only SVG interaction.
5. SVG IDs do not collide when components are rendered multiple times.
6. Meaningful graphics have accessible text equivalents.
7. The new assets are used consistently across storefront, checkout and admin surfaces.