# Checklist complète — Ce qui a été fait / Ce qui reste

> **Date**: 2026-02-16  
> **Objectif**: Une seule référence pour demain: vérification et suite du travail (sans rien oublier).

---

## 1. Ce qui a été fait (melli hkitou maak + roadmap)

### Spec 019 — Homepage Revision (déjà fait avant cette phase)

- Header / footer / mega menu: liens en français (Accueil, Boutique, Packs, Promos, etc.)
- Mega menu brands responsive (plus de w-[700px] fixe)
- Section "منتوجاتنا المميّزة" centrée, bouton "Voir tout" en or
- GoalNavigator: titre/sous-titre en darija, icônes réduites
- FinalCTA: "مازلت حاير؟", CTAs "إسأل الـ AI" / "إكتشف البوتيك", texte en darija
- Trust badges, hero image mobile, boutons hover (texte visible)
- "زيدو للقضيّة" sur le site, checkout "Continuer sans compte" hover fix
- Emails Resend: fix `last:mb-0` (OrderConfirmation), Layout Head inside Tailwind
- Checkout avec compte: validation email skippée si authentifié
- Hydration: `suppressHydrationWarning` AppShell
- Types Vercel: ProductCard/ProductGrid en PROMOTIONS_QUERYResult, Pack quantity `number | null`
- Liens brands/categories: `/shop?brand=slug` et `/shop?category=slug` + pages dédiées `/brands/[slug]`, `/categories/[slug]`

### Spec 020 — Frontend Polish

- CTA plus grands (h-12, text-base) partout
- Hero: titre optionnel (Sanity), image en entier (object-contain/cover), badges alignés en grille mobile
- Product page: galerie max-height desktop pour voir les CTA sans scroll, fond sombre pour images WebP
- Bouton panier: "زيدو للقضيّة", toast succès en français
- Page succès commande (COD + Stripe path) en français
- **next.config.ts**: `turbopack.root` pour corriger le 404 (workspace root)

### Spec 021 — Admin Critical Fixes

- Logout: bouton "Se déconnecter", `adminLogoutAction`
- Sidebar masquée sur `/admin/login` si non connecté
- Colonne "Prix TND" dans l’inventaire
- PriceInput, StockInput, FeaturedToggle: confirmation (Sauvegarder / deux étapes)
- Tous les textes admin en français (en-têtes, labels, erreurs, AI Insights)

### Spec 022 — Admin Analytics & BI

- KPIs: panier moyen, stock bas, rupture, top catégorie
- Graphiques: revenus 30j, commandes par gouvernorat, statuts (donut)
- ChartsSection + EnhancedKPIs sur la page dashboard
- AIInsightsCard: cache sessionStorage, bouton "Rafraîchir", prompt en français

### Spec 023 — Admin Pre-ERP MVP

- Schémas Sanity: `supplierType`, `invoiceType`
- Pages admin: `/admin/suppliers`, `/admin/invoices`
- Widget stock bas en haut du dashboard, badge stock bas sur le lien Inventaire
- Requêtes GROQ + actions serveur pour fournisseurs et factures

### Spec 024 — Tracking

- Meta Pixel + GA4 (composants dans le layout)
- `lib/tracking/events.ts`: PageView, ViewContent, AddToCart, InitiateCheckout, Purchase
- CAPI serveur (meta-capi.ts) pour Purchase / AddToCart
- TrackViewContent sur la page produit, hooks sur checkout et succès
- `.env.example` mis à jour (META_PIXEL_ID, GA_MEASUREMENT_ID, META_CAPI_ACCESS_TOKEN)

### Spec 025 — Ciblex

- Client API Ciblex (`lib/shipping/ciblex.ts`), action `createCiblexShipment`, appel non-bloquant après création de commande
- Route `/api/admin/shipping/sync` pour mettre à jour les statuts
- Composant ShippingStatus sur la fiche commande
- Liste des 24 gouvernorats (`lib/constants/gouvernorats.ts`), `.env.example` CIBLEX_USER / CIBLEX_PASS

### Spec 026 — SEO & Discovery

- JSON-LD: Product, Organization (composants dans `components/seo/JsonLd.tsx`)
- `app/sitemap.ts`: produits, catégories, marques, packs, pages statiques
- `generateMetadata` + Open Graph / Twitter sur produit, catégorie, marque
- Pages SEO: `/categories/[slug]`, `/brands/[slug]` avec ProductGrid

### Spec 027 — Pre-Launch Features

- Page Packs: tri (prix, économies), filtre, layout aligné shop
- "Vous aimerez aussi" (RelatedProducts)
- CartUpsell + API `/api/cart-upsell` dans CartSheet
- Framer Motion: FadeIn, SlideUp sur les sections homepage

### Spec 028 — Testing & Security

- Playwright: config + tests e2e (navigation, shopping, checkout)
- Script `scripts/security-audit.ts` + `docs/SECURITY_CHECKLIST.md`
- `docs/PERFORMANCE_CHECKLIST.md`
- Vulnérabilités npm (2 high, MCP SDK) documentées dans SECURITY_CHECKLIST

### Spec 029 — Documentation

- ROADMAP.md: v1.4.0, statuts, User Action Required, Admin en 4 tiers
- CHANGELOG.md: entrée v1.4.0 (Specs 020–029)
- ProjectHandover.mdc + AdminDashboard.mdc à jour

### Scripts / données préparés (à exécuter / importer par toi)

- `scripts/inject-storytelling.ts`: lit l’ancien CSV, extrait HTML → Portable Text, génère `data/storytelling-import.ndjson` (et benefits-certifications)
- Fichiers générés: `data/storytelling-import.ndjson`, `data/benefits-certifications-import.ndjson` — **tu dois les importer dans Sanity** (ou relancer le script puis import)

