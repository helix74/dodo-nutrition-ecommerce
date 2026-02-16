# 🗺️ ROADMAP — Dodo Nutrition

> **Last Updated**: 2026-02-16
> **Status**: Deployed → Preparing for Launch
> **Version**: 1.3.0

---

## Table of Contents

1. [Current Status](#-current-status)
2. [Before Launch](#-before-launch)
3. [Post Launch](#-post-launch)
4. [Admin Dashboard Vision](#-admin-dashboard-vision)
5. [Strategic Decisions](#-strategic-decisions)
6. [Cost & Infrastructure](#-cost--infrastructure)
7. [Completed Features](#-completed-features)

---

## 📊 Current Status

| Area                  | Status        | Notes                                       |
| --------------------- | ------------- | ------------------------------------------- |
| **Storefront**        | ✅ Live       | Products, cart, checkout, reviews, wishlist |
| **Admin Dashboard**   | ✅ Live       | JWT auth, server actions, no Sanity SDK     |
| **Sanity Studio**     | ✅ Live       | Content editing at `/studio`                |
| **Deployment**        | ✅ Vercel     | Auto-deploy on push to `main`               |
| **Auth (Storefront)** | ✅ Clerk      | Sign-up/login/social                        |
| **Auth (Admin)**      | ✅ Custom JWT | Username/password via env vars              |
| **AI**                | ✅ Groq       | Chat assistant + admin insights             |
| **Emails**            | ✅ Resend     | Order confirmation (`@resend.dev`)          |

---

## 🔴 Before Launch

> **Priority**: Everything here MUST be done before changing domain name and going live.

### 1. Homepage Redesign ⭐ PRIORITY #1

**Status**: ✅ 95% Complete (Spec 017a–g + Spec 019)

**Sections**:

| Section           | Status       | Notes                                                |
| ----------------- | ------------ | ---------------------------------------------------- |
| Hero Section      | ✅ Done      | CMS-driven slider, trust badges, responsive CTAs     |
| Featured Products | ✅ Done      | Tabs (best-sellers/nouveautés/promos), Darija titles  |
| Featured Packs    | ✅ Done      | Pack cards with savings display                       |
| Categories Grid   | ✅ Done      | Visual grid with gradient overlays, Darija titles     |
| Goal Navigator    | ✅ Done      | 4 goals (muscle/performance/sèche/bien-être)          |
| Brands Marquee    | ✅ Done      | Two-row reverse animation, Darija title               |
| Testimonials      | ✅ Done      | Dynamic from Sanity (hidden when no reviews)          |
| Final CTA         | ✅ Done      | AI chat integration, Darija text                      |
| Banner Section    | ✅ Done      | CMS-driven promotional banners                        |

**Remaining polish** (minor):
- [ ] Add Framer Motion animations (post-launch Phase 2)
- [ ] Product images (user to upload in Sanity Studio)
- [ ] Reviews data (user to add in Sanity Studio)

---

### 2. Dataset Cleanup & Product Import

**Status**: ✅ Done (Spec 018)

- 119 products imported, clean IDs, 0 broken refs
- 10 categories, 21 brands
- Templates available at `data/template-packs.csv`

**Still needs user action**:
- [ ] Update real prices, stock, featured flags in `data/products-database.csv`
- [ ] Upload product images in Sanity Studio
- [ ] Provide pack data (CSV based on `data/template-packs.csv`)

---

### 3. Site Revision & Bug Fixes

**Status**: ✅ 90% Complete (Spec 019)

- [x] Fixed broken routes: `/brands/[slug]` → `/shop?brand=slug`, `/categories/[slug]` → `/shop?category=slug`
- [x] Fixed button hover states (text invisible on dark background)
- [x] Translated all user-facing English text to French
- [x] Fixed mobile hamburger menu (categories, brands, search — removed autofocus)
- [x] Fixed responsive trust badges on mobile
- [x] Fixed checkout with logged-in accounts
- [x] Fixed order confirmation emails
- [x] CTA buttons resized for better visibility
- [ ] Search UX improvement (currently modal-based, needs persistent search bar)
- [ ] Infinite scroll pagination on shop page
- [ ] Mobile product card height consistency (when names wrap)

---

### 4. Admin Dashboard Fixes — Issues Connues

| #   | Issue                     | Description                                             | Priority  |
| --- | ------------------------- | ------------------------------------------------------- | --------- |
| A1  | Pas de bouton déconnexion | Après login, impossible de se déconnecter               | 🔴 High   |
| A2  | Sidebar visible sur login | Navigation (Inventory, Orders, Avis) visible avant auth | 🔴 High   |
| A3  | Prix vides dans inventory | Les prix n'apparaissent pas dans la liste               | 🟠 Medium |
| A4  | Pas de bouton "Confirmer" | Changements prix/quantité sans confirmation             | 🟠 Medium |
| A5  | Page admin découvrable    | `/admin` accessible en tapant l'URL                     | 🟡 Low    |

---

## 🟢 Post Launch

> **Priority**: Après le changement de domaine et le lancement officiel.

### Phase 1: SEO & Marketing (Semaine 1-2 Post-Launch)

| #   | Task                                                    | Effort | Impact              |
| --- | ------------------------------------------------------- | ------ | ------------------- |
| 1   | Meta titles/descriptions dynamiques par produit         | 2-3h   | SEO                 |
| 2   | JSON-LD structured data (Product, Review, Organization) | 2h     | Google Rich Results |
| 3   | Sitemap.xml auto-généré                                 | 1h     | Indexation          |
| 4   | Open Graph tags pour partage social                     | 30min  | Social sharing      |
| 5   | Pages catégories SEO (`/categories/[slug]`)             | 1 jour | SEO + Navigation    |
| 6   | Tracking pixels (Meta, GA4, TikTok)                     | 2-3h   | Analytics & Ads     |

### Phase 2: Revenue Features (Semaine 2-4)

| #   | Task                                            | Effort | Impact                |
| --- | ----------------------------------------------- | ------ | --------------------- |
| 1   | Upsell/Cross-sell ("Clients achètent aussi...") | 1 jour | +15-25% panier moyen  |
| 2   | Newsletter backend (Resend Audiences)           | 1-2h   | Communication clients |
| 3   | Animations & polish (Framer Motion)             | 4-6h   | UX premium            |
| 4   | Custom email domain (@dodonutrition.tn)         | 30min  | Emails pas en spam    |

### Phase 3: Shipping & Operations (Mois 1-2)

| #   | Task                                                      | Effort       | Impact              |
| --- | --------------------------------------------------------- | ------------ | ------------------- |
| 1   | Ciblex shipping integration (national)                    | 1-2 semaines | Livraison nationale |
| 2   | Local delivery system (Tunis, Ben Arous, Manouba, Ariana) | 1 semaine    | Livraison locale    |
| 3   | Tracking number injection dans orders                     | 2-3h         | Suivi commandes     |
| 4   | Zone detection (par gouvernorat)                          | 1 jour       | Pricing par zone    |

### Phase 4: Advanced Features (Mois 2-3+)

| #   | Task                                        | Effort         | Impact         |
| --- | ------------------------------------------- | -------------- | -------------- |
| 1   | Online payment (Flouci / Konnect)           | 1 semaine      | Revenue online |
| 2   | Multi-language complet                      | 2-3 jours      | Accessibilité  |
| 3   | Blog/Content section                        | 2-3 jours      | SEO + Trust    |
| 4   | Google Maps reviews import                  | 1-2 jours      | Social proof   |
| 5   | AI assistant upgrade (model + Darija)       | 1-2 jours      | Meilleur chat  |
| 6   | Mobile app (PWA first, Capacitor si needed) | 1 jour → 2 sem | Accès mobile   |

---

## 🎯 Admin Dashboard Vision

> **Philosophie**: L'admin est destiné au **owner**. Focus sur analytics, inventory, stock, opérations. Pas besoin de toucher au SEO ou aux descriptions produits — ça c'est Sanity Studio.

### Current Features (v1.2.0)

| Feature                              | Status |
| ------------------------------------ | ------ |
| Login (JWT, username/password)       | ✅     |
| Dashboard avec stats                 | ✅     |
| AI Business Insights                 | ✅     |
| Gestion commandes (status, timeline) | ✅     |
| Gestion inventaire (stock, prix)     | ✅     |
| Modération avis                      | ✅     |
| Accès Sanity Studio                  | ✅     |

### Planned Improvements — Phase 1 (Admin UX)

| Feature                  | Description                             | Priority |
| ------------------------ | --------------------------------------- | -------- |
| Logout button            | Bouton déconnexion visible              | 🔴       |
| Login page isolée        | Cacher sidebar avant auth               | 🔴       |
| Prix dans inventory list | Afficher les prix correctement          | 🔴       |
| Bouton "Sauvegarder"     | Confirmer les changements prix/quantité | 🟠       |
| Quick actions améliorées | Confirm/Ship/Deliver plus intuitif      | 🟠       |

### Planned Improvements — Phase 2 (Analytics & Reporting)

| Feature              | Description                             |
| -------------------- | --------------------------------------- |
| Charts détaillés     | Revenue, orders, stock graphs           |
| Rapports exportables | Excel/PDF pour comptabilité             |
| Alertes stock        | Notifications temps réel pour stock bas |
| Tableau de bord KPI  | Métriques business principales          |
| Historique activité  | Audit trail des actions admin           |

### Planned Improvements — Phase 3 (ERP Features)

| Feature                  | Description                              | Effort       |
| ------------------------ | ---------------------------------------- | ------------ |
| Gestion fournisseurs     | Carnet d'adresses, commandes fournisseur | 2 semaines   |
| Livraisons/Expéditions   | Suivi colis, intégration transporteurs   | 1-2 semaines |
| Facturation              | Génération automatique de factures       | 1 semaine    |
| Multi-location inventory | 2 local + 4 présentoires                 | 2 semaines   |
| Rôles utilisateurs       | Owner/Manager/Employee/Content           | 1 semaine    |
| Dashboard financier      | Résumé finances, marges, coûts           | 2 semaines   |

### Planned Improvements — Phase 4 (Intelligence)

| Feature               | Description                                      |
| --------------------- | ------------------------------------------------ |
| Weekly AI reports     | Rapports automatiques hebdomadaires              |
| Stock predictions     | Prédiction de réapprovisionnement                |
| Customer behavior     | Analyse comportement clients                     |
| Marketing suggestions | Suggestions de promotions basées sur les données |
| Ad copy generation    | Génération de textes publicitaires               |

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

| Décision            | Options                          | Impact             |
| ------------------- | -------------------------------- | ------------------ |
| Online payment      | Flouci / Konnect / Click to Pay  | Revenue online     |
| Tracking pixels     | Meta, GA4, TikTok — lesquels?    | Marketing/Ads      |
| ERP expansion       | Oui/Non, scope?                  | +4 semaines dev    |
| Custom email domain | `@dodonutrition.tn`              | Emails pas en spam |
| Mobile app          | PWA (1j) → Capacitor (2 sem)     | Accès mobile       |
| Admin roles         | Combien de users? Qui gets quoi? | Accès équipe       |

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

_Last Updated: 2026-02-16_
