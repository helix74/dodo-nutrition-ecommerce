# Dodo Nutrition - Issues & Backlog

> **Created**: 2026-01-22  
> **Status**: Active Tracking Document

---

## 🔴 Critical Issues (Breaking Functionality)

| #   | Issue                                                          | Location            | Priority    |
| --- | -------------------------------------------------------------- | ------------------- | ----------- |
| C1  | Checkout success page not showing (displays "panier est vide") | `/checkout/success` | 🔴 Critical |
| C2  | Search button in header doesn't work                           | Header              | 🔴 Critical |
| C3  | Admin AI Insights hidden/not working                           | `/admin`            | 🔴 Critical |

---

## 🟠 UI/UX Issues (Theme Standardization)

| #   | Issue                                                                    | Location          | Priority  |
| --- | ------------------------------------------------------------------------ | ----------------- | --------- |
| U1  | Text not displayed correctly (fonts/colors)                              | Various pages     | 🟠 High   |
| U2  | Product images need transparent backgrounds                              | Product images    | 🟠 High   |
| U3  | Hero section box colors incorrect                                        | Homepage hero     | 🟠 High   |
| U4  | Promotion link removed from header (was replaced by Packs, needs review) | Header            | 🟠 High   |
| U5  | Review form spacing (title and field gap)                                | ReviewForm dialog | 🟡 Medium |

---

## 🟡 Features to Add

| #   | Feature                             | Status         | Priority  |
| --- | ----------------------------------- | -------------- | --------- |
| F1  | Mega menu for categories in header  | ⬜ Not Started | 🟡 Medium |
| F2  | Wishlist                            | ⬜ Not Started | 🟡 Medium |
| F3  | Email notifications                 | ⬜ Not Started | 🟡 Medium |
| F4  | AI Assistant for users verification | ⬜ Needs Check | 🟡 Medium |
| F5  | Admin analytics features            | ⬜ Needs Check | 🟡 Medium |

---

## 🔵 Configuration & Setup

| #   | Item                                | Status                | Priority  |
| --- | ----------------------------------- | --------------------- | --------- |
| S1  | App SDK env linking (Sanity Studio) | ⬜ Needs Verification | 🟠 High   |
| S2  | Vercel deployment preparation       | ⬜ Not Started        | 🟡 Medium |
| S3  | CSV examples for data import        | ⬜ Not Created        | 🟡 Medium |

---

## 🟣 Audit & Security (Phase 5)

| #   | Item                             | Status         | Priority   |
| --- | -------------------------------- | -------------- | ---------- |
| A1  | Security audit                   | ⬜ Not Started | 🟡 Planned |
| A2  | Performance optimization         | ⬜ Not Started | 🟡 Planned |
| A3  | Spam protection (reviews, forms) | ⬜ Not Started | 🟡 Planned |
| A4  | Codebase cleanup                 | ⬜ Not Started | 🟡 Planned |

---

## 📝 Notes

- Reviews feature: ✅ **APPROVED** and working
- Google Maps API: Structure ready, waiting for credentials
- User will provide detailed list of additional issues

---

## 🤔 Decision: Next Steps?

**Option A**: Fix critical issues first (C1-C3), then continue features  
**Option B**: Continue features (Wishlist, Email), big fix session later  
**Option C**: Do a complete UI/UX pass to fix all theme issues first

---

_Last Updated: 2026-01-22 02:05_
