# Feature 009: Reviews System - Tasks

> **Parent Spec**: [spec.md](./spec.md)  
> **Plan**: [plan.md](./plan.md)  
> **Last Updated**: 2026-01-22

---

## Phase 1: Schema & Foundation

### 1.1 Schema Update

- [ ] Add `reviewType` field (general | category)
- [ ] Add `category` reference field
- [ ] Add `source` field (website | google)
- [ ] Add `googleReviewId` field
- [ ] Add `featured` boolean field
- [ ] Add `clerkId` field
- [ ] Add `order` reference field
- [ ] Update preview configuration
- [ ] Run `pnpm typegen`

### 1.2 Queries File

- [ ] Create `lib/sanity/queries/reviews.ts`
- [ ] Add `FEATURED_REVIEWS_QUERY`
- [ ] Add `CATEGORY_REVIEWS_QUERY`
- [ ] Add `PENDING_REVIEWS_QUERY`
- [ ] Add `ALL_REVIEWS_ADMIN_QUERY`
- [ ] Add `REVIEW_STATS_QUERY`

### 1.3 Enhanced Actions

- [ ] Update `lib/actions/reviews.ts`
- [ ] Add `approveReview()`
- [ ] Add `rejectReview()`
- [ ] Add `toggleFeatured()`
- [ ] Add `assignCategory()`
- [ ] Add `deleteReview()`

---

## Phase 2: Admin Moderation Panel

### 2.1 Admin Page

- [ ] Create `app/(admin)/admin/reviews/page.tsx`
- [ ] Add tab filters (pending, approved, google, rejected)
- [ ] Fetch reviews with correct query
- [ ] Display review list

### 2.2 Admin Components

- [ ] Create `components/admin/ReviewRow.tsx`
- [ ] Add star rating display
- [ ] Add status badge
- [ ] Add source badge (website/google)
- [ ] Add action buttons

### 2.3 Admin Actions

- [ ] Wire approve button to action
- [ ] Wire reject button to action
- [ ] Wire featured toggle
- [ ] Add category assignment dropdown

### 2.4 Navigation

- [ ] Add "Avis" link to admin sidebar/nav

---

## Phase 3: Homepage Testimonials

### 3.1 Component Creation

- [ ] Create `components/home/TestimonialsSection.tsx`
- [ ] Add section header with Darija title
- [ ] Create review card component
- [ ] Add carousel/grid layout
- [ ] Add overall stats display
- [ ] Add "Laisser un avis" CTA button

### 3.2 Homepage Integration

- [ ] Import TestimonialsSection in `app/(app)/page.tsx`
- [ ] Fetch featured reviews
- [ ] Position after WhyUsSection

---

## Phase 4: Category Reviews on Products

### 4.1 Component Creation

- [ ] Create `components/app/CategoryReviews.tsx`
- [ ] Fetch reviews by category ID
- [ ] Display 3-5 reviews
- [ ] Add "Voir plus" expandable
- [ ] Add "Laisser un avis" button

### 4.2 Product Page Integration

- [ ] Import CategoryReviews in `app/(app)/products/[slug]/page.tsx`
- [ ] Pass category ID to component
- [ ] Position after ProductAccordion

### 4.3 Rating Badge on Product Title

- [ ] Add rating display beside product title (⭐ 4.8 (24 avis))
- [ ] Update `ProductInfo.tsx` to accept and display rating
- [ ] Clickable badge scrolls to reviews section

---

## Phase 5: Review Form (Multi-location)

### 5.1 Form Component

- [ ] Create `components/app/ReviewForm.tsx`
- [ ] Add star rating input (interactive)
- [ ] Add author name input
- [ ] Add comment textarea
- [ ] Add category selector (optional)
- [ ] Add submit handler
- [ ] Add success state

### 5.2 Dialog Component

- [ ] Create `components/app/ReviewFormDialog.tsx`
- [ ] Wrap ReviewForm in Dialog
- [ ] Add trigger button prop
- [ ] Handle open/close state

### 5.3 Integration Points

- [ ] Add to homepage (TestimonialsSection CTA)
- [ ] Add to checkout success page
- [ ] Add to product pages (CategoryReviews CTA)
- [ ] Add to footer (optional link)

---

## Phase 6: Google Maps Structure

### 6.1 API Route

- [ ] Create `app/api/admin/google-reviews/route.ts`
- [ ] Add POST handler structure
- [ ] Add placeholder for Google API call
- [ ] Add Sanity document creation logic
- [ ] Add comments for future implementation

### 6.2 Import UI (Optional)

- [ ] Create basic import page structure
- [ ] Add Place ID input
- [ ] Add placeholder import button

---

## Verification

### Build Checks

- [ ] `npx tsc --noEmit` passes
- [ ] `pnpm build` passes

### Functional Tests

- [ ] Submit review from homepage → appears in admin as pending
- [ ] Admin approve → review appears on homepage if featured
- [ ] Admin assign category → review appears on category products
- [ ] Submit from checkout success → works correctly
- [ ] Submit from product page → category pre-selected

### Visual Tests

- [ ] Homepage testimonials look premium
- [ ] Admin panel follows dark theme
- [ ] Review cards match Dodo branding
- [ ] Mobile responsive

---

## Notes

- Google Maps API integration is structure-only (awaiting credentials)
- Arabic font for Darija headlines
- All CTAs use `bg-dodo-yellow`
