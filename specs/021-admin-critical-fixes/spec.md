# Spec 021 — Admin Dashboard Critical Fixes

> **Date**: 2026-02-16
> **Status**: ✅ Complete
> **Priority**: Before Launch

---

## Goal

Fix admin dashboard issues: logout, sidebar visibility on login page, price display in inventory, confirmation step for price/stock/featured changes, route protection, all UI text in French.

---

## Scope

- A1: Logout — "Se déconnecter" in sidebar, adminLogoutAction
- A2: Sidebar hidden on /admin/login when not authenticated
- A3: Price (priceRetail) column in inventory table
- A4: PriceInput / StockInput / FeaturedToggle — inline "Sauvegarder" or two-step confirmation
- A5: Admin API routes protected by JWT
- All admin-facing strings in French

---

## Done

- [x] adminLogoutAction, sidebar logout button
- [x] Layout: sidebar conditional on route + auth
- [x] ProductRow + table-headers: Prix TND
- [x] PriceInput, StockInput, FeaturedToggle: save confirmation
- [x] All admin components translated to French
- [x] AI Insights prompt in French
