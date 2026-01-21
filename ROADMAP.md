# Project Roadmap: Dodo Nutrition

> **Last Updated**: 2026-01-17  
> **Status**: Pre-Production

---

## 🟢 Current Status

| Area            | Status         | Notes                                       |
| --------------- | -------------- | ------------------------------------------- |
| Product Catalog | ✅ Complete    | 120+ products                               |
| Shopping Cart   | ✅ Complete    | Zustand + localStorage                      |
| Checkout        | ⚠️ In Progress | **COD needed** (Stripe exists but not used) |
| Orders          | ✅ Complete    | Sanity-based                                |
| Auth            | ✅ Complete    | Clerk                                       |
| AI Assistant    | ✅ Complete    | Claude-powered                              |
| Reviews         | ✅ Basic       | Needs enhancements                          |
| Admin           | ⚠️ Basic       | Needs improvements                          |

---

## ✅ Completed Features

| ID  | Feature               | Date       | Description             |
| --- | --------------------- | ---------- | ----------------------- |
| 001 | Project Retrofit      | 2026-01-14 | Spec-Kit installed      |
| 002 | Product Schema        | 2026-01-14 | 7 groups, Portable Text |
| 003 | Product Page Redesign | 2026-01-15 | Accordion + Reviews     |

---

## 📋 Phase 0: Immediate Fixes

> **Priority**: 🔴 Critical | **Time**: 1-2 hours

| ID  | Task                            | Status         |
| --- | ------------------------------- | -------------- |
| 0.1 | Fix GBP → TND in `orderType.ts` | ✅ Complete    |
| 0.2 | Clean up documentation          | ✅ In Progress |
| 007 | UI Unification (Dark Theme)     | ✅ Complete    |

---

## 📋 Phase 1: COD Checkout

> **Priority**: 🔴 Critical | **Time**: 1-2 days

| ID  | Task                                   | Status      |
| --- | -------------------------------------- | ----------- |
| 1.1 | Create COD checkout flow (form-based)  | ✅ Complete |
| 1.2 | Add `paymentMethod` field to orderType | ✅ Complete |
| 1.3 | Tunisia-focused address form           | ✅ Complete |
| 1.4 | Order confirmation page                | ✅ Complete |
| 1.5 | Stock decrement on order               | ✅ Complete |

---

## 📋 Phase 2: Post-COD

> **Priority**: 🟠 High | **Time**: 1-2 days

| ID  | Task                                | Status         |
| --- | ----------------------------------- | -------------- |
| 2.1 | Ciblex API integration              | ⬜ Not Started |
| 2.2 | Tracking number in orders           | ⬜ Not Started |
| 2.3 | Stock validation (prevent negative) | ⬜ Not Started |
| 2.4 | Proxy → Middleware fix              | ⬜ Not Started |

---

## 📋 Phase 3: Admin Improvements

> **Priority**: 🟠 High | **Time**: 2-3 days

| ID  | Task                   | Status         |
| --- | ---------------------- | -------------- |
| 3.1 | Order management panel | ✅ UI Complete |
| 3.2 | Inventory management   | ✅ UI Complete |
| 3.3 | Analytics dashboard    | ✅ UI Complete |
| 3.4 | Review moderation      | ⬜ Not Started |

---

## 📋 Phase 4: Advanced Features

> **Priority**: 🟡 Medium | **Time**: Ongoing

| ID  | Task                       | Status    |
| --- | -------------------------- | --------- |
| 4.1 | Reviews: Verified purchase | ⬜ Future |
| 4.2 | Reviews: Google API import | ⬜ Future |
| 4.3 | Reviews: Brand/Experience  | ⬜ Future |
| 4.4 | Reviews: Spam protection   | ⬜ Future |
| 4.5 | Pack/Bundle system         | ⬜ Future |
| 4.6 | Wishlist                   | ⬜ Future |
| 4.7 | Email notifications        | ⬜ Future |
| 4.8 | Multi-language             | ⬜ Future |

---

## 🎯 Next Action

Run `/speckit.specify` for **Phase 0.1: Currency Fix** or proceed directly to fix.
