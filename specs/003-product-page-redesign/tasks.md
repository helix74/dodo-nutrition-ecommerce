# Tasks: Product Page Redesign + Reviews (Feature 003)

## Phase 1: Review Schema (Backend)

- [ ] **1.1** Create `sanity/schemaTypes/reviewType.ts`

  - Fields: product, authorName, rating, title, content, status, verifiedPurchase, createdAt
  - Preview with stars and status

- [ ] **1.2** Register review type in `sanity/schemaTypes/index.ts`

- [ ] **1.3** Run `pnpm typegen` to generate types

---

## Phase 2: GROQ Queries

- [ ] **2.1** Add `PRODUCT_REVIEWS_QUERY` to `lib/sanity/queries/products.ts`

  - Get approved reviews for a product (limit 10)

- [ ] **2.2** Add `PRODUCT_RATING_QUERY`

  - Get average rating and count

- [ ] **2.3** Add `RELATED_PRODUCTS_QUERY`
  - Get 4 products from same category

---

## Phase 3: UI Components

- [ ] **3.1** Create `components/app/ProductAccordion.tsx`

  - Use Shadcn Accordion
  - Sections: Description, Benefits, Mode d'Emploi, Certifications
  - Description open by default

- [ ] **3.2** Create `components/app/ProductReviews.tsx`

  - Display average rating with stars
  - List review cards
  - "Laisser un avis" button

- [ ] **3.3** Create `components/app/ReviewForm.tsx`

  - Modal with star rating selector
  - Name, title, content fields
  - Submit button

- [ ] **3.4** Create `components/app/RelatedProducts.tsx`
  - Horizontal carousel of 4 product cards

---

## Phase 4: Server Actions

- [ ] **4.1** Create `lib/actions/reviews.ts`
  - `submitReview(data)` function
  - Create review in Sanity with status="pending"

---

## Phase 5: Product Page Layout

- [ ] **5.1** Update `app/(app)/products/[slug]/page.tsx`

  - Fetch reviews and related products
  - New layout structure:
    1. Hero (image + info + buy)
    2. Accordion sections
    3. Reviews section
    4. Related products

- [ ] **5.2** Update `components/app/ProductInfo.tsx`
  - Remove accordion sections (now separate)
  - Keep only hero info (name, price, cart button, stock)
  - Add average rating display

---

## Phase 6: Verification

- [ ] **6.1** Run `pnpm typegen`
- [ ] **6.2** Run `pnpm build` - verify no errors
- [ ] **6.3** Test accordion on product page
- [ ] **6.4** Submit a test review
- [ ] **6.5** Approve review in Sanity Studio
- [ ] **6.6** Verify review appears on product page
- [ ] **6.7** Test on mobile

---

## Task Count: 17 tasks across 6 phases
