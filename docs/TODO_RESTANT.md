# 📋 TODO — Actions Restantes Avant Lancement

> **Date**: 2026-02-21  
> **Statut**: Pré-lancement — Code feature-complete, données en attente

---

## 🔴 Actions Owner (Obligatoire avant launch)

### 1. Données Produits

| Action                   | Comment                                               | Priorité    |
| ------------------------ | ----------------------------------------------------- | ----------- |
| Prix réels des produits  | Fournir CSV → import, ou éditer dans Studio `/studio` | 🔴 Critique |
| Stock réels              | Même chose — CSV ou Studio                            | 🔴 Critique |
| Vérifier images produits | Déjà uploadées ✅ (Sanity CDN, persistent)            | ✅ Fait     |

### 2. Packs

| Action               | Comment                                           | Priorité        |
| -------------------- | ------------------------------------------------- | --------------- |
| Créer 1-2 packs test | Studio `/studio` → Pack / Bundle → Nouveau        | 🟡 Test         |
| Créer tous les packs | Studio (visuel) ou donner liste pour script batch | 🟡 Avant launch |

### 3. Variables d'Environnement (`.env.local` + Vercel)

| Variable                        | Source                       | Priorité     |
| ------------------------------- | ---------------------------- | ------------ |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4           | 🟡 Tracking  |
| `NEXT_PUBLIC_META_PIXEL_ID`     | Meta Business Manager        | 🟡 Tracking  |
| `META_CAPI_ACCESS_TOKEN`        | Meta Business Manager        | 🟡 Tracking  |
| `CIBLEX_USER`                   | Ciblex (demander au livreur) | 🔴 Livraison |
| `CIBLEX_PASS`                   | Ciblex                       | 🔴 Livraison |

### 4. Email & Domaine

| Action                 | Comment                                        | Priorité     |
| ---------------------- | ---------------------------------------------- | ------------ |
| Vérifier domaine email | `@dodonutrition.tn` → Resend dashboard         | 🟡 Anti-spam |
| Pointer DNS            | dodonutrition.tn → Vercel                      | 🔴 Launch    |
| Config Vercel env vars | Copier `.env.local` vars dans Vercel dashboard | 🔴 Launch    |

---

## ✅ Fait par Antigravity (cette session)

| #   | Action                                                           | Statut                     |
| --- | ---------------------------------------------------------------- | -------------------------- |
| 1   | Fix 2 admin API routes exposées (`/products`, `/upload`)         | ✅ Auth guard ajouté       |
| 2   | Fix 7 admin server actions sans auth (`admin-mutations.ts`)      | ✅ `requireAdmin()` ajouté |
| 3   | Import Sanity: 115 storytelling + 109 benefits/certs (0 erreurs) | ✅ 224 patches appliqués   |
| 4   | Admin AI Chat widget                                             | ✅ Flottant, bottom-right  |
| 5   | Product page gallery (aspect-square, max-h-480px)                | ✅ Fixé                    |
| 6   | Admin product page nettoyé (plus de meubles)                     | ✅ Fixé                    |
| 7   | Traductions FR + `lang="fr"`                                     | ✅ Fixé                    |
| 8   | Build verification                                               | ✅ Exit code 0             |

---

## ⚠️ Pas fait — Bloqué

| #   | Action                   | Raison                               | Solution                                                              |
| --- | ------------------------ | ------------------------------------ | --------------------------------------------------------------------- |
| 1   | Test visuel mobile admin | Browser tool cassé (`$HOME` env var) | Code analysé: patterns responsive OK, test visuel requis manuellement |
| 2   | Test visuel packs page   | Même raison                          | Tester manuellement après deploy                                      |

---

## 🔮 Post-Launch (Roadmap)

| #   | Feature                            | Effort     | Impact                |
| --- | ---------------------------------- | ---------- | --------------------- |
| 1   | Newsletter (Resend Audiences)      | 1-2h       | Communication clients |
| 2   | TikTok Pixel                       | 1-2h       | Ads tracking          |
| 3   | Search UX persistant               | 4-6h       | UX improvement        |
| 4   | Pagination infinie shop            | 2-3h       | Shop UX               |
| 5   | Paiement en ligne (Flouci/Konnect) | 1 semaine  | Revenue online        |
| 6   | Livraison locale (Tunis zone)      | 1 semaine  | Livraison locale      |
| 7   | Rapports Excel/PDF                 | 2-3 jours  | Business ops          |
| 8   | Blog/Content                       | 2-3 jours  | SEO + Trust           |
| 9   | PWA / App mobile                   | 1j → 2 sem | Accès mobile          |

---

## 📐 Guide Images (Pour référence)

| Type        | Dimensions  | Format          | Notes                   |
| ----------- | ----------- | --------------- | ----------------------- |
| Produit     | 1080×1080px | WebP/PNG        | Carré, auto-constrained |
| Brand logo  | 200×80px    | PNG transparent | Wide format             |
| Hero banner | 1920×800px  | WebP/JPG        | Full-width              |
| Pack image  | 1080×1080px | WebP/PNG        | Carré comme produits    |
