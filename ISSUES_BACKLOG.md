# Dodo Nutrition - Issues & Backlog

> **Created**: 2026-01-22  
> **Last Updated**: 2026-01-25  
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

## 🐛 Bugs

| #   | Issue                            | Status         |
| --- | -------------------------------- | -------------- |
| B1  | Middleware vs Proxy naming issue | ⏳ Investigate |

> **B1 Details**: Next.js shows deprecation warning "middleware file convention is deprecated. Please use proxy instead." Project currently uses `proxy.ts`. Need to investigate if renaming causes routing issues.

---

## 📝 Notes

- **Reviews feature**: ✅ Approved and working
- **Google Maps API**: Structure ready, waiting for credentials
- **AI Features**: Blocked until API key is provided
- **F4 Details**: Create `/categories/[slug]` pages for better SEO (currently uses `/shop?category=slug`)

---

_Last Updated: 2026-01-25_
