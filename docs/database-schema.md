# 🗄️ DODO NUTRITION - Database Schema Reference

**Version:** 1.0  
**Date:** 01/01/2026  
**Agent:** DATABASE AGENT

---

## 📊 Schémas Sanity Complets

### 1. Brand (brandType.ts)

```typescript
// sanity/schemaTypes/brandType.ts
{
  name: 'brand',
  title: 'Marque',
  type: 'document',
  fields: [
    { name: 'name', type: 'string', validation: required },
    { name: 'slug', type: 'slug', source: 'name' },
    { name: 'logo', type: 'image', hotspot: true },
    { name: 'description', type: 'text' },
  ]
}
```

**Données actuelles:** 21 marques

```
Applied Nutrition, BPI Sports, Big Ramy Labs, Biotech USA,
DY Nutrition, Eric Favre, GSN, Gym Hub, Impact Nutrition,
Longevity Plus, Miravella, MuscleTech, Nutrex, Olimp,
OstroVit, Real Pharm, Rule 1, Scenit Nutrition,
V-Shape Supplements, William Bonac, Yava Labs
```

---

### 2. Category (categoryType.ts)

```typescript
// sanity/schemaTypes/categoryType.ts
{
  name: 'category',
  title: 'Catégorie',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', validation: required },
    { name: 'slug', type: 'slug', source: 'title' },
    { name: 'description', type: 'text' },
    { name: 'image', type: 'image' },
  ]
}
```

**Données actuelles:** 8 catégories
| Slug | Titre | Icône |
|------|-------|-------|
| proteines | Protéines | 🥛 |
| creatine | Créatine | 💪 |
| pre-workout | Pre-Workout | ⚡ |
| vitamines | Vitamines | 💊 |
| mineraux | Minéraux | 🧬 |
| bruleurs-de-graisse | Brûleurs de Graisse | 🔥 |
| boosters-hormonaux | Boosters Hormonaux | 🚀 |
| supplements | Suppléments | ✨ |

---

### 3. Product (productType.ts)

```typescript
// sanity/schemaTypes/productType.ts - ÉTAT ACTUEL
{
  name: 'product',
  title: 'Produit',
  type: 'document',
  fields: [
    // Identification
    { name: 'name', type: 'string', validation: required },
    { name: 'slug', type: 'slug', source: 'name' },

    // Relations
    { name: 'brand', type: 'reference', to: [{type: 'brand'}] },
    { name: 'category', type: 'reference', to: [{type: 'category'}] },

    // Contenu
    { name: 'description', type: 'text' },
    { name: 'longDescription', type: 'array', of: [{type: 'block'}] },

    // Médias
    { name: 'image', type: 'image' },
    { name: 'gallery', type: 'array', of: [{type: 'image'}] },

    // Spécifications
    { name: 'unit', type: 'string', options: { list: ['gramme', 'kilogramme', 'millilitre', 'litre', 'gélule', 'capsule', 'comprimé', 'scoop', 'sachet'] } },
    { name: 'quantity', type: 'number' },
    { name: 'servings', type: 'number' },
    { name: 'flavors', type: 'array', of: [{type: 'string'}] },

    // Nutrition
    { name: 'benefits', type: 'array', of: [{type: 'text'}] },
    { name: 'allergens', type: 'text' },
    { name: 'certifications', type: 'array', of: [{type: 'string'}] },
    { name: 'dosage', type: 'text' },

    // Prix (TND)
    { name: 'priceRetail', type: 'number', title: 'Prix de vente' },
    { name: 'pricePurchase', type: 'number', title: 'Prix d\'achat' },
    { name: 'priceWholesale', type: 'number', title: 'Prix gros' },
    { name: 'priceSlashed', type: 'number', title: 'Prix barré' },

    // Stock
    { name: 'stock', type: 'number' },
    { name: 'featured', type: 'boolean' },

    // SEO
    { name: 'metaTitle', type: 'string' },
    { name: 'metaKeywords', type: 'string' },
    { name: 'metaDescription', type: 'text' },
  ]
}
```

**Données actuelles:** 120 produits

**⚠️ CHAMPS MANQUANTS/INCOMPLETS:**
| Champ | Status | Action |
|-------|--------|--------|
| image | ❌ Vide | Importer depuis fichiers |
| gallery | ❌ Vide | Importer depuis fichiers |
| servings | ⚠️ Partiel | Enrichir données |
| flavors | ⚠️ Partiel | Enrichir données |
| benefits | ⚠️ Vide | Ajouter manuellement |
| allergens | ⚠️ Vide | Ajouter manuellement |
| certifications | ⚠️ Vide | Ajouter manuellement |
| dosage | ⚠️ Vide | Ajouter manuellement |
| priceRetail | ⚠️ Placeholder | Corriger avec vrais prix |
| metaTitle | ⚠️ Vide | Générer SEO |

