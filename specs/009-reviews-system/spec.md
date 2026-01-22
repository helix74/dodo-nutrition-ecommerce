# Feature 009: Complete Reviews System

> **Status**: 📋 Planning  
> **Priority**: 🔴 High  
> **Estimated Time**: 4-6 hours  
> **Created**: 2026-01-22

---

## 🎯 Vision

Create a **complete reviews system** for Dodo Nutrition that:

1. Shows testimonials on the homepage (social proof)
2. Displays category-based reviews on product pages
3. Allows easy review submission from multiple touchpoints
4. Enables admin curation and moderation
5. Supports future Google Maps API integration

---

## 📊 Current State

### What Exists

| Component                 | Location                            | Status   |
| ------------------------- | ----------------------------------- | -------- |
| Basic schema              | `sanity/schemaTypes/reviewType.ts`  | ✅ Works |
| Submit action             | `lib/actions/reviews.ts`            | ✅ Works |
| Product reviews component | `components/app/ProductReviews.tsx` | ✅ Works |
| GROQ queries              | `lib/sanity/queries/products.ts`    | ✅ Works |

### What's Missing

| Gap                             | Priority    |
| ------------------------------- | ----------- |
| Admin moderation panel          | 🔴 Critical |
| Homepage testimonials section   | 🔴 Critical |
| Category-based review display   | 🟠 High     |
| Review form on checkout success | 🟠 High     |
| Google Maps API structure       | 🟡 Medium   |
| Verified purchase logic         | 🟡 Medium   |

---

## 🚀 Final Goal

### Homepage Testimonials

```
┌─────────────────────────────────────────────────────────────┐
│            ⭐ Ce Que Disent Nos Clients ⭐                  │
│                                                             │
│    ┌───────────┐  ┌───────────┐  ┌───────────┐             │
│    │ ⭐⭐⭐⭐⭐   │  │ ⭐⭐⭐⭐⭐   │  │ ⭐⭐⭐⭐⭐   │             │
│    │           │  │           │  │           │             │
│    │ "Service  │  │ "Livraison│  │ "Produits │             │
│    │  top!"    │  │  rapide"  │  │  top"     │             │
│    │           │  │           │  │           │             │
│    │ - Ahmed   │  │ - Sami    │  │ - Karim   │             │
│    │ 📍 Google │  │ ✓ Client  │  │ 📍 Google │             │
│    └───────────┘  └───────────┘  └───────────┘             │
│                                                             │
│         4.8/5 ⭐ basé sur 150+ avis                         │
│                                                             │
│              [ Laisser un avis ]                            │
└─────────────────────────────────────────────────────────────┘
```

### Category Reviews on Products

```
Product: "Créatine Monohydrate 500g" (Category: Créatine)

┌─────────────────────────────────────────────────────────────┐
│              💬 Avis sur la Créatine                        │
│                                                             │
│  ⭐⭐⭐⭐⭐ "La créatine de Dodo est top!"                     │
│  - Karim M.                                                 │
│                                                             │
│  [ Laisser un avis ]                                        │
└─────────────────────────────────────────────────────────────┘
```

### Admin Moderation Panel

```
┌─────────────────────────────────────────────────────────────┐
│  📋 Gestion des Avis                    /admin/reviews      │
│                                                             │
│  [En attente (5)] [Approuvés] [Google] [Rejetés]           │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ ⭐⭐⭐⭐⭐  Ahmed  |  Créatine  |  ⏳ En attente          ││
│  │ "Produits de qualité, je recommande"                    ││
│  │ [✅ Approuver] [⭐ Featured] [❌ Rejeter]                ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## 🧩 Sub-Features

| ID       | Feature                      | Priority    | Status         |
| -------- | ---------------------------- | ----------- | -------------- |
| **009a** | Schema & Types               | 🔴 Critical | ⬜ Not Started |
| **009b** | Admin Moderation             | 🔴 Critical | ⬜ Not Started |
| **009c** | Homepage Testimonials        | 🔴 Critical | ⬜ Not Started |
| **009d** | Category Reviews             | 🟠 High     | ⬜ Not Started |
| **009e** | Review Form (Multi-location) | 🟠 High     | ⬜ Not Started |
| **009f** | Google Maps Structure        | 🟡 Medium   | ⬜ Not Started |

---

## 📁 File Structure

```
specs/009-reviews-system/
├── spec.md                    # This file (parent)
├── plan.md                    # Overall implementation plan
├── task.md                    # Master task list
└── verify.md                  # Verification checklist

New/Modified Files:
├── sanity/schemaTypes/reviewType.ts      # Enhanced schema
├── lib/sanity/queries/reviews.ts         # Dedicated queries
├── lib/actions/reviews.ts                # Enhanced actions
├── app/(admin)/admin/reviews/page.tsx    # Admin panel
├── components/admin/ReviewRow.tsx        # Admin review item
├── components/home/TestimonialsSection.tsx
├── components/app/CategoryReviews.tsx
├── components/app/ReviewForm.tsx
├── components/app/ReviewFormDialog.tsx   # Modal version
└── app/(app)/checkout/success/page.tsx   # Add review CTA
```

---

## ✅ Success Criteria

- [ ] Admin can approve/reject reviews
- [ ] Homepage shows curated testimonials
- [ ] Product pages show category reviews
- [ ] Review form accessible from 3+ locations
- [ ] Google Maps import structure ready
- [ ] `pnpm build` passes
- [ ] `npx tsc --noEmit` passes

---

## 🔗 Dependencies

- **Sanity v4**: Document store
- **Clerk**: User authentication (for verified purchase)
- **shadcn/ui**: UI components
- **Constitution**: Dark theme, Dodo colors

---

## 📝 Notes

- Reviews are **category-based**, not per-product (simpler to manage)
- Google Maps API credentials not available yet (structure only)
- Arabic/Darija CTAs: "شنوا قالوا عليّا" for testimonials section
