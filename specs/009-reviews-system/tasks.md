# Feature 009: Reviews System - Tasks

> **Parent Spec**: [spec.md](./spec.md)
> **Status**: ✅ 98% COMPLETE (Google Maps import pending)
> **Last Verified**: 2026-01-31

---

## Phase 1: Schema & Foundation ✅

### 1.1 Schema Update

- [x] Add `reviewType` field (general | category)
- [x] Add `category` reference field
- [x] Add `source` field (website | google)
- [x] Add `googleReviewId` field
- [x] Add `featured` boolean field
- [x] Add `clerkId` field
- [x] Add `order` reference field
- [x] Add `verifiedPurchase` field
- [x] Add `status` field (pending | approved | rejected)
- [x] Update preview configuration
- [x] Run `pnpm typegen`

### 1.2 Queries File

- [x] Create `lib/sanity/queries/reviews.ts`
- [x] Add `FEATURED_REVIEWS_QUERY`
- [x] Add `CATEGORY_REVIEWS_QUERY`
- [x] Add `CATEGORY_RATING_QUERY`
- [x] Add `REVIEW_STATS_QUERY`
- [x] Add `ALL_REVIEWS_ADMIN_QUERY`
- [x] Add `PENDING_REVIEWS_COUNT_QUERY`
- [x] Add `REVIEWS_BY_STATUS_QUERY`
- [x] Add `GOOGLE_REVIEWS_QUERY`

### 1.3 Enhanced Actions

- [x] Create `lib/actions/reviews.ts`
- [x] Add `submitReview()`
- [x] Add `approveReview()`
- [x] Add `rejectReview()`
- [x] Add `toggleFeatured()`
- [x] Add `assignCategory()`
- [x] Add `deleteReview()`
- [x] Add `bulkApproveReviews()`

---

## Phase 2: Admin Moderation Panel ✅

### 2.1 Admin Page

- [x] Create `app/(admin)/admin/reviews/page.tsx`
- [x] Add tab filters (pending, approved, google, rejected)
- [x] Fetch reviews with correct query
- [x] Display review list with `ReviewsAdminClient.tsx`

### 2.2 Admin Components

- [x] Create `ReviewsAdminClient.tsx`
- [x] Add star rating display
- [x] Add status badge
- [x] Add source badge (website/google)
- [x] Add action buttons

### 2.3 Admin Actions

- [x] Wire approve button to action
- [x] Wire reject button to action
- [x] Wire featured toggle
- [x] Add category assignment dropdown

---

## Phase 3: Homepage Testimonials ✅

### 3.1 Component Creation

- [x] Create `components/home/TestimonialsSection.tsx`
- [x] Add section header with Darija title ("شنوا قالوا عليّنا ⭐")
- [x] Create review card component
- [x] Add carousel with navigation arrows
- [x] Add overall stats display
- [x] Add "Laisser un avis" CTA button

### 3.2 Homepage Integration

- [x] Import TestimonialsSection in home page
- [x] Fetch featured reviews
- [x] Position after WhyUsSection

---

## Phase 4: Category Reviews on Products ✅

### 4.1 Component Creation

- [x] Create `components/app/CategoryReviews.tsx`
- [x] Fetch reviews by category ID
- [x] Display reviews with ratings
- [x] Add "Laisser un avis" button

---

## Phase 5: Review Form (Multi-location) ✅

### 5.1 Form Component

- [x] Create `components/app/ReviewForm.tsx`
- [x] Add star rating input (interactive)
- [x] Add author name input
- [x] Add comment textarea
- [x] Add category selector (optional)
- [x] Add submit handler
- [x] Add success state

### 5.2 Dialog Component

- [x] Create `components/app/ReviewFormDialog.tsx`
- [x] Wrap ReviewForm in Dialog
- [x] Add trigger button prop
- [x] Handle open/close state

### 5.3 Integration Points

- [x] Add to homepage (TestimonialsSection CTA)
- [x] Add to product pages (CategoryReviews CTA)

---

## Phase 6: Google Maps Structure ⚠️ PENDING

### 6.1 API Route

- [ ] Create `app/api/admin/google-reviews/route.ts`
- [ ] Add POST handler structure
- [ ] Add placeholder for Google API call
- [ ] Add Sanity document creation logic

> **Note**: Awaiting Google Maps API credentials

---

## Verification ✅

### Build Checks

- [x] `npx tsc --noEmit` passes
- [x] `pnpm build` passes

### Functional Tests

- [x] Submit review from homepage → appears in admin as pending
- [x] Admin approve → review appears on homepage if featured
- [x] Admin assign category → review appears on category products
