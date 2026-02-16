# Spec 019 — Homepage Revision & Pre-Launch Polish

> **Date**: 2026-02-16
> **Status**: In Progress
> **Priority**: Before Launch

---

## Goal

Fix all visual bugs, styling issues, incorrect text, and responsiveness problems on the homepage and shared layout components (header, footer, mega menu) before launch.

---

## Issues Found (Audit)

### A. Language — Arabic text to replace with French

| # | Component | Current (Arabic) | Target (French) |
|---|-----------|-------------------|-----------------|
| A1 | Header nav links | الرئيسية, المتجر, الباقات, العروض | Accueil, Boutique, Packs, Promos |
| A2 | MegaMenu trigger labels | التصنيفات, الماركات | Catégories, Marques |
| A3 | MegaMenu "show all" | عرض الكل → | Voir tout → |
| A4 | MegaMenu section headers | التصنيفات, الماركات | Catégories, Marques |
| A5 | Footer nav links | الرئيسية, المتجر, التصنيفات, الماركات, العروض | Accueil, Boutique, Catégories, Marques, Promos |
| A6 | Footer aide links | الأسئلة الشائعة, التوصيل, الإرجاع, الشروط, إشعار قانوني | FAQ, Livraison, Retours, CGV, Mentions légales |
| A7 | Footer section headers | روابط, مساعدة, اتصل بنا | Navigation, Aide, Contact |
| A8 | Footer payment | الدفع, الدفع عند الاستلام | Paiement, Paiement à la livraison |
| A9 | Mobile menu | (same as header nav) | Same French labels |
| A10 | Header sr-only labels | بحث, المفضلة, القفة, طلباتي, دخول | Recherche, Favoris, Panier, Commandes, Connexion |

### B. Styling Issues

| # | Component | Issue | Fix |
|---|-----------|-------|-----|
| B1 | FeaturedProducts TabsList | Left-aligned on desktop | Center the tabs bar |
| B2 | GoalNavigator icons | Icons `text-5xl` too big | Reduce to `text-3xl` or `text-4xl` |
| B3 | FinalCTA section | Colors not dark enough, doesn't match theme | Darker gradient, proper dark theme styling |
| B4 | CTA buttons hover | Text potentially invisible on hover | Verify all hover:bg vs text color combos |
| B5 | GoalNavigator Darija text | Not proper Tunisian Darija | Review and correct |
| B6 | TestimonialsSection title | "شنوا قالوا عليّنا" — Darija issues | Review text accuracy |
| B7 | FeaturedProducts section title | "الأفضل عندنا" | Verify or change |
| B8 | Add to cart button text | "زيدو للقضية" | Review Darija accuracy |

### C. Responsiveness

| # | Component | Issue | Fix |
|---|-----------|-------|-----|
| C1 | BrandsMegaMenu | Fixed `w-[700px]`, only 6 cols, all 21 brands shown in giant dropdown | Limit visible rows, make responsive |
| C2 | HeroSection image | Not showing fully on mobile | Adjust mobile aspect ratio / object-position |
| C3 | Mobile overall | Multiple sections need responsiveness review | Full mobile pass |

### D. Functional

| # | Component | Issue | Fix |
|---|-----------|-------|-----|
| D1 | BrandsMarquee | Scroll animation too slow (30s) | Reduce to 15-20s |
| D2 | FinalCTA | Should push users to AI chat | Add AI chat CTA button |
| D3 | Root layout metadata | Still says "E-Commerce AI App" | Update to Dodo Nutrition |
| D4 | megamenu.ts | Uses `client.fetch()` instead of `sanityFetch()` | Update to proper pattern |

---

## Non-Functional Requirements

- All changes must maintain dark theme consistency
- Headlines/CTAs in Darija (Arabic script) must be correct Tunisian
- Body text in French
- Mobile-first responsive design
- No breaking changes to existing functionality
