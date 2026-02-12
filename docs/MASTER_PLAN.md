# 🎯 DODO NUTRITION — MASTER PLAN

> **Last Updated**: 2026-02-12  
> **Status**: Security Audit Complete → Ready for Deployment

---

## 📋 Quick Answers

| #   | Question                                     | Answer                                                                                                                                                                     |
| --- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Deploy with `@resend.dev`?                   | **Oui**, ça marche pour le staging et les premiers clients. Le seul problème: les emails arrivent parfois en spam. Quand le client fournit un domaine, on switch en 5 min. |
| 2   | `pnpm audit` results?                        | **9 vulnérabilités** — toutes fixables en upgradeant Next.js (`16.0.7` → `16.1.5+`). Voir [section fix](#-fix-vulnerabilities) ci-dessous.                                 |
| 3   | Caching/Performance?                         | **CV**. `useCdn: false` correct pour SSR Vercel. `revalidatePath` utilisé partout. Pas de memory leak. Acceptable pour le lancement.                                       |
| 4   | Deploy maintenant et continuer à développer? | **Absolument oui.** C'est la meilleure stratégie. Deploy → test réel → itère.                                                                                              |
| 5   | UI improvements later?                       | **101% d'accord.** Le look est acceptable, le client est satisfait. Garder l'amélioration UI pour une phase dédiée post-launch.                                            |

---

## 🚀 DEPLOYMENT GUIDE (Step by Step)

### Step 1: Fix Vulnerabilities (5 min)

```bash
pnpm update next@latest
pnpm audit
```

> Si `pnpm audit` retourne 0 vulnérabilités → ✅

### Step 2: Push to GitHub

```bash
git add -A
git commit -m "v1.1.0: Security audit, Stripe removal, rate limiting"
git push origin main
```

### Step 3: Configure Vercel Environment Variables

Dans **Vercel Dashboard** → Project → **Settings** → **Environment Variables**, ajouter:

| Variable                            | Value                            | Scope       |
| ----------------------------------- | -------------------------------- | ----------- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`     | _(copier depuis `.env.local`)_   | All         |
| `NEXT_PUBLIC_SANITY_DATASET`        | `production`                     | All         |
| `NEXT_PUBLIC_SANITY_ORG_ID`         | _(copier depuis `.env.local`)_   | All         |
| `SANITY_API_WRITE_TOKEN`            | _(copier depuis `.env.local`)_   | All         |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | _(copier depuis `.env.local`)_   | All         |
| `CLERK_SECRET_KEY`                  | _(copier depuis `.env.local`)_   | All         |
| `GROQ_API_KEY`                      | _(copier depuis `.env.local`)_   | All         |
| `RESEND_API_KEY`                    | _(copier depuis `.env.local`)_   | All         |
| `ADMIN_EMAILS`                      | ton.email@gmail.com              | All         |
| `NEXT_PUBLIC_BASE_URL`              | `https://ton-domaine.vercel.app` | Production  |
| `NEXT_PUBLIC_BASE_URL`              | `http://localhost:3000`          | Development |

> [!IMPORTANT]
> `ADMIN_EMAILS` = les emails des comptes Clerk qui auront accès à `/admin`. Séparer par virgules si plusieurs.
> `NEXT_PUBLIC_BASE_URL` = l'URL finale du site. Mettre l'URL Vercel d'abord, puis changer quand tu as un domaine custom.

### Step 4: Deploy

Vercel auto-deploy sur chaque push. Sinon:

```bash
npx vercel --prod
```

### Step 5: Manual Testing Checklist

| Test              | Route           | What to Check                                         |
| ----------------- | --------------- | ----------------------------------------------------- |
| Guest checkout    | `/checkout`     | Commander sans compte, vérifier email de confirmation |
| Auth checkout     | `/checkout`     | Se connecter, puis commander                          |
| Admin dashboard   | `/admin`        | Vérifier accès (avec l'email dans ADMIN_EMAILS)       |
| Admin orders      | `/admin/orders` | Voir les commandes, changer statut                    |
| AI Chat           | Widget en bas   | Poser une question sur un produit                     |
| Reviews           | Page produit    | Soumettre un avis                                     |
| Non-admin blocked | `/admin`        | Tester avec un compte non-admin → doit être bloqué    |

---

## 📊 EVERYTHING TO DO — Organized

### 🚀 DEPLOY NOW (Today)

- [ ] Fix Next.js vulnerabilities (`pnpm update next@latest`)
- [ ] Push to GitHub
- [ ] Configure Vercel env vars (voir guide ci-dessus)
- [ ] Deploy to Vercel
- [ ] Manual testing checklist

---

### 🔴 MUST DO (Cette Semaine)

| #   | Task                                          | Effort | Status |
| --- | --------------------------------------------- | ------ | ------ |
| 1   | Upgrade Next.js (fix 9 vulns)                 | 5 min  | ⬜     |
| 2   | Test emails (vérifier que Resend envoie bien) | 15 min | ⬜     |
| 3   | Vérifier Clerk auth en production             | 10 min | ⬜     |
| 4   | Tester COD checkout end-to-end                | 20 min | ⬜     |
| 5   | Vérifier que l'admin dashboard marche en prod | 10 min | ⬜     |

---

### 🟠 SHOULD DO (Si le Temps Permet, avant prochaine rencontre client)

| #   | Task                                                | Effort | Notes                                      |
| --- | --------------------------------------------------- | ------ | ------------------------------------------ |
| 1   | SEO basics — meta titles, descriptions, sitemap.xml | 2-3h   | Spec 016                                   |
| 2   | Newsletter backend — stocker les abonnés            | 1-2h   | Spec 017                                   |
| 3   | JSON-LD structured data pour les produits           | 1h     | Google search results                      |
| 4   | Open Graph tags pour partage social                 | 30min  | Facebook/Instagram                         |
| 5   | Tracking pixels (Meta, GA4)                         | 1h     | Besoin de savoir les comptes pub du client |

---

### 🟢 AFTER DEPLOYMENT (Post-Launch)

| #   | Task                                       | Effort       | Depends On                |
| --- | ------------------------------------------ | ------------ | ------------------------- |
| 1   | Custom email domain (Resend)               | 30 min       | Client fournit le domaine |
| 2   | Ciblex shipping integration                | 1-2 semaines | API Ciblex                |
| 3   | Category SEO pages (`/category/proteines`) | 1 jour       | SEO basics done           |
| 4   | Admin dashboard upgrade (charts, alerts)   | 3-5 jours    | Spec 018                  |
| 5   | Animations & polish (Framer Motion)        | 2-3 jours    | Spec 019                  |
| 6   | Upsell/Cross-sell (produits similaires)    | 1-2 jours    | Spec 020                  |

---

### 🎨 UI OVERHAUL (Phase Séparée)

> **Stratégie**: Le look actuel est **acceptable** et le client est satisfait. L'amélioration UI sera une phase dédiée post-launch pour éviter de casser ce qui marche.

| #   | Amélioration                                 | Impact             |
| --- | -------------------------------------------- | ------------------ |
| 1   | Hero section redesign (animations, parallax) | Gros impact visuel |
| 2   | Product cards premium (hover effects, glass) | Look pro           |
| 3   | Page transitions (smooth routing)            | UX premium         |
| 4   | Micro-animations (boutons, toggle, loading)  | Feel premium       |
| 5   | Typography audit (tailles, poids, spacing)   | Lisibilité         |
| 6   | Color palette refinement                     | Cohérence          |
| 7   | Mobile UX polish                             | 60%+ du trafic     |

> [!TIP]
> **Comment je peux aider sur l'UI**: Je peux analyser chaque composant, comparer avec des templates premium, identifier les gaps spécifiques, et proposer des améliorations ciblées avec du code. Je peux aussi générer des mockups pour visualiser avant d'implémenter.

---

### 💰 REQUIRES CLIENT DECISION (From After-Meeting)

| #   | Decision            | Options                            | Impact             |
| --- | ------------------- | ---------------------------------- | ------------------ |
| 1   | Custom email domain | Client fournit `@dodonutrition.tn` | Emails pas en spam |
| 2   | Tracking pixels     | Meta, GA4, TikTok                  | Analytics & ads    |
| 3   | Online payment      | Flouci, Konnect, Click to Pay      | Revenue online     |
| 4   | ERP expansion       | Multi-location, invoices           | +4 semaines dev    |
| 5   | Admin roles         | Owner/Manager/Employee             | Accès équipe       |
| 6   | Mobile app          | PWA (1 jour) → Capacitor (2 sem)   | Client demande?    |

---

## ⚡ PERFORMANCE & CACHING STATUS

| Aspect                 | Status                   | Notes                                                  |
| ---------------------- | ------------------------ | ------------------------------------------------------ |
| **Sanity CDN**         | `useCdn: false` ✅       | Correct — Vercel SSR handles caching                   |
| **Cache Revalidation** | `revalidatePath` used ✅ | Pages refresh après mutations (orders, reviews)        |
| **Image Optimization** | Next.js Image ✅         | Auto-optimized via Vercel                              |
| **Rate Limiting**      | In-memory ✅             | Suffisant pour Vercel serverless (resets per instance) |
| **Memory Leaks**       | Aucun détecté ✅         | Rate limiter a auto-cleanup                            |
| **Bundle Size**        | Normal ✅                | Stripe removed (-150KB)                                |
| **Page-level caching** | Par défaut Next.js ⚠️    | Peut être optimisé plus tard avec ISR                  |

> [!NOTE]
> Pour le moment, la performance est **acceptable** pour le lancement. Les optimisations avancées (ISR, edge caching, Sanity CDN) seront pour la phase post-launch quand on aura du trafic réel à mesurer.

---

## 📁 Documents Reference

| Document                                                                                                                | Purpose            | Status         |
| ----------------------------------------------------------------------------------------------------------------------- | ------------------ | -------------- |
| [constitution.md](../constitution.md)                                                                                   | Project law        | ✅ Updated     |
| [ROADMAP.md](../ROADMAP.md)                                                                                             | Development phases | ✅ Updated     |
| [CHANGELOG.md](CHANGELOG.md)                                                                                            | Version history    | ✅ Updated     |
| [ISSUES_BACKLOG.md](../ISSUES_BACKLOG.md)                                                                               | Bugs & issues      | ✅ Updated     |
| [BEFORE-MEETING.md](BEFORE-MEETING.md)                                                                                  | Specs to create    | 🔄 Merged here |
| [AFTER-MEETING.md](AFTER-MEETING.md)                                                                                    | Client decisions   | 🔄 Merged here |
| [project_audit_report.md](../../.gemini/antigravity/brain/25f63274-e391-432e-ab14-f9d0bf088ec1/project_audit_report.md) | Full audit         | ✅ Done        |

---

**🎯 Bottom Line**: Deploy tawa. Test en staging. Kamel el développement ba3d el deployment. El UI overhaul = phase séparée quand le moment est bon.
