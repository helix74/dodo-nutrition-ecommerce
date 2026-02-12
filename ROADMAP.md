# Project Roadmap: Dodo Nutrition

> **Last Updated**: 2026-02-12
> **Status**: Ready for Staging Deployment

---

## 🟢 Current Status

| Area            | Status      | Notes                                 |
| --------------- | ----------- | ------------------------------------- |
| Product Catalog | ✅ Complete | 120+ products                         |
| Shopping Cart   | ✅ Complete | Zustand + localStorage                |
| Checkout        | ✅ Complete | COD (Cash on Delivery)                |
| Orders          | ✅ Complete | Sanity-based                          |
| Auth            | ✅ Complete | Clerk                                 |
| AI Assistant    | ✅ Complete | Groq-powered chat + Admin insights    |
| Reviews         | ✅ Complete | Full moderation + testimonials        |
| Packs/Bundles   | ✅ Complete | Full cart integration                 |
| Admin           | ✅ Complete | Dashboard, Orders, Inventory, Reviews |

---

## ✅ Completed Features

| ID  | Feature               | Date       | Description             |
| --- | --------------------- | ---------- | ----------------------- |
| 001 | Project Retrofit      | 2026-01-14 | Spec-Kit installed      |
| 002 | Product Schema        | 2026-01-14 | 7 groups, Portable Text |
| 003 | Product Page Redesign | 2026-01-15 | Accordion + Reviews     |
| 004 | COD Checkout          | 2026-01-17 | Full flow               |
| 005 | CMS Banners           | 2026-01-17 | Hero banners            |
| 006 | Admin Dashboard       | 2026-01-20 | AI insights, analytics  |
| 007 | UI Unification        | 2026-01-21 | Dark theme              |
| 008 | Packs/Bundles         | 2026-01-21 | Bundle pricing          |
| 009 | Reviews System        | 2026-01-22 | Full moderation         |
| 010 | Wishlist              | 2026-01-25 | Zustand persistence     |
| 011 | Email Notifications   | 2026-01-25 | Resend integration      |
| 012 | Enhancements (I1-I4)  | 2026-01-25 | Guest checkout, Darija  |
| 013 | UI Design Audit       | 2026-01-25 | Premium polish          |
| 014 | Mega Menu             | 2026-01-31 | Categories + Brands     |

---

## 📋 Phase 0: Immediate Fixes ✅ DONE

- [x] Fix GBP → TND in `orderType.ts`
- [x] Clean up documentation
- [x] UI Unification (Dark Theme)

---

## 📋 Phase 1: COD Checkout ✅ DONE

- [x] Create COD checkout flow (form-based)
- [x] Add `paymentMethod` field to orderType
- [x] Tunisia-focused address form
- [x] Order confirmation page
- [x] Stock decrement on order

---

## 📋 Phase 2: Post-COD

> **Priority**: 🟠 High | **Time**: 1-2 days

| ID  | Task                                | Status          |
| --- | ----------------------------------- | --------------- |
| 2.1 | Ciblex API integration              | ⬜ Not Started  |
| 2.2 | Tracking number in orders           | ⬜ Not Started  |
| 2.3 | Stock validation (prevent negative) | ⬜ Not Started  |
| 2.4 | Proxy → Middleware fix              | ⬜ Low Priority |

---

## 📋 Phase 3: Admin Improvements ✅ DONE

- [x] Order management panel
- [x] Inventory management
- [x] Analytics dashboard
- [x] Review moderation

---

## 📋 Phase 4: Advanced Features

> **Priority**: 🟡 Medium | **Time**: Ongoing

| ID  | Task                       | Status    |
| --- | -------------------------- | --------- |
| 4.1 | Reviews: Verified purchase | ✅ Done   |
| 4.2 | Reviews: Google API import | ⬜ Future |
| 4.3 | Reviews: Brand/Experience  | ✅ Done   |
| 4.5 | Pack/Bundle system         | ✅ Done   |
| 4.6 | Wishlist                   | ✅ Done   |
| 4.7 | Email notifications        | ✅ Done   |
| 4.8 | Multi-language             | ⬜ Future |

---

## 📋 Phase 5: Future Enhancements

| ID  | Task                         | Status         |
| --- | ---------------------------- | -------------- |
| 5.1 | Dedicated Category SEO Pages | ⬜ Not Started |
| 5.2 | Newsletter Backend           | ⬜ Not Started |
| 5.3 | Ciblex Shipping Integration  | ⬜ Not Started |

---

## 🎯 Next Action

All core MVP features are complete. Security audit completed (2026-02-12). Next priorities:

1. Deploy to Vercel (staging)
2. Manual testing of checkout, admin, and auth flows
3. Register custom email domain with Resend
4. Ciblex shipping integration
5. Category SEO pages
