# Tasks: Packs & Bundles (008)

## Backend (Sanity)

- [ ] Create `sanity/schemaTypes/packType.ts`
- [ ] Register pack type in `sanity/schemaTypes/index.ts`

## Data Layer

- [ ] Create `sanity/lib/packs/queries.ts` with GROQ queries
- [ ] Create `sanity/lib/packs/getPacks.ts` server functions

## Frontend

- [ ] Create `components/app/PackCard.tsx`
- [ ] Create `app/(app)/packs/[slug]/page.tsx`
- [ ] Update `app/(app)/shop/page.tsx` to include packs
- [ ] Update `store/cart-store.ts` for pack support

## Verification

- [ ] Create test pack in Sanity Studio
- [ ] Verify shop page displays packs
- [ ] Verify pack detail page
- [ ] Verify add-to-cart functionality
- [ ] Run `pnpm build`

## Documentation

- [ ] Update `verify.md`
