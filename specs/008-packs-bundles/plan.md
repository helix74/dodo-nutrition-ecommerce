# Implementation Plan: Packs & Bundles (008)

> **Date**: 2026-01-18
> **Status**: 📋 Draft

---

## Proposed Changes

### Backend (Sanity)

#### [NEW] `packType.ts`

Create the pack schema with fields for name, slug, description, image, products array, pricing, and stock.

#### [MODIFY] `sanity/schemaTypes/index.ts`

Register the new `packType` in the schema list.

---

### Data Layer (Queries)

#### [NEW] `sanity/lib/packs/queries.ts`

- `ALL_PACKS_QUERY`: Fetch all packs with product details.
- `PACK_BY_SLUG_QUERY`: Fetch single pack by slug.
- `FEATURED_PACKS_QUERY`: Fetch featured packs.

#### [MODIFY] `sanity/lib/products/queries.ts` (optional)

Add filter to exclude packs from product-only queries if needed.

---

### Frontend

#### [NEW] `app/(app)/packs/[slug]/page.tsx`

Pack detail page with hero, product list, pricing comparison, and add-to-cart.

#### [NEW] `components/app/PackCard.tsx`

Card component for displaying packs in grid (similar to ProductCard).

#### [MODIFY] `app/(app)/shop/page.tsx`

Add pack data fetching and display. Add "Packs" filter option.

#### [MODIFY] `store/cart-store.ts`

Add support for pack items (type: 'pack', expandable contents).

---

## Verification Plan

### Automated

- `pnpm build` passes.
- TypeScript check passes.

### Manual

1. Create a test pack in Sanity Studio with 2+ products.
2. Verify pack appears in shop page grid.
3. Navigate to pack detail page.
4. Add pack to cart.
5. Verify cart shows pack with expandable contents.
