# Spec 020 — Frontend Polish & Small Fixes

> **Date**: 2026-02-16
> **Status**: ✅ Complete
> **Priority**: Before Launch

---

## Goal

Final UI/UX polish: CTA button sizes, hero image display, trust badges alignment, product card consistency, product page layout, dark background for transparent images, universal "Ajouter au panier" → "زيدو للقضيّة", checkout success translations.

---

## Scope

- Hero section: CTA position lower, image full on mobile/desktop, trust badges left-aligned when wrapped
- Buttons: larger CTAs (h-12, text-base) site-wide; secondary/outline hover text visible
- Product: gallery max-height on desktop so CTAs visible without scroll; ProductGallery dark background for WebP
- Copy: "Ajouter au panier" → "زيدو للقضيّة"; checkout success page French
- Sanity: hero headline optional

---

## Done

- [x] CTA sizes increased
- [x] Hero optional headline, image object-fit/contain
- [x] Trust badges grid alignment mobile
- [x] Product page sticky gallery, dark bg for images
- [x] AddToCart label, success page FR
- [x] next.config turbopack.root fix (404 fix)
