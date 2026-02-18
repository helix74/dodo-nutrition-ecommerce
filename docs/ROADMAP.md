# 🗺️ ROADMAP — Dodo Nutrition

> **Last Updated**: 2026-02-16
> **Status**: Pre-Launch — Feature Complete, Awaiting User Data & Credentials
> **Version**: 1.4.0

---

## Table of Contents

1. [Current Status](#-current-status)
2. [User Action Required](#-user-action-required)
3. [Before Launch](#-before-launch)
4. [Post Launch](#-post-launch)
5. [Admin Dashboard Vision](#-admin-dashboard-vision)
6. [Strategic Decisions](#-strategic-decisions)
7. [Cost & Infrastructure](#-cost--infrastructure)
8. [Completed Features](#-completed-features)

---

## 📊 Current Status

| Area                  | Status        | Notes                                                    |
| --------------------- | ------------- | -------------------------------------------------------- |
| **Storefront**        | ✅ Live       | Products, cart, checkout, reviews, wishlist, upsell      |
| **Admin Dashboard**   | ✅ Live       | JWT auth, analytics, charts, KPIs, suppliers, invoices   |
| **Sanity Studio**     | ✅ Live       | Content editing at `/studio` (11 schema types)           |
| **Deployment**        | ✅ Vercel     | Auto-deploy on push to `main`                            |
| **Auth (Storefront)** | ✅ Clerk      | Sign-up/login/social                                     |
| **Auth (Admin)**      | ✅ Custom JWT | Username/password via env vars                           |
| **AI**                | ✅ Groq       | Chat assistant + admin insights                          |
| **Emails**            | ✅ Resend     | Order confirmation (`@resend.dev`)                       |
| **SEO**               | ✅ Done       | JSON-LD, sitemap.xml, meta tags, Open Graph              |
| **Tracking**          | ⏳ Ready      | GA4 + Meta Pixel + CAPI — awaiting env vars              |
| **Shipping**          | ⏳ Ready      | Ciblex integration built — awaiting API credentials      |

---

## ⚠️ User Action Required

> **These items need manual input from the project owner before launch.**

| # | Item | Action | Where |
|---|------|--------|-------|
| 1 | **Product prices & stock** | Update real prices, stock levels, featured flags | `data/products-database.csv` → re-import |
| 2 | **Product images** | Upload product images | Sanity Studio (`/studio`) |
| 3 | **Pack data** | Provide pack CSV | Based on `data/template-packs.csv` |
| 4 | **Tracking env vars** | Set `GA_MEASUREMENT_ID`, `META_PIXEL_ID`, `META_ACCESS_TOKEN` | `.env.local` |
| 5 | **Ciblex credentials** | Set `CIBLEX_USER`, `CIBLEX_PASS` | `.env.local` |
| 6 | **Custom email domain** | Verify `@dodonutrition.tn` with Resend | Resend dashboard |
| 7 | **Domain name** | Point `dodonutrition.tn` to Vercel | DNS + Vercel dashboard |

---

## 🔴 Before Launch

> **Priority**: Everything here MUST be done before going live. All **code** is complete — remaining items are user data and credentials.

### 1. Homepage Redesign — ✅ COMPLETE

**Spec 017a–g + 019 + 020**

All 9 sections implemented and polished: Hero, Goal Navigator, Featured Products, Banner, Featured Packs, Category Showcase, Testimonials, Brands Marquee, Final CTA. Framer Motion animations added (Spec 020).

---

### 2. Dataset Cleanup — ✅ COMPLETE

**Spec 018**

119 products imported, 10 categories, 21 brands. Clean IDs, 0 broken refs. Awaiting user action for real prices/stock/images.

---

### 3. Site Revision & Bug Fixes — ✅ 95% COMPLETE

**Spec 019 + 020**

- [x] Fixed broken routes (`/brands/[slug]`, `/categories/[slug]`)
- [x] Fixed button hover states, translated UI to French
- [x] Fixed mobile menu, trust badges, checkout, order emails
- [x] CTA buttons resized, Framer Motion animations added
- [ ] Search UX improvement (persistent search bar — post-launch)
- [ ] Infinite scroll pagination on shop page (post-launch)

---

### 4. Admin Dashboard Critical Fixes — ✅ COMPLETE

**Spec 021**

All 5 issues (A1–A5) resolved: logout button, sidebar hidden on login, prices visible, save confirmation, admin route protection.

---

### 5. Admin Analytics & BI — ✅ COMPLETE

**Spec 022**

- Revenue chart (30-day trend), Order status distribution chart, Orders by gouvernorat chart
- Enhanced KPIs: avg order value, low stock count, top category, cancelled order rate
- Charts section on admin dashboard with parallel data fetching

---

### 6. Admin Pre-ERP MVP — ✅ COMPLETE

**Spec 023**

- Supplier management (`/admin/suppliers`) — Sanity schema + admin page
- Invoice management (`/admin/invoices`) — Sanity schema + admin page
- Low stock dashboard widget with direct links to products
- GROQ queries for suppliers and invoices

---

### 7. Tracking Integration — ✅ COMPLETE (awaiting env vars)

**Spec 024**

- Google Analytics 4 (`components/tracking/GoogleAnalytics.tsx`)
- Meta Pixel + Conversions API (`components/tracking/MetaPixel.tsx`, `lib/tracking/meta-capi.ts`)
- Unified event system (`lib/tracking/events.ts`) — ViewContent, AddToCart, Purchase
- `TrackViewContent` component for product pages
- **Needs**: `GA_MEASUREMENT_ID`, `META_PIXEL_ID`, `META_ACCESS_TOKEN` in `.env.local`

---

### 8. Ciblex Delivery Integration — ✅ COMPLETE (awaiting credentials)

**Spec 025**

- Ciblex API client (`lib/shipping/ciblex.ts`) — create/track shipments
- Gouvernorat-based zone pricing (`lib/shipping/gouvernorats.ts`)
- Shipping server actions (`lib/actions/shipping.ts`)
- Admin shipping sync API (`/api/admin/shipping/sync`)
- `ShippingStatus` component for admin order details
- **Needs**: `CIBLEX_USER`, `CIBLEX_PASS` in `.env.local`

---

### 9. SEO & Discovery — ✅ COMPLETE

**Spec 026**

- JSON-LD structured data (Product, Organization, BreadcrumbList) via `components/seo/JsonLd.tsx`
- Dynamic `sitemap.xml` (`app/sitemap.ts`) — products, categories, brands
- Open Graph + Twitter Card meta tags on all pages
- Dynamic meta titles/descriptions per product, category, brand

---

### 10. Pre-Launch Features — ✅ COMPLETE

**Spec 027**

- Cart upsell/cross-sell (`components/app/CartUpsell.tsx` + `/api/cart-upsell`)
- Packs client with filtering and sorting (`components/app/PacksClient.tsx`)
- Brand/category slug pages (`/brands/[slug]`, `/categories/[slug]`)
- Framer Motion animation components (`components/ui/motion.tsx`)

---

### 11. Testing Infrastructure — ✅ COMPLETE

**Spec 028**

- Testing patterns and infrastructure established
- Component validation ready for CI pipeline

---

## 🟢 Post Launch

> **Priority**: Après le changement de domaine et le lancement officiel.
> Items previously planned for pre-launch SEO, tracking, shipping, and upsell are now **DONE** (see completed features above).

### Phase 1: Revenue & Growth (Semaine 1-2 Post-Launch)

| #   | Task                                            | Effort | Impact                | Status   |
| --- | ----------------------------------------------- | ------ | --------------------- | -------- |
| 1   | Newsletter backend (Resend Audiences)           | 1-2h   | Communication clients | Planned  |
| 2   | Custom email domain (`@dodonutrition.tn`)       | 30min  | Emails pas en spam    | User action |
| 3   | TikTok Pixel integration                        | 1-2h   | Ads tracking          | Planned  |
| 4   | Search UX (persistent search bar)               | 4-6h   | UX improvement        | Planned  |
| 5   | Infinite scroll pagination                      | 2-3h   | Shop UX               | Planned  |

### Phase 2: Operations & Payments (Mois 1-2)

| #   | Task                                                      | Effort       | Impact              |
| --- | --------------------------------------------------------- | ------------ | ------------------- |
| 1   | Online payment (Flouci / Konnect / Click to Pay)          | 1 semaine    | Revenue online      |
| 2   | Local delivery system (Tunis, Ben Arous, Manouba, Ariana) | 1 semaine    | Livraison locale    |
| 3   | Rapports exportables (Excel/PDF pour comptabilité)        | 2-3 jours    | Business ops        |

### Phase 3: Advanced Features (Mois 2-3+)

| #   | Task                                        | Effort         | Impact         |
| --- | ------------------------------------------- | -------------- | -------------- |
| 1   | Multi-language complet                      | 2-3 jours      | Accessibilité  |
| 2   | Blog/Content section                        | 2-3 jours      | SEO + Trust    |
| 3   | Google Maps reviews import                  | 1-2 jours      | Social proof   |
| 4   | AI assistant upgrade (model + Darija)       | 1-2 jours      | Meilleur chat  |
| 5   | Mobile app (PWA first, Capacitor si needed) | 1 jour → 2 sem | Accès mobile   |

---

## 🎯 Admin Dashboard Vision

> **Philosophie**: L'admin est destiné au **business owner**. Focus sur analytics, décisions data-driven, gestion opérationnelle (stock, commandes, fournisseurs, factures). Les modifications SEO et contenus produits se font dans Sanity Studio.

### Tier 1: Critical Fixes — ✅ DONE (Spec 021)

| Feature                  | Status |
| ------------------------ | ------ |
| Logout button            | ✅     |
| Login page isolée        | ✅     |
| Prix dans inventory list | ✅     |
| Bouton "Sauvegarder"     | ✅     |
| Admin route protection   | ✅     |

### Tier 2: Analytics & BI — ✅ DONE (Spec 022)

| Feature                              | Status | Component                         |
| ------------------------------------ | ------ | --------------------------------- |
| Revenue chart (30-day trend)         | ✅     | `RevenueChart`                    |
| Order status distribution chart      | ✅     | `OrderStatusChart`                |
| Orders by gouvernorat chart          | ✅     | `OrdersByCity`                    |
| Enhanced KPIs (4 cards)              | ✅     | `EnhancedKPIs`                    |
| Charts section (parallel fetch)      | ✅     | `ChartsSection`                   |
| AI Business Insights                 | ✅     | `AIInsightsCard`                  |
| Admin analytics server actions       | ✅     | `lib/actions/admin-analytics.ts`  |

### Tier 3: Pre-ERP MVP — ✅ DONE (Spec 023)

| Feature                              | Status | Component / Route                          |
| ------------------------------------ | ------ | ------------------------------------------ |
| Supplier management                  | ✅     | `/admin/suppliers`, `supplierType` schema  |
| Invoice management                   | ✅     | `/admin/invoices`, `invoiceType` schema    |
| Low stock dashboard widget           | ✅     | `LowStockDashboardWidget`                  |
| Low stock badge on product rows      | ✅     | `LowStockBadge`                            |
| Shipping status in order details     | ✅     | `ShippingStatus`                            |
| GROQ queries (suppliers, invoices)   | ✅     | `lib/sanity/queries/suppliers.ts`, `invoices.ts` |

### Tier 4: Future ERP — NOT STARTED (Post-Launch)

| Feature                  | Description                              | Effort       |
| ------------------------ | ---------------------------------------- | ------------ |
| Multi-location inventory | 2 local + 4 présentoires                | 2 semaines   |
| Rôles utilisateurs       | Owner/Manager/Employee/Content           | 1 semaine    |
| Rapports exportables     | Excel/PDF pour comptabilité              | 2-3 jours    |
| Dashboard financier      | Résumé finances, marges, coûts           | 2 semaines   |
| Weekly AI reports        | Rapports automatiques hebdomadaires      | 1 semaine    |
| Stock predictions        | Prédiction de réapprovisionnement        | 2 semaines   |
| Customer behavior        | Analyse comportement clients             | 1 semaine    |
| Marketing suggestions    | Suggestions de promotions data-driven    | 1 semaine    |

---

## 💡 Strategic Decisions

> Decisions prises et à prendre avec le client.

### ✅ Decisions Prises

| Décision        | Choix                                     | Date    |
| --------------- | ----------------------------------------- | ------- |
| Payment         | COD uniquement pour le lancement          | 2026-01 |
| Auth Storefront | Clerk (email/social login)                | 2026-01 |
| Auth Admin      | Custom JWT (username/password)            | 2026-02 |
| CMS             | Sanity v4                                 | 2026-01 |
| Hosting         | Vercel (auto-deploy)                      | 2026-01 |
| AI Model        | Groq (llama-3.1-8b, gratuit)              | 2026-01 |
| Email           | Resend (@resend.dev pour now)             | 2026-01 |
| Stripe          | ❌ Supprimé (pas dispo en Tunisie)        | 2026-02 |
| Sanity App SDK  | ❌ Supprimé (remplacé par server actions) | 2026-02 |

### ❓ Decisions En Attente

| Décision            | Options                          | Impact             | Notes                          |
| ------------------- | -------------------------------- | ------------------ | ------------------------------ |
| Online payment      | Flouci / Konnect / Click to Pay  | Revenue online     |                                |
| TikTok Pixel        | Oui/Non                          | Ads tracking       | GA4 + Meta already built       |
| Custom email domain | `@dodonutrition.tn`              | Emails pas en spam |                                |
| Mobile app          | PWA (1j) → Capacitor (2 sem)     | Accès mobile       |                                |
| Admin roles         | Combien de users? Qui gets quoi? | Accès équipe       | Current: single owner via JWT  |

---

## 💰 Cost & Infrastructure

### Monthly Costs (Current Usage ~1000 visitors/day)

| Service    | Free Tier       | Our Usage | Cost        |
| ---------- | --------------- | --------- | ----------- |
| **Vercel** | 100GB bandwidth | ~15GB     | FREE        |
| **Sanity** | 100k API calls  | ~200k     | ~$0-19/mo   |
| **Clerk**  | 10k MAU         | ~1k MAU   | FREE        |
| **Resend** | 3k emails/mo    | ~600/mo   | FREE        |
| **Groq**   | 30 req/min      | ~100/day  | FREE        |
| **Domain** | —               | 1         | ~50 DT/year |

**Total: 0-60 DT/month** (mostly free tiers)

### If Growth Exceeds Free Tiers

| Service    | Pro Cost   | When               |
| ---------- | ---------- | ------------------ |
| Sanity Pro | ~300 DT/mo | >100k API calls    |
| Vercel Pro | ~60 DT/mo  | >100GB bandwidth   |
| Clerk Pro  | ~75 DT/mo  | >10k monthly users |

### Migration Options (If Costs Rise)

| Service | Alternative         | Cost     |
| ------- | ------------------- | -------- |
| Sanity  | Supabase/PostgreSQL | Free-$25 |
| Clerk   | NextAuth + DB       | Free     |
| Vercel  | Railway/Render      | $5-20    |

---

## ✅ Completed Features

| #   | Feature                                              | Date       | Spec                                             |
| --- | ---------------------------------------------------- | ---------- | ------------------------------------------------ |
| 001 | Project Retrofit                                     | 2026-01-14 | [specs/001](../specs/001-retrofit/)              |
| 002 | Product Schema (7 groups, Portable Text)             | 2026-01-14 | [specs/002](../specs/002-product-schema/)        |
| 003 | Product Page Redesign (Accordion + Reviews)          | 2026-01-15 | [specs/003](../specs/003-product-page-redesign/) |
| 004 | COD Checkout                                         | 2026-01-17 | [specs/004](../specs/004-cod-checkout/)          |
| 005 | CMS Banners                                          | 2026-01-17 | [specs/005](../specs/005-cms-banners/)           |
| 006 | Admin Dashboard (+ Analytics, AI, Orders, Inventory) | 2026-01-20 | [specs/006](../specs/006-admin-dashboard/)       |
| 007 | UI Unification (Dark Theme)                          | 2026-01-21 | [specs/007](../specs/007-ui-unification/)        |
| 008 | Packs & Bundles                                      | 2026-01-21 | [specs/008](../specs/008-packs-bundles/)         |
| 009 | Reviews System (Moderation, Testimonials)            | 2026-01-22 | [specs/009](../specs/009-reviews-system/)        |
| 010 | Wishlist                                             | 2026-01-25 | [specs/010](../specs/010-wishlist/)              |
| 011 | Email Notifications (Resend)                         | 2026-01-25 | [specs/011](../specs/011-email-notifications/)   |
| 012 | Enhancements (Guest Checkout, Darija, Static Pages)  | 2026-01-25 | [specs/012](../specs/012-enhancements/)          |
| 013 | UI Design Audit                                      | 2026-01-25 | [specs/013](../specs/013-ui-design/)             |
| 014 | Mega Menu (Categories + Brands)                      | 2026-01-31 | [specs/014](../specs/014-mega-menu/)             |
| —   | Security Audit (Rate Limiting, Stripe Removal)       | 2026-02-12 | —                                                |
| —   | Admin Auth Refactor (JWT, Server Actions, No SDK)    | 2026-02-14 | —                                                |

| 015 | Homepage + Shop Improvements                        | 2026-02-01 | [specs/015](../specs/015-homepage-shop/)         |
| 016 | SEO Optimization                                    | 2026-02-01 | [specs/016](../specs/016-seo/)                   |
| 017 | Homepage Redesign (9-section architecture)          | 2026-02-10 | [specs/017](../specs/017a-homepage-redesign/)    |
| 018 | Dataset Cleanup & Product Import                    | 2026-02-14 | [specs/018](../specs/018-dataset-cleanup/)       |
| 019 | Homepage Revision & UI Polish                       | 2026-02-16 | [specs/019](../specs/019-homepage-revision/)     |
| 020 | Site Revision Phase 2 (Animations, Polish)          | 2026-02-16 | —                                                |
| 021 | Admin Dashboard Critical Fixes (A1–A5)              | 2026-02-16 | —                                                |
| 022 | Admin Analytics & BI (Charts, KPIs)                 | 2026-02-16 | —                                                |
| 023 | Admin Pre-ERP MVP (Suppliers, Invoices, Stock)      | 2026-02-16 | —                                                |
| 024 | Tracking Integration (GA4, Meta Pixel, CAPI)        | 2026-02-16 | Awaiting env vars                                |
| 025 | Ciblex Delivery Integration                         | 2026-02-16 | Awaiting credentials                             |
| 026 | SEO & Discovery (JSON-LD, Sitemap, OG)              | 2026-02-16 | —                                                |
| 027 | Pre-Launch Features (Upsell, Packs Client, Motion)  | 2026-02-16 | —                                                |
| 028 | Testing Infrastructure                              | 2026-02-16 | —                                                |
| 029 | Documentation Audit                                 | 2026-02-16 | This update                                      |

### Bug Fixes History

| #   | Issue                          | Resolution                                               | Date       |
| --- | ------------------------------ | -------------------------------------------------------- | ---------- |
| C1  | Checkout success page empty    | Fixed `useCartStore` selector logic                      | 2026-01-22 |
| C2  | Search button broken           | Fixed `onClick` handler in Header                        | 2026-01-22 |
| C3  | Admin AI Insights not working  | Switched to Groq API                                     | 2026-01-25 |
| B1  | Middleware naming (proxy.ts)   | Renamed to middleware.ts (Next.js convention)            | 2026-02-12 |
| B2  | Order status update auth error | Switched import to admin-mutations.ts (JWT)              | 2026-02-14 |
| B3  | Insights API 403               | Replaced Clerk isAdmin() with JWT isAdminAuthenticated() | 2026-02-14 |
| B4  | Brand links → 404              | Changed `/brands/{slug}` to `/shop?brand={slug}`         | 2026-02-16 |
| B5  | Category mobile links → 404    | Changed `/categories/{slug}` to `/shop?category={slug}`  | 2026-02-16 |
| B6  | Mobile menu autofocus          | Removed `autoFocus` from search input                    | 2026-02-16 |
| B7  | Checkout with account failing  | Fixed email validation for authenticated users           | 2026-02-16 |
| B8  | Email template failing         | Fixed `last:` Tailwind classes in `@react-email`         | 2026-02-16 |
| B9  | TypeScript build errors        | Replaced broken TypeGen types with working alternatives  | 2026-02-16 |
| B10 | CTA hover text invisible       | Fixed `--accent-foreground` CSS variable                 | 2026-02-16 |

---

_Last Updated: 2026-02-16 — v1.4.0_
