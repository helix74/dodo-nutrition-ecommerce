# Plan: Product Page Redesign + Reviews (Feature 003)

## Overview

This plan covers three main components:

1. **Review Schema** - New Sanity document type
2. **Product Page Layout** - Accordion + Reviews + Related Products
3. **Review Submission** - Modal form with moderation

---

## Proposed Changes

### Component 1: Review Schema

#### [NEW] [reviewType.ts](file:///C:/Users/Mohamed%20Ali%20Jardak/.gemini/antigravity/scratch/ecommerce-ai/sanity/schemaTypes/reviewType.ts)

Create new Sanity schema for reviews:

```typescript
import { StarIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const reviewType = defineType({
  name: "review",
  title: "Review",
  type: "document",
  icon: StarIcon,
  fields: [
    defineField({
      name: "product",
      type: "reference",
      to: [{ type: "product" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "authorName",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "rating",
      type: "number",
      validation: (rule) => rule.required().min(1).max(5),
    }),
    defineField({
      name: "title",
      type: "string",
    }),
    defineField({
      name: "content",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "status",
      type: "string",
      initialValue: "pending",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Approved", value: "approved" },
          { title: "Rejected", value: "rejected" },
        ],
      },
    }),
    defineField({
      name: "verifiedPurchase",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "createdAt",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: "authorName",
      rating: "rating",
      product: "product.name",
      status: "status",
    },
    prepare({ title, rating, product, status }) {
      return {
        title: `${title} - ${"⭐".repeat(rating || 0)}`,
        subtitle: `${product} • ${status}`,
      };
    },
  },
});
```

#### [MODIFY] [index.ts](file:///C:/Users/Mohamed%20Ali%20Jardak/.gemini/antigravity/scratch/ecommerce-ai/sanity/schemaTypes/index.ts)

Add review type to schema exports.

---

### Component 2: GROQ Queries

#### [MODIFY] [products.ts](file:///C:/Users/Mohamed%20Ali%20Jardak/.gemini/antigravity/scratch/ecommerce-ai/lib/sanity/queries/products.ts)

Add queries for:

1. Product reviews (approved only)
2. Related products (same category)
3. Review submission

```typescript
// Get approved reviews for a product
export const PRODUCT_REVIEWS_QUERY = defineQuery(`*[
  _type == "review"
  && product._ref == $productId
  && status == "approved"
] | order(createdAt desc) [0...10] {
  _id,
  authorName,
  rating,
  title,
  content,
  verifiedPurchase,
  createdAt
}`);

// Get average rating for a product
export const PRODUCT_RATING_QUERY = defineQuery(`{
  "average": math::avg(*[
    _type == "review"
    && product._ref == $productId
    && status == "approved"
  ].rating),
  "count": count(*[
    _type == "review"
    && product._ref == $productId
    && status == "approved"
  ])
}`);

// Get related products (same category, exclude current)
export const RELATED_PRODUCTS_QUERY = defineQuery(`*[
  _type == "product"
  && category._ref == $categoryId
  && _id != $productId
  && stock > 0
] | order(featured desc, name asc) [0...4] {
  _id,
  name,
  "slug": slug.current,
  priceRetail,
  priceSlashed,
  "image": images[0]{
    asset->{
      _id,
      url
    }
  },
  brand->{name}
}`);
```

---

### Component 3: UI Components

#### [NEW] [ProductAccordion.tsx](file:///C:/Users/Mohamed%20Ali%20Jardak/.gemini/antigravity/scratch/ecommerce-ai/components/app/ProductAccordion.tsx)

Accordion component using Shadcn/Radix:

