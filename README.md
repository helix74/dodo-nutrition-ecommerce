# 🦤 Dodo Nutrition

> **E-commerce de nutrition sportive pour le marché tunisien**

---

## À propos

Dodo Nutrition est une plateforme e-commerce B2C spécialisée dans les compléments alimentaires et la nutrition sportive, conçue pour le marché tunisien.

### Caractéristiques

- 🛒 Catalogue produits avec 120+ références
- 🤖 Assistant shopping IA (Claude)
- 💳 Paiement à la livraison (COD)
- 📦 Livraison via Ciblex
- 🌙 Thème sombre premium
- 🇹🇳 Expérience 100% tunisienne (Français + Darija)

---

## Tech Stack

| Couche   | Technologie             |
| -------- | ----------------------- |
| Frontend | Next.js 16 (App Router) |
| CMS      | Sanity.io v4            |
| Auth     | Clerk                   |
| State    | Zustand                 |
| Style    | Tailwind CSS v4         |
| AI       | Vercel AI SDK + Claude  |

---

## Structure du Projet

```
app/
├── (app)/           → Routes client (shop, checkout, orders)
├── (admin)/         → Dashboard admin
└── api/             → API routes

components/
├── app/             → Composants métier
├── layout/          → Header, Footer, Nav
└── ui/              → shadcn/ui

lib/
├── actions/         → Server Actions
├── ai/              → Shopping Agent
├── sanity/          → Queries GROQ
└── store/           → Zustand stores

sanity/
└── schemaTypes/     → Schemas CMS

docs/                → Documentation
specs/               → Spécifications features
```

---

## Installation

```bash
# Cloner et installer
git clone <repo>
cd ecommerce-ai
pnpm install

# Configuration
cp .env.example .env.local
# Remplir les variables d'environnement

# Développement
pnpm dev
```

### Variables d'Environnement

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_WRITE_TOKEN=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# AI
ANTHROPIC_API_KEY=
```

---

## Documentation

| Document                             | Description             |
| ------------------------------------ | ----------------------- |
| [constitution.md](./constitution.md) | Règles du projet        |
| [ROADMAP.md](./ROADMAP.md)           | Phases de développement |
| [docs/](./docs/README.md)            | Hub documentation       |

---

## Scripts

```bash
pnpm dev        # Développement
pnpm build      # Build production
pnpm typegen    # Générer types Sanity
pnpm typecheck  # Vérification TypeScript
```

---

## Licence

Propriétaire - Dodo Nutrition © 2026
