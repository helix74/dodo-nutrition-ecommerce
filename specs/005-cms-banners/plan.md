# Implementation Plan: CMS-Managed Banners

> **Feature**: 005-cms-banners  
> **Date**: 2026-01-18

---

## Proposed Changes

### Sanity Schema

#### [NEW] bannerType.ts

Create banner document type with fields for image, link, scheduling, and ordering.

---

### GROQ Queries

#### [NEW] banners.ts

Query to fetch active banners with date filtering and ordering.

---

### Components

#### [NEW] BannerSection.tsx

Full-width banner carousel with:

- Auto-advance (5s)
- Timer reset on manual navigation
- Navigation arrows and dots

---

### Pages

#### [MODIFY] page.tsx

Add banner fetch and render BannerSection after CategoryShowcase.

---

## Verification Plan

### Manual Verification

1. Create banner in Sanity Studio
2. Verify display on homepage
3. Test navigation and auto-advance
4. Test timer reset on manual click
