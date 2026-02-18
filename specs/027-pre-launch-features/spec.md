# Spec 027 — Pre-Launch Features

> **Date**: 2026-02-16
> **Status**: ✅ Complete
> **Priority**: Before Launch

---

## Goal

Packs page UX (sort, filter, layout), upsell/cross-sell in cart, subtle Framer Motion on homepage.

---

## Scope

- Packs: sorting (price, savings), filter by type, layout aligned with shop
- RelatedProducts title → "Vous aimerez aussi"
- CartUpsell: suggestions from cart categories, quick-add in CartSheet
- Framer Motion: FadeIn, SlideUp on homepage sections (motion.tsx)

---

## Done

- [x] PacksClient: sort, filter; packs page layout
- [x] RelatedProducts title
- [x] /api/cart-upsell, CartUpsell.tsx, CartSheet integration
- [x] motion.tsx, homepage sections wrapped
