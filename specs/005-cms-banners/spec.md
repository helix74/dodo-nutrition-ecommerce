# Feature 005: CMS-Managed Promo Banners

> **Status**: ✅ Complete  
> **Date**: 2026-01-18

---

## Overview

Implement a banner system managed from Sanity Studio CMS, allowing admin to add, remove, and schedule promotional banners for the homepage without code changes.

---

## Requirements

### Functional

- [x] Banners managed from Sanity Studio
- [x] Image upload with hotspot support
- [x] Optional link destination
- [x] Active/inactive toggle
- [x] Display order control
- [x] Optional date scheduling (start/end)

### UI/UX

- [x] Full-width display (edge to edge)
- [x] Auto-advance (5 seconds)
- [x] Timer resets on manual navigation
- [x] Navigation arrows + dots
- [x] Smooth transitions

---

## Technical Implementation

### Schema: `bannerType.ts`

| Field     | Type     | Required | Description         |
| --------- | -------- | -------- | ------------------- |
| title     | string   | ✅       | Internal identifier |
| image     | image    | ✅       | Banner image        |
| alt       | string   | ❌       | SEO/accessibility   |
| link      | string   | ❌       | Click destination   |
| isActive  | boolean  | ✅       | Visibility toggle   |
| order     | number   | ✅       | Display order       |
| startDate | datetime | ❌       | Scheduled start     |
| endDate   | datetime | ❌       | Scheduled end       |

### Query: `ACTIVE_BANNERS_QUERY`

- Filters: `isActive == true`
- Date range filtering
- Sorted by `order asc`

### Component: `BannerSection.tsx`

- Uses `useRef` for timer management
- Resets timer on manual navigation
- Full-width display
- Aspect ratio: 2.5:1 (mobile) / 3:1 (desktop)

---

## Files Created/Modified

| File                                | Action   |
| ----------------------------------- | -------- |
| `sanity/schemaTypes/bannerType.ts`  | Created  |
| `sanity/schemaTypes/index.ts`       | Modified |
| `lib/sanity/queries/banners.ts`     | Created  |
| `components/home/BannerSection.tsx` | Created  |
| `app/(app)/page.tsx`                | Modified |

---

## Usage

1. Go to `/studio`
2. Create new "Banner" document
3. Upload image, set title, toggle active
4. Save → appears on homepage
