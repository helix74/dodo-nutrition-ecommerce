# Implementation Plan: Mega Menu

## Proposed Changes

### Data Layer

- **[NEW]** `lib/data/megamenu.ts` — Sanity queries for categories + brands

### Components

- **[NEW]** `components/layout/MegaMenu.tsx` — Container with hover trigger + delay
- **[NEW]** `components/layout/CategoriesMegaMenu.tsx` — 2-column text list
- **[NEW]** `components/layout/BrandsMegaMenu.tsx` — 5-column logo grid

### Integration

- **[NEW]** `components/layout/HeaderServer.tsx` — Server wrapper for data fetching
- **[MODIFY]** `components/layout/Header.tsx` — Accept mega menu props
- **[MODIFY]** `app/(app)/layout.tsx` — Use HeaderWithMegaMenu

## Verification Plan

- TypeScript check passes (`npx tsc --noEmit`)
- Visual test in browser (hover Categories + Brands)
