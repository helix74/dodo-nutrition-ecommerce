# Implementation Plan: Homepage & Shop Improvements

---

## Proposed Changes

### Phase 1: Shop Page Pagination

#### [MODIFY] [page.tsx](<file:///c:/Users/Mohamed%20Ali%20Jardak/.gemini/antigravity/ecommerce-ai/app/(app)/shop/page.tsx>)

- Add `page` parameter to searchParams
- Calculate offset for GROQ query
- Fetch total count for pagination

#### [MODIFY] [products.ts](file:///c:/Users/Mohamed%20Ali%20Jardak/.gemini/antigravity/ecommerce-ai/lib/sanity/queries/products.ts)

- Add paginated product queries with LIMIT and OFFSET
- Add count query for total products

#### [NEW] [Pagination.tsx](file:///c:/Users/Mohamed%20Ali%20Jardak/.gemini/antigravity/ecommerce-ai/components/app/Pagination.tsx)

- Pagination component with page numbers
- Previous/Next buttons
- Current page indicator

#### [MODIFY] [ProductSection.tsx](file:///c:/Users/Mohamed%20Ali%20Jardak/.gemini/antigravity/ecommerce-ai/components/app/ProductSection.tsx)

- Add pagination props
- Render Pagination component

---

### Phase 2: WhyUsSection Upgrade

#### [MODIFY] [WhyUsSection.tsx](file:///c:/Users/Mohamed%20Ali%20Jardak/.gemini/antigravity/ecommerce-ai/components/home/WhyUsSection.tsx)

- Redesign with better cards
- Add more features (6 instead of 4)
- Better icons and layout
- Premium visual style

---

## Verification Plan

### Automated

```bash
# TypeScript check
pnpm exec tsc --noEmit

# Build verification
pnpm build
```

### Manual Testing

1. **Shop Page Pagination**:
   - Open http://localhost:3000/shop
   - Verify only 24 products show initially
   - Click page 2, verify different products load
   - Verify URL updates with ?page=2
   - Test with filters, verify pagination resets

2. **WhyUsSection**:
   - Open http://localhost:3000
   - Scroll to "Why Choose Us" section
   - Verify new design looks professional
   - Test responsive on mobile

---

## Estimated Effort

| Phase           | Time       |
| --------------- | ---------- |
| Shop Pagination | 45 min     |
| WhyUsSection    | 30 min     |
| Testing         | 15 min     |
| **Total**       | ~1.5 hours |
