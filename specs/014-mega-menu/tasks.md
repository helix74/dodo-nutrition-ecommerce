# Task: Mega Menu (F1)

## Objective

Add hover-triggered mega menu dropdowns for Categories (text list) and Brands (logo grid).

## Checklist

### Phase 1: Data Layer

- [x] Create Sanity queries for categories and brands (`lib/data/megamenu.ts`)

### Phase 2: Components

- [x] Create `MegaMenu.tsx` container (hover trigger with delay)
- [x] Create `CategoriesMegaMenu` (2-column text list)
- [x] Create `BrandsMegaMenu` (5-column logo grid)

### Phase 3: Integration

- [x] Create `HeaderServer.tsx` (server wrapper for data fetching)
- [x] Update `Header.tsx` to accept props and render mega menus
- [x] Update `app/(app)/layout.tsx` to use HeaderWithMegaMenu

### Phase 4: Verification

- [x] TypeScript check passes
- [ ] Visual test in browser (manual)
