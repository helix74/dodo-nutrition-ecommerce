# Dodo Nutrition - Issues & Backlog

> **Created**: 2026-01-22
> **Last Updated**: 2026-02-12
> **Status**: Active Tracking Document

---

## 🔴 Critical Issues

| #   | Issue                         | Location            | Status          |
| --- | ----------------------------- | ------------------- | --------------- |
| C1  | Checkout success page empty   | `/checkout/success` | ✅ Fixed        |
| C2  | Search button broken          | Header              | ✅ Fixed        |
| C3  | Admin AI Insights not working | `/admin`            | ✅ Fixed (Groq) |

---

## 🟠 UI/UX Issues

| #   | Issue                              | Status   |
| --- | ---------------------------------- | -------- |
| U1  | Text not displayed correctly       | ✅ Fixed |
| U2  | Product images need transparent bg | ✅ Fixed |
| U3  | Hero section box colors incorrect  | ✅ Fixed |
| U4  | Promotion link removed from header | ✅ Fixed |
| U5  | Review form spacing                | ✅ Fixed |

---

## 🟡 Features

| #   | Feature                        | Status         |
| --- | ------------------------------ | -------------- |
| F1  | Mega menu for categories       | ✅ Complete    |
| F2  | Wishlist                       | ✅ Complete    |
| F3  | Email notifications            | ✅ Complete    |
| F4  | Dedicated Category Pages (SEO) | ⬜ Not Started |

---

## 🔵 Enhancements (I-Series)

| #   | Enhancement                        | Status                  |
| --- | ---------------------------------- | ----------------------- |
| I1  | Social Login (Facebook/TikTok)     | ✅ Ready (Clerk Config) |
| I2  | Guest Checkout                     | ✅ Complete             |
| I3  | Tunisian Darija Translations       | ⚠️ Needs Revision       |
| I4  | Static Pages (FAQ, Livraison, CGV) | ✅ Complete             |
| I5  | UI Design Audit                    | ✅ Complete             |

---

## 🟢 Specs Status Summary

| Spec | Feature             | Status      |
| ---- | ------------------- | ----------- |
| 001  | Retrofit            | ✅ Complete |
| 002  | Product Schema      | ✅ Complete |
| 003  | Product Page        | ✅ Complete |
| 004  | COD Checkout        | ✅ Complete |
| 005  | CMS Banners         | ✅ Complete |
| 006  | Admin Dashboard     | ✅ Complete |
| 006a | Admin Analytics     | ✅ Complete |
| 006b | Admin AI Insights   | ✅ Complete |
| 006c | Admin Orders        | ✅ Complete |
| 006d | Admin Inventory     | ✅ Complete |
| 007  | UI Unification      | ✅ Complete |
| 008  | Packs/Bundles       | ✅ Complete |
| 009  | Reviews System      | ✅ 98% Done |
| 010  | Wishlist            | ✅ Complete |
| 011  | Email Notifications | ✅ Complete |
| 012  | Enhancements        | ✅ Complete |
| 013  | UI Design Audit     | ✅ Complete |
| 014  | Mega Menu           | ✅ Complete |

---

## 🐛 Bugs

| #   | Issue                            | Status                              |
| --- | -------------------------------- | ----------------------------------- |
| B1  | Middleware vs Proxy naming issue | ✅ Fixed (renamed to middleware.ts) |

> **B1 Details**: Next.js requires `middleware.ts` naming convention. Project was using `proxy.ts`. Fixed during security audit 2026-02-12.

---

## 📝 Notes

- **Reviews feature**: ✅ Full moderation, testimonials, category reviews
- **Packs/Bundles**: ✅ Full implementation with cart integration
- **Google Maps API**: Structure ready, waiting for credentials
- **AI Features**: ✅ Working with Groq API
- **F4 Details**: Create `/categories/[slug]` pages for better SEO (future enhancement)

---

_Last Updated: 2026-01-31_
