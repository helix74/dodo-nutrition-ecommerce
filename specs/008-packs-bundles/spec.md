# Feature 008: Packs & Bundles

> **Status**: 📋 Specification
> **Priority**: 🟠 High
> **Estimated Effort**: 1-2 days

---

## Problem Statement

Dodo Nutrition currently sells individual products, but customers often want to buy curated bundles for specific goals (e.g., "Muscle Gain Starter Pack", "Cutting Essentials"). Without a bundle system:

- Customers must manually find and add complementary products.
- The store misses upsell opportunities with discounted combos.
- There's no way to feature goal-oriented product groupings.

---

## Goals

1. **Create a `pack` document type in Sanity** to define product bundles.
2. **Display packs in the shop** alongside individual products.
3. **Allow adding entire packs to cart** as a single item (with expandable contents).
4. **Show savings** compared to buying products individually.

---

## Non-Goals (Out of Scope for v1)

- Pack variants (e.g., different sizes).
- Custom pack builder (user picks products).
- Subscription packs.
- Pack-specific reviews.

---

## Proposed Schema: `packType.ts`

Based on the design in `docs/database-schema.md`:

```typescript
{
  name: 'pack',
  title: 'Pack / Bundle',
  type: 'document',
  icon: PackageIcon,
  fields: [
    // Identification
    { name: 'name', type: 'string', title: 'Nom du Pack', validation: Rule => Rule.required() },
    { name: 'slug', type: 'slug', source: 'name', validation: Rule => Rule.required() },

    // Content
    { name: 'description', type: 'text', title: 'Description' },
    { name: 'tagline', type: 'string', title: 'Slogan', description: 'Ex: "Pack Prise de Masse Ultime"' },

    // Media
    { name: 'image', type: 'image', title: 'Image Principale', options: { hotspot: true } },

    // Products Included (min 2)
    {
      name: 'products',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'product', type: 'reference', to: [{ type: 'product' }] },
          { name: 'quantity', type: 'number', initialValue: 1 },
        ]
      }],
      validation: Rule => Rule.required().min(2)
    },

    // Pricing
    { name: 'priceOriginal', type: 'number', title: 'Prix Total Séparé', description: 'Somme des prix individuels' },
    { name: 'priceBundle', type: 'number', title: 'Prix Pack', validation: Rule => Rule.required() },

    // Options
    { name: 'featured', type: 'boolean', title: 'Pack Vedette', initialValue: false },
    {
      name: 'category',
      type: 'string',
      title: 'Type de Pack',
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
    { name: 'stock', type: 'number', title: 'Stock', initialValue: 10 },
  ]
}
```

---

## UI Requirements

### Shop Page (`/shop`)

1. Add a "Packs" filter option to show only packs.
2. Display packs in the product grid with a "PACK" badge.
3. Show savings (e.g., "Économisez 15%").

### Pack Detail Page (`/packs/[slug]`)

1. Hero section with pack image, name, tagline.
2. List of included products with quantities.
3. Comparison: "Prix séparé: 150 TND → Prix Pack: 120 TND".
4. "Ajouter le Pack au Panier" button.

### Cart

1. Pack appears as a single line item.
2. Expandable to show included products.
3. Cannot modify individual product quantities within a pack.

---

## Success Criteria

- [ ] `packType.ts` schema created and registered.
- [ ] GROQ queries for fetching packs implemented.
- [ ] Packs visible in Sanity Studio.
- [ ] Packs displayed in shop grid.
- [ ] Pack detail page functional.
- [ ] "Add Pack to Cart" functional.
- [ ] Build passes (`pnpm build`).

---

## Dependencies

- `productType.ts` (existing) - for product references.
- `zustand` cart store - for adding packs.

---

## Open Questions

1. Should packs have their own URL path (`/packs/[slug]`) or reuse products (`/products/[slug]`)?
   - **Recommendation**: Separate path `/packs/[slug]` for clarity.
2. How should "out of stock" logic work if one product in the pack is unavailable?
   - **Recommendation**: Show pack as unavailable if any product is out of stock.
