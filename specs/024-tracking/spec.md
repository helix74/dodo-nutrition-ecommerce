# Spec 024 — Tracking Integration (Meta, GA4, CAPI)

> **Date**: 2026-02-16
> **Status**: ✅ Complete (awaiting env vars)
> **Priority**: Before Launch

---

## Goal

Unified tracking: Meta Pixel (client), Meta Conversions API (server), Google Analytics 4. Events: PageView, ViewContent, AddToCart, InitiateCheckout, Purchase.

---

## Scope

- Meta Pixel component, gtag/GA4 component
- lib/tracking/events.ts: trackPageView, trackViewContent, trackAddToCart, trackInitiateCheckout, trackPurchase
- lib/tracking/meta-capi.ts: server-side Purchase, AddToCart
- TrackViewContent on product page
- Checkout + success pages: initiate checkout, purchase
- .env.example: NEXT_PUBLIC_META_PIXEL_ID, NEXT_PUBLIC_GA_MEASUREMENT_ID, META_CAPI_ACCESS_TOKEN

---

## Done

- [x] MetaPixel.tsx, GoogleAnalytics.tsx in layout
- [x] events.ts, meta-capi.ts
- [x] TrackViewContent, AddToCartButton, CheckoutClient, CODSuccessClient, SuccessClient, checkout action
- [x] .env.example updated
