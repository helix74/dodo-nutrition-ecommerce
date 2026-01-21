# Specification: Product Page Redesign + Reviews (Feature 003)

## Goal

Redesign the product page with:

1. **Accordion layout** for organized, mobile-friendly content
2. **Reviews system** for social proof and conversions
3. **Related products** section for cross-selling

---

## User Stories

- **As a Customer**, I want to see product info in collapsible sections so I can find what I need quickly on mobile.
- **As a Customer**, I want to read reviews from other buyers so I can trust the product.
- **As a Customer**, I want to leave a review after purchase so others can benefit.
- **As an Admin**, I want to moderate reviews before they go live so I can filter spam/inappropriate content.
- **As an Admin**, I want reviews to boost SEO so the product ranks higher on Google.

---

## Proposed Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  HERO SECTION (Compact)                                         │
│  ┌──────────────────────┬────────────────────────────────────┐  │
│  │  Product Image       │  Brand • Category                   │  │
│  │  (Gallery)           │  PRODUCT NAME (H1)                  │  │
│  │                      │  500g • 50 portions                 │  │
│  │                      │  ⭐⭐⭐⭐⭐ 4.8 (12 avis)          │  │
│  │                      │  89 TND  119 TND  -25%              │  │
│  │                      │  Flavor selector                    │  │
│  │                      │  [ ADD TO CART ]   Stock badge      │  │
│  └──────────────────────┴────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  ACCORDION SECTIONS (Full Width)                                │
│                                                                 │
│  [−] Description                    ← Open by default           │
│      (Rich text content from Sanity)                            │
│                                                                 │
│  [+] Bénéfices Clés                 ← Collapsed                 │
│                                                                 │
│  [+] Composition & Ingrédients      ← Collapsed                 │
│                                                                 │
│  [+] Mode d'Emploi                  ← Collapsed                 │
│                                                                 │
│  [+] Certifications & Garantie      ← Collapsed                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  REVIEWS SECTION (Always Visible)                               │
│                                                                 │
│  ⭐⭐⭐⭐⭐ 4.8/5 basé sur 12 avis                             │
│                                                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│  │ Review 1    │ │ Review 2    │ │ Review 3    │               │
│  │ ⭐⭐⭐⭐⭐  │ │ ⭐⭐⭐⭐    │ │ ⭐⭐⭐⭐⭐  │               │
│  │ "Excellent" │ │ "Good pump" │ │ "Best pre"  │               │
│  │ - Ahmed     │ │ - Sami      │ │ - Youssef   │               │
│  └─────────────┘ └─────────────┘ └─────────────┘               │
│                                                                 │
│  [ Laisser un avis ]   (opens modal)                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  RELATED PRODUCTS (Carousel)                                    │
│  "Produits similaires"                                          │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐                                  │
│  │Prod│ │Prod│ │Prod│ │Prod│  →                                │
│  └────┘ └────┘ └────┘ └────┘                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Review System Design

### Review Schema (Sanity)

```typescript
{
  name: "review",
  type: "document",
  fields: [
    { name: "product", type: "reference", to: "product" },
    { name: "customer", type: "reference", to: "customer" }, // optional
    { name: "authorName", type: "string" },  // for non-logged-in users
    { name: "rating", type: "number", min: 1, max: 5 },
    { name: "title", type: "string" },
    { name: "content", type: "text" },
    { name: "status", type: "string", options: ["pending", "approved", "rejected"] },
    { name: "createdAt", type: "datetime" },
    { name: "verifiedPurchase", type: "boolean" },
  ]
}
```

### Review Flow

1. Customer clicks "Laisser un avis"
2. Modal opens with rating (stars) + title + comment
3. If logged in: auto-fill name, mark as verified purchase if they bought it
4. If not logged in: require name field
5. Review saved with status = "pending"
6. Admin approves/rejects in Sanity Studio
7. Only "approved" reviews show on product page

### SEO for Reviews

- Reviews are server-rendered (SSR)
- Add JSON-LD structured data for Google rich snippets
- Average rating shown in search results

---

## Accordion Implementation

Use Radix UI Accordion (already available via Shadcn):

```tsx
<Accordion type="single" defaultValue="description" collapsible>
  <AccordionItem value="description">
    <AccordionTrigger>Description</AccordionTrigger>
    <AccordionContent>
      <PortableText value={product.content} />
    </AccordionContent>
  </AccordionItem>
  <!-- More items... -->
</Accordion>
```

**SEO Note:** All accordion content is rendered in HTML (not hidden via JS). Google can index everything.

---

## Success Criteria

- [ ] Product page uses accordion layout
- [ ] All 5 accordion sections working (Description, Benefits, Composition, Mode d'Emploi, Certifications)
- [ ] Reviews section displays approved reviews
- [ ] Average rating calculated and displayed
- [ ] "Leave a review" modal works
- [ ] Reviews saved to Sanity with pending status
- [ ] Admin can approve/reject reviews in Studio
- [ ] Related products carousel shows 4 similar products
- [ ] Mobile responsive (accordions work on touch)
- [ ] SEO: JSON-LD structured data for reviews

---

## Out of Scope (Future)

- Email notification when review is approved
- Review photos/images
- Review helpfulness voting ("Was this helpful?")
- Blog posts related to product
