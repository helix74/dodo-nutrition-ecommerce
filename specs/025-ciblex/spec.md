# Spec 025 — Ciblex Delivery Integration

> **Date**: 2026-02-16
> **Status**: ✅ Complete (awaiting credentials)
> **Priority**: Before Launch

---

## Goal

Integrate Ciblex API: create shipment on order, sync status to Sanity, show tracking in admin. Single livraison type: Ciblex only.

---

## Scope

- lib/shipping/ciblex.ts: typed client (AjouterVColis, getColis, ListColis, listVilles, etc.)
- lib/actions/shipping.ts: createCiblexShipment, store codeBar as trackingNumber
- /api/admin/shipping/sync: batch sync Ciblex status → order status (shipped, delivered, cancelled)
- ShippingStatus component in order detail
- lib/constants/gouvernorats.ts (24 Tunisian gouvernorats)
- Checkout calls createCiblexShipment non-blocking after order creation

---

## Done

- [x] ciblex.ts API client
- [x] shipping.ts server action, checkout integration
- [x] sync route, ShippingStatus component
- [x] gouvernorats list, .env.example CIBLEX_USER/CIBLEX_PASS
