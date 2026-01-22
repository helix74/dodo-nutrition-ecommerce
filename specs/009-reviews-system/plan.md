# Feature 009: Reviews System - Implementation Plan

> **Parent Spec**: [spec.md](./spec.md)  
> **Status**: ✅ Approved  
> **Last Updated**: 2026-01-22

---

## 📋 Overview

This document details the technical implementation plan for the complete Reviews System.

---

## Phase 1: Schema & Foundation

### 1.1 Enhanced Review Schema

**File**: `sanity/schemaTypes/reviewType.ts`

```typescript
// New fields to add:
{
  name: "reviewType",
  type: "string",
  options: {
    list: [
      { title: "Général", value: "general" },
      { title: "Catégorie", value: "category" }
    ]
  },
  initialValue: "general"
},
{
  name: "category",
  title: "Catégorie",
  type: "reference",
  to: [{ type: "category" }],
  description: "Si type = catégorie, avis s'affiche sur les produits de cette catégorie",
  hidden: ({ document }) => document?.reviewType !== "category"
},
{
  name: "source",
  type: "string",
  options: {
    list: [
      { title: "🌐 Site Web", value: "website" },
      { title: "📍 Google Maps", value: "google" }
    ]
  },
  initialValue: "website"
},
{
  name: "googleReviewId",
  type: "string",
  hidden: ({ document }) => document?.source !== "google"
},
{
  name: "featured",
  title: "⭐ En vedette (Homepage)",
  type: "boolean",
  initialValue: false
},
{
  name: "clerkId",
  type: "string",
  description: "ID utilisateur Clerk (si connecté)"
},
{
  name: "order",
  type: "reference",
  to: [{ type: "order" }],
  description: "Commande liée (pour achat vérifié)"
}
```

### 1.2 New Queries File

**File**: `lib/sanity/queries/reviews.ts`

```typescript
// Queries to create:
-FEATURED_REVIEWS_QUERY - // Homepage testimonials
  CATEGORY_REVIEWS_QUERY - // Reviews for a category
  PENDING_REVIEWS_QUERY - // Admin: pending moderation
  ALL_REVIEWS_ADMIN_QUERY - // Admin: all reviews
  REVIEW_STATS_QUERY; // Total count, avg rating
```

---

## Phase 2: Admin Moderation Panel

### 2.1 Reviews Admin Page

**File**: `app/(admin)/admin/reviews/page.tsx`

Features:

- Tab filters: En attente | Approuvés | Google | Rejetés
- Review cards with quick actions
- Bulk approve/reject
- Feature toggle for homepage

### 2.2 Admin Components

**Files**:

- `components/admin/ReviewRow.tsx` - Single review in list
- `components/admin/ReviewActions.tsx` - Action buttons

### 2.3 Server Actions

**File**: `lib/actions/reviews.ts` (enhance)

```typescript
// Actions to add:
-approveReview(id) -
  rejectReview(id) -
  toggleFeatured(id) -
  assignCategory(id, categoryId) -
  deleteReview(id);
```

---

## Phase 3: Homepage Testimonials

### 3.1 Testimonials Component

**File**: `components/home/TestimonialsSection.tsx`

Design:

- Carousel of 4-6 featured reviews
- Mix of Google + website reviews
- Overall rating stats
- "Laisser un avis" CTA button

### 3.2 Homepage Integration

**File**: `app/(app)/page.tsx`

Position: After "Why Us" section, before Footer

---

## Phase 4: Category Reviews on Products

### 4.1 Category Reviews Component

**File**: `components/app/CategoryReviews.tsx`

Features:

- Fetch reviews by category
- Display 3-5 reviews
- "Voir plus" link
- "Laisser un avis" button

### 4.2 Product Page Integration

**File**: `app/(app)/products/[slug]/page.tsx`

Position: After ProductAccordion, before RelatedProducts

---

## Phase 5: Review Form (Multi-location)

### 5.1 Review Form Component

**File**: `components/app/ReviewForm.tsx`

Features:

- Star rating input
- Author name
- Comment textarea
- Optional category selector
- Submit with pending status

### 5.2 Review Form Dialog

**File**: `components/app/ReviewFormDialog.tsx`

Modal version for use in:

- Homepage CTA
- Checkout success page
- Product pages

### 5.3 Integration Points

| Location         | Trigger                  | Context                |
| ---------------- | ------------------------ | ---------------------- |
| Homepage         | "Laisser un avis" button | General review         |
| Checkout Success | "Donnez votre avis" CTA  | General + product hint |
| Product Page     | "Laisser un avis" button | Category pre-selected  |
| Footer           | Link                     | General review         |

---

## Phase 6: Google Maps Structure

### 6.1 API Route (Structure Only)

**File**: `app/api/admin/google-reviews/route.ts`

```typescript
// POST: Import reviews from Google
// - Accept placeId
// - Fetch from Google Places API
// - Create review documents in Sanity
// - Mark source as "google"

// Note: Will be non-functional until credentials provided
```

### 6.2 Admin Import UI

**File**: `app/(admin)/admin/reviews/import/page.tsx`

Features:

- Place ID input
- Fetch preview
- Select reviews to import
- Import button

---

## 🛠️ Technical Details

### Dependencies

No new packages needed. Using:

- `sanity` - Document mutations
- `@clerk/nextjs` - User auth
- `shadcn/ui` - UI components

### Type Regeneration

After schema changes:

```bash
pnpm typegen
```

### Dark Theme Compliance

All components must use:

- `bg-card`, `bg-background`
- `text-foreground`, `text-muted-foreground`
- `border-border`
- `bg-dodo-yellow` for CTAs

---

## 📅 Implementation Order

| #   | Phase                 | Time      | Depends On |
| --- | --------------------- | --------- | ---------- |
| 1   | Schema & Types        | 30 min    | -          |
| 2   | Admin Panel           | 1.5 hours | Phase 1    |
| 3   | Homepage Testimonials | 45 min    | Phase 1    |
| 4   | Category Reviews      | 45 min    | Phase 1    |
| 5   | Review Form           | 45 min    | Phase 1    |
| 6   | Google Structure      | 30 min    | Phase 2    |

**Total**: ~4-5 hours

---

## ✅ Verification Checkpoints

After each phase:

- [ ] `npx tsc --noEmit` passes
- [ ] `pnpm build` passes
- [ ] Component renders correctly
- [ ] Dark theme looks good
