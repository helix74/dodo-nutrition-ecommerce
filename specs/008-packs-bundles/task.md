# Tasks: Packs & Bundles (008)

> **Status**: ✅ COMPLETE
> **Last Verified**: 2026-01-31

## Backend (Sanity)

- [x] Create `sanity/schemaTypes/packType.ts`
- [x] Register pack type in `sanity/schemaTypes/index.ts`

## Data Layer

- [x] Create `lib/sanity/queries/packs.ts` with GROQ queries
  - `ALL_PACKS_QUERY`
  - `FEATURED_PACKS_QUERY`
  - `PACK_BY_SLUG_QUERY`
  - `PACKS_BY_CATEGORY_QUERY`

## Frontend

- [x] Create `components/app/PackCard.tsx`
- [x] Create `components/app/AddPackToCart.tsx`
- [x] Create `app/(app)/packs/page.tsx` - Packs listing page
- [x] Create `app/(app)/packs/[slug]/page.tsx` - Pack detail page
- [x] Cart integration with `type: "pack"` support

## Verification

- [x] Sanity schema registered and working
- [x] Pack detail page with product list
- [x] Add-to-cart functionality
- [x] `pnpm build` passes

## Pack Schema Features

- Name, slug, tagline, description
- Products array with quantity
- Pricing: Original vs Bundle price
- Pack categories (masse, seche, performance, etc.)
- Featured flag, stock management