### Specs 020–029 documentés

- Dossiers `specs/020-frontend-polish` à `specs/029-documentation` avec `spec.md`, `plan.md`, `tasks.md` pour chaque spec.

---

## 2. Ce qui n’a pas été fait (mazel ma sar)

### À faire par toi (données / config)

| # | Item | Où / Comment |
|---|------|----------------|
| 1 | Prix et stock réels des produits | Mettre à jour `data/products-database.csv` puis ré-import ou édition dans Studio |
| 2 | Images produits | Upload dans Sanity Studio (/studio) |
| 3 | Données Packs | CSV basé sur `data/template-packs.csv` → import |
| 4 | Variables d’env tracking | `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, `META_CAPI_ACCESS_TOKEN` dans `.env.local` |
| 5 | Identifiants Ciblex | `CIBLEX_USER`, `CIBLEX_PASS` dans `.env.local` |
| 6 | Domaine email | Vérifier @dodonutrition.tn avec Resend |
| 7 | DNS | Pointer dodonutrition.tn vers Vercel |
| 8 | Storytelling produits | Lancer `inject-storytelling.ts` si besoin, puis importer les NDJSON dans Sanity (ou faire du manuel) |
| 9 | Certifications / bénéfices | Importer `data/benefits-certifications-import.ndjson` ou compléter manuellement dans Studio |

### Pas fait côté code (ou partiel)

| # | Item | Raison / Note |
|---|------|----------------|
| 1 | Search UX | Barre de recherche persistante, recherche mobile, conservation du texte en naviguant — prévu **post-launch** (ROADMAP) |
| 2 | Pagination infinie shop | Prévu **post-launch** |
| 3 | Sanity Studio crop | Outils crop non fonctionnels — backend Sanity, priorité basse |
| 4 | Google Places API | Structure prête, il ne manque que la clé API (à ajouter par toi) |
| 5 | Protection routes admin API | Security audit signale `/api/admin/products` et `/api/admin/upload` non protégés — à sécuriser si exposés |
| 6 | Correction vulnérabilités npm | 2 high (MCP SDK) documentées — mise à jour des deps à prévoir |
| 7 | Reviews dynamiques 100% | Données reviews dans Sanity ; si des reviews statiques restent en dur quelque part, à basculer en Sanity |
| 8 | Fine-tune textes Darija | Tu préfères ajuster manuellement les textes CTA / titres en darija |

### Post-launch (ROADMAP, pas dans cette phase)

- Newsletter (Resend Audiences), TikTok Pixel, domaine email custom
- Paiement en ligne (Flouci / Konnect / etc.)
- Livraison locale (Tunis, etc.)
- Rapports exportables (Excel/PDF)
- Multi-langue, blog, Google Maps reviews, upgrade AI (Darija), PWA / app mobile
- Admin: multi-location, rôles, rapports financiers, prédictions stock, etc.

---

## 3. Vérification demain (checklist rapide)

1. **Env**  
   - [ ] `.env.local` contient les clés tracking (GA, Meta, CAPI) si tu veux activer le tracking  
   - [ ] `.env.local` contient Ciblex (CIBLEX_USER, CIBLEX_PASS) si tu actives les expéditions  

2. **Données**  
   - [ ] Prix / stock à jour (CSV ou Studio)  
   - [ ] Images produits uploadées  
   - [ ] Packs créés / importés  
   - [ ] Storytelling: script exécuté + import NDJSON si tu l’utilises  
   - [ ] Certifications / bénéfices: import ou saisie manuelle  

3. **Site**  
   - [ ] `pnpm dev` sans 404 (turbopack.root dans next.config)  
   - [ ] Homepage, /shop, /packs, /admin, /studio ouvrent correctement  
   - [ ] Checkout test (guest + compte si besoin)  
   - [ ] Emails de confirmation reçus  

4. **Sécurité**  
   - [ ] Lire `docs/SECURITY_CHECKLIST.md`  
   - [ ] Décider de protéger `/api/admin/products` et `/api/admin/upload`  
   - [ ] Planifier mise à jour des deps pour les 2 vulns high  

5. **Docs**  
   - [ ] ROADMAP.md et CHANGELOG.md à jour (déjà faits en Spec 029)  
   - [ ] Ce fichier comme référence "done / not done"  

---

## 4. Où sont les specs

| Spec | Dossier | Fichiers |
|------|---------|----------|
| 020 | `specs/020-frontend-polish/` | spec.md, plan.md, tasks.md |
| 021 | `specs/021-admin-critical-fixes/` | spec.md, plan.md, tasks.md |
| 022 | `specs/022-admin-analytics/` | spec.md, plan.md, tasks.md |
| 023 | `specs/023-admin-pre-erp/` | spec.md, plan.md, tasks.md |
| 024 | `specs/024-tracking/` | spec.md, plan.md, tasks.md |
| 025 | `specs/025-ciblex/` | spec.md, plan.md, tasks.md |
| 026 | `specs/026-seo/` | spec.md, plan.md, tasks.md |
| 027 | `specs/027-pre-launch-features/` | spec.md, plan.md, tasks.md |
| 028 | `specs/028-testing-security/` | spec.md, plan.md, tasks.md |
| 029 | `specs/029-documentation/` | spec.md, plan.md, tasks.md |

---

*Résumé: tout ce qu’on a discuté et qui est implémenté est listé en §1. Ce qui reste à faire par toi ou plus tard est en §2. La §3 te sert de checklist pour demain. Les specs 020–029 sont dans `specs/` avec spec, plan et tasks.*
