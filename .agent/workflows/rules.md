---
description: Règles et standards du projet Dodo Nutrition pour tous les agents
---

# 📋 DODO NUTRITION - PROJECT RULES

## 🎯 Vision

Créer le meilleur e-commerce de nutrition sportive en Tunisie avec une expérience utilisateur premium.

## 🌍 Contexte

- **Marché:** Tunisie
- **Langue principale:** Français + Darija tunisienne (pour headlines/CTA)
- **Devise:** TND (Dinar Tunisien)
- **Paiement:** Cash on Delivery (COD)
- **Livraison:** Ciblex

## 🎨 Design Rules

### Couleurs

```css
--dodo-yellow: #fee257; /* Primary - CTAs, highlights */
--dodo-red: #f01b24; /* Accent - Promos, alerts */
--background: #0a0a0a; /* Dark theme */
--foreground: #ffffff; /* Text */
```

### Theme

- **Dark Mode par défaut**
- Répartition: 70% noir, 20% jaune, 5% rouge, 5% blanc

### Typography

- Inter pour body
- Font-weight bold pour CTAs
- TND toujours après le montant (89.00 TND)

## 📝 Coding Standards

### TypeScript

```typescript
// Toujours typer explicitement
interface ProductProps {
  product: Product;
}

// Utiliser ?? pour defaults
const price = product.priceRetail ?? 0;
```

### Components

```tsx
// Naming: PascalCase
// Fichier: ComponentName.tsx
// Export named, pas default
export function ProductCard({ product }: ProductCardProps) { ... }
```

### Queries GROQ

```groq
// Projeter seulement les champs nécessaires
*[_type == "product"] {
  _id,
  name,
  "slug": slug.current,
  priceRetail,
  brand->{name, slug}
}
```

## 📁 File Organization

```
app/(app)/         → Pages publiques
app/(admin)/       → Pages admin
components/layout/ → Header, Footer, Nav
components/home/   → Sections page accueil
components/app/    → Composants généraux
components/ui/     → shadcn/ui
lib/actions/       → Server Actions
lib/sanity/        → Queries GROQ
docs/              → Documentation
```

## 🔀 Git Conventions

```bash
# Branches
feature/nom-feature
fix/bug-description
docs/update-name

# Commits
feat: add pack schema
fix: price formatting
docs: update architecture
```

## ⚠️ Important Notes

1. **Images:** Tout asset doit être optimisé (WEBP)
2. **Prix:** Toujours utiliser `priceRetail`, jamais `price`
3. **Stock:** Vérifier stock avant ajout panier
4. **SEO:** Chaque page doit avoir meta tags
5. **Mobile:** Tester sur mobile à chaque changement

## 🤖 AI Agent Rules

- Répondre en français ou darija selon le client
- Utiliser TND pour les prix
- Mentionner le stock
- Recommander des packs quand pertinent

## 📊 Performance Targets

- Lighthouse > 80
- LCP < 2.5s
- CLS < 0.1
- FID < 100ms
