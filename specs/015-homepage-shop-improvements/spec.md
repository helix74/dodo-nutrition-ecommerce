# Spec 015: Homepage & Shop Improvements

> **Status**: In Progress  
> **Priority**: 🔴 Critical  
> **Impact**: Visual wow factor, better UX

---

## Problem Statement

The current homepage has good sections but lacks:

1. Visual polish and "wow" factor
2. Better section organization
3. Shop page loads ALL products (slow, no pagination)

---

## Goals

1. **Homepage**: Make it visually impressive and well-structured
2. **Shop Page**: Add pagination (24-30 products per page)
3. **Overall**: Premium, modern feel that impresses Dodo

---

## Current State

### Homepage Sections (11 existing)

1. HeroSection ✅
2. TrustBar ✅
3. CategoryShowcase ✅
4. BannerSection ✅
5. FeaturedPacks ✅
6. FeaturedProducts ✅
7. PromoBanner ✅
8. BrandsCarousel ✅
9. WhyUsSection - needs improvement
10. TestimonialsSection ✅
11. NewsletterSection - needs backend

### Shop Page

- Loads all products (no limit)
- Has filters and sorting
- No pagination

---

## Proposed Changes

### 1. Shop Page Pagination

- Add pagination with 24 products per page
- Add total products count
- Add page navigation UI

### 2. Homepage WhyUsSection Upgrade

- Better visual design
- More engaging content
- Icons and animations ready

### 3. General Polish

- Consistent section spacing
- Better loading states

---

## Success Criteria

- [ ] Shop page shows 24 products per page
- [ ] Pagination navigation works
- [ ] WhyUsSection looks professional
- [ ] Build passes without errors