---

### 4. Pack/Bundle (packType.ts) 🆕 À CRÉER

```typescript
// sanity/schemaTypes/packType.ts - À CRÉER
{
  name: 'pack',
  title: 'Pack / Bundle',
  type: 'document',
  icon: PackageIcon,
  fields: [
    // Identification
    {
      name: 'name',
      title: 'Nom du Pack',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      type: 'slug',
      source: 'name',
      validation: Rule => Rule.required()
    },

    // Contenu
    {
      name: 'description',
      title: 'Description',
      type: 'text'
    },
    {
      name: 'tagline',
      title: 'Slogan',
      type: 'string',
      description: 'Ex: "Pack Prise de Masse Ultime"'
    },

    // Médias
    {
      name: 'image',
      title: 'Image Principale',
      type: 'image',
      options: { hotspot: true }
    },

    // Produits inclus
    {
      name: 'products',
      title: 'Produits Inclus',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'product',
              type: 'reference',
              to: [{type: 'product'}]
            },
            {
              name: 'quantity',
              type: 'number',
              initialValue: 1
            },
          ]
        }
      ],
      validation: Rule => Rule.required().min(2)
    },

    // Prix
    {
      name: 'priceOriginal',
      title: 'Prix Total Séparé',
      type: 'number',
      description: 'Somme des prix individuels'
    },
    {
      name: 'priceBundle',
      title: 'Prix Pack',
      type: 'number',
      description: 'Prix réduit du bundle',
      validation: Rule => Rule.required()
    },

    // Options
    {
      name: 'featured',
      title: 'Pack Vedette',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'category',
      title: 'Type de Pack',
      type: 'string',
      options: {
        list: [
          { title: 'Prise de Masse', value: 'masse' },
          { title: 'Sèche / Définition', value: 'seche' },
          { title: 'Performance', value: 'performance' },
          { title: 'Débutant', value: 'debutant' },
          { title: 'Force', value: 'force' },
          { title: 'Endurance', value: 'endurance' },
        ]
      }
    },

    // Stock
    {
      name: 'stock',
      title: 'Stock',
      type: 'number',
      initialValue: 10
    },
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
      price: 'priceBundle'
    },
    prepare({ title, media, price }) {
      return {
        title,
        media,
        subtitle: price ? `${price} TND` : ''
      }
    }
  }
}
```

---

### 5. Order (orderType.ts) - EXISTANT

```typescript
// Schéma existant - Besoin d'ajuster pour COD
{
  name: 'order',
  fields: [
    { name: 'orderNumber', type: 'string' },
    { name: 'customer', type: 'reference', to: [{type: 'customer'}] },
    { name: 'items', type: 'array', of: [orderItem] },
    { name: 'total', type: 'number' },
    { name: 'status', type: 'string',
      options: { list: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] }
    },
    { name: 'paymentMethod', type: 'string', initialValue: 'cod' },
    { name: 'shippingAddress', type: 'object', fields: [...] },
    { name: 'trackingNumber', type: 'string' }, // Ciblex
    { name: 'createdAt', type: 'datetime' },
  ]
}
```

---

## 📥 Données à Importer

### Images Produits

```
Source: Fichiers utilisateur
Destination: Sanity Media Library
Format: WEBP préféré
Naming: [product-slug].webp
```

### Images Brands

```
Source: Fichiers utilisateur
Destination: Sanity Media Library ou /public/brands/
Format: PNG/SVG
Naming: [brand-slug].png
```

### Données Packs

```
À créer:
- Pack Prise de Masse (Whey + Créatine + BCAA)
- Pack Sèche (Brûleur + L-Carnitine + CLA)
- Pack Débutant (Whey + Multi-vitamines)
- Pack Force (Créatine + Pre-workout)
- Pack Performance (BCAA + Glutamine + Electrolytes)
```

---

## 🔧 Scripts Migration

### Script Import Images

```typescript
// scripts/import-images.ts - À CRÉER
// 1. Lire fichiers images local
// 2. Upload vers Sanity
// 3. Lier à produits par slug
```

### Script Enrichissement Produits

```typescript
// scripts/enrich-products.ts - À CRÉER
// 1. Ajouter servings calculées (quantity / serving_size)
// 2. Ajouter benefits génériques par catégorie
// 3. Générer meta tags SEO
```

---

**Document de référence pour DATABASE AGENT**
