# Dodo Nutrition - Issues & Backlog

> **Created**: 2026-01-22  
> **Status**: Active Tracking Document

---

## 🔴 Critical Issues (Breaking Functionality)

| #   | Issue                                                          | Location            | Priority    | Status     |
| --- | -------------------------------------------------------------- | ------------------- | ----------- | ---------- |
| C1  | Checkout success page not showing (displays "panier est vide") | `/checkout/success` | 🔴 Critical | ✅ Fixed   |
| C2  | Search button in header doesn't work                           | Header              | 🔴 Critical | ✅ Fixed   |
| C3  | Admin AI Insights hidden/not working                           | `/admin`            | 🔴 Critical | ⏳ Pending |

---

## 🟠 UI/UX Issues (Theme Standardization)

| #   | Issue                                                                    | Location          | Priority  | Status   |
| --- | ------------------------------------------------------------------------ | ----------------- | --------- | -------- |
| U1  | Text not displayed correctly (fonts/colors)                              | Various pages     | 🟠 High   | ✅ Fixed |
| U2  | Product images need transparent backgrounds                              | Product images    | 🟠 High   | ✅ Fixed |
| U3  | Hero section box colors incorrect                                        | Homepage hero     | 🟠 High   | ✅ Fixed |
| U4  | Promotion link removed from header (was replaced by Packs, needs review) | Header            | 🟠 High   | ✅ Fixed |
| U5  | Review form spacing (title and field gap)                                | ReviewForm dialog | 🟡 Medium | ✅ Fixed |

---

## 🟡 Features to Add

| #   | Feature                            | Status         | Priority  |
| --- | ---------------------------------- | -------------- | --------- |
| F1  | Mega menu for categories in header | ⬜ Not Started | 🟡 Medium |
| F2  | Wishlist                           | ✅ Complete    | 🟡 Medium |
| F3  | Email notifications                | ✅ Complete    | 🟡 Medium |

- Reviews feature: ✅ **APPROVED** and working
- Google Maps API: Structure ready, waiting for credentials

---

## 🐛 Bugs (Reported 2026-01-22)

| #   | Issue                                                         | Location             | Priority    | Status     |
| --- | ------------------------------------------------------------- | -------------------- | ----------- | ---------- |
| B1  | Wishlist items disappear on refresh (Persistence issue)       | `/wishlist`          | 🔴 Critical | ✅ Fixed   |
| B2  | `useCartStore` error: "must be used within CartStoreProvider" | `PackCard`           | 🔴 Critical | ✅ Fixed   |
| B3  | Button text becomes invisible (black on black) on hover       | Various (Home, Shop) | 🟠 High     | ✅ Fixed   |
| B4  | Promotions page returns 404                                   | `/promotions`        | 🟠 High     | ✅ Fixed   |
| B5  | Newsletter subscription not sending emails                    | Footer               | 🟡 Medium   | ⏳ Pending |

---

## 💡 Improvements & Feature Requests

| #   | Item                                              | Type    | Priority  |
| --- | ------------------------------------------------- | ------- | --------- |
| I1  | Add Facebook & TikTok login to Clerk              | Auth    | 🟡 Medium |
| I2  | Verify/Enable Guest Checkout (Optional Login)     | Auth    | 🟠 High   |
| I3  | Translate headers/titles to Tunisian Darija       | Content | 🟡 Low    |
| I4  | Create static pages (FAQ, Livraison, CGV)         | Content | 🟡 Medium |
| I5  | UI Design Audit (Improve creativity/premium feel) | Design  | 🟡 Medium |

---

## 🤔 Decision: Next Steps?

**Option A**: Fix critical issues first (C1-C3), then continue features  
**Option B**: Continue features (Wishlist, Email), big fix session later  
**Option C**: Do a complete UI/UX pass to fix all theme issues first

---

_Last Updated: 2026-01-22 02:05_