```tsx
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PortableText } from "next-sanity";

interface ProductAccordionProps {
  content: any; // Portable Text
  benefits: string[] | null;
  dosage: string | null;
  allergens: string | null;
  certifications: string[] | null;
}

export function ProductAccordion({
  content,
  benefits,
  dosage,
  allergens,
  certifications,
}: ProductAccordionProps) {
  return (
    <Accordion type="single" defaultValue="description" collapsible>
      {/* Description - Open by default */}
      {content && content.length > 0 && (
        <AccordionItem value="description">
          <AccordionTrigger>Description</AccordionTrigger>
          <AccordionContent>
            <div className="prose prose-zinc dark:prose-invert">
              <PortableText value={content} />
            </div>
          </AccordionContent>
        </AccordionItem>
      )}

      {/* Benefits */}
      {benefits && benefits.length > 0 && (
        <AccordionItem value="benefits">
          <AccordionTrigger>Bénéfices Clés</AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-2">
              {benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  {b}
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      )}

      {/* Mode d'Emploi */}
      {dosage && (
        <AccordionItem value="dosage">
          <AccordionTrigger>Mode d'Emploi</AccordionTrigger>
          <AccordionContent>
            <p>{dosage}</p>
          </AccordionContent>
        </AccordionItem>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <AccordionItem value="certifications">
          <AccordionTrigger>Certifications & Garantie</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-wrap gap-2">
              {certifications.map((c, i) => (
                <Badge key={i} variant="outline">
                  {c}
                </Badge>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  );
}
```

#### [NEW] [ProductReviews.tsx](file:///C:/Users/Mohamed%20Ali%20Jardak/.gemini/antigravity/scratch/ecommerce-ai/components/app/ProductReviews.tsx)

Reviews display + submission modal.

#### [NEW] [RelatedProducts.tsx](file:///C:/Users/Mohamed%20Ali%20Jardak/.gemini/antigravity/scratch/ecommerce-ai/components/app/RelatedProducts.tsx)

Carousel of related products.

#### [MODIFY] [page.tsx](<file:///C:/Users/Mohamed%20Ali%20Jardak/.gemini/antigravity/scratch/ecommerce-ai/app/(app)/products/[slug]/page.tsx>)

Update product page layout to use new components.

---

### Component 4: Server Actions

#### [NEW] [reviews.ts](file:///C:/Users/Mohamed%20Ali%20Jardak/.gemini/antigravity/scratch/ecommerce-ai/lib/actions/reviews.ts)

Server action to submit a review:

```typescript
"use server";

import { sanityClient } from "@/sanity/lib/client";

export async function submitReview(data: {
  productId: string;
  authorName: string;
  rating: number;
  title?: string;
  content?: string;
}) {
  const review = await sanityClient.create({
    _type: "review",
    product: { _type: "reference", _ref: data.productId },
    authorName: data.authorName,
    rating: data.rating,
    title: data.title,
    content: data.content,
    status: "pending",
    verifiedPurchase: false, // TODO: Check if user purchased
    createdAt: new Date().toISOString(),
  });

  return { success: true, id: review._id };
}
```

---

## File Summary

| Action | File                                  | Description                |
| ------ | ------------------------------------- | -------------------------- |
| NEW    | `sanity/schemaTypes/reviewType.ts`    | Review document schema     |
| MODIFY | `sanity/schemaTypes/index.ts`         | Export review type         |
| MODIFY | `lib/sanity/queries/products.ts`      | Add review/related queries |
| NEW    | `components/app/ProductAccordion.tsx` | Accordion sections         |
| NEW    | `components/app/ProductReviews.tsx`   | Reviews display + form     |
| NEW    | `components/app/RelatedProducts.tsx`  | Product carousel           |
| MODIFY | `app/(app)/products/[slug]/page.tsx`  | New layout structure       |
| NEW    | `lib/actions/reviews.ts`              | Submit review action       |

---

## Verification Plan

### Manual Verification

1. Open product page - verify accordion layout
2. Click each accordion section - verify content displays
3. Submit a review - verify it appears in Sanity Studio as "pending"
4. Approve review in Studio - verify it appears on product page
5. Check related products carousel works
6. Test on mobile - verify touch interactions

### Automated Checks

- `pnpm typegen` - regenerate types
- `pnpm build` - verify no build errors
