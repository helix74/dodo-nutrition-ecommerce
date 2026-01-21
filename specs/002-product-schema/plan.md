# Plan: Product Schema Redesign (Feature 002)

## Overview

Modify `sanity/schemaTypes/productType.ts` to reorganize fields, upgrade `longDescription` to Portable Text, and remove `metaKeywords`.

---

## Proposed Changes

### [MODIFY] [productType.ts](file:///C:/Users/Mohamed%20Ali%20Jardak/.gemini/antigravity/scratch/ecommerce-ai/sanity/schemaTypes/productType.ts)

#### 1. Update Field Groups

```diff
  groups: [
-   { name: "basic", title: "Basic Info", default: true },
-   { name: "nutrition", title: "Nutrition Info" },
-   { name: "pricing", title: "Pricing" },
-   { name: "media", title: "Media" },
-   { name: "inventory", title: "Inventory" },
-   { name: "seo", title: "SEO" },
+   { name: "basic", title: "Basic Info", default: true },
+   { name: "specifications", title: "Specifications" },
+   { name: "storytelling", title: "Storytelling" },
+   { name: "media", title: "Media" },
+   { name: "pricing", title: "Pricing" },
+   { name: "inventory", title: "Inventory" },
+   { name: "seo", title: "SEO (Optional)" },
  ],
```

#### 2. Rename `longDescription` → `content` (Portable Text)

```diff
- defineField({
-   name: "longDescription",
-   title: "Long Description (SEO)",
-   type: "text",
-   group: "basic",
-   rows: 10,
-   description: "Detailed description with benefits and usage",
- }),
+ defineField({
+   name: "content",
+   title: "Product Content (Rich Text)",
+   type: "array",
+   group: "storytelling",
+   of: [
+     {
+       type: "block",
+       styles: [
+         { title: "Normal", value: "normal" },
+         { title: "H2", value: "h2" },
+         { title: "H3", value: "h3" },
+         { title: "H4", value: "h4" },
+         { title: "Quote", value: "blockquote" },
+       ],
+       lists: [
+         { title: "Bullet", value: "bullet" },
+         { title: "Numbered", value: "number" },
+       ],
+       marks: {
+         decorators: [
+           { title: "Bold", value: "strong" },
+           { title: "Italic", value: "em" },
+         ],
+         annotations: [
+           {
+             name: "link",
+             type: "object",
+             title: "Link",
+             fields: [
+               { name: "href", type: "url", title: "URL" },
+             ],
+           },
+         ],
+       },
+     },
+     {
+       type: "image",
+       options: { hotspot: true },
+     },
+   ],
+   description: "Rich content for product page storytelling (headings, lists, images)",
+ }),
```

#### 3. Delete `metaKeywords`

```diff
- defineField({
-   name: "metaKeywords",
-   title: "Meta Keywords",
-   type: "string",
-   group: "seo",
-   description: "Comma-separated keywords",
- }),
```

#### 4. Reassign Field Groups

| Field            | Old Group | New Group      |
| ---------------- | --------- | -------------- |
| `unit`           | nutrition | specifications |
| `quantity`       | nutrition | specifications |
| `servings`       | nutrition | specifications |
| `flavors`        | nutrition | specifications |
| `benefits`       | nutrition | storytelling   |
| `allergens`      | nutrition | storytelling   |
| `certifications` | nutrition | storytelling   |
| `dosage`         | nutrition | storytelling   |

---

## Data Migration Notes

### `longDescription` → `content`

- **Existing data**: Current `longDescription` is plain text (from CSV import)
- **Migration strategy**: The old text data will be lost when field changes to Portable Text
- **Recommendation**: Since the data came from CSV and is mostly HTML strings, we'll handle this in a future data cleanup phase

### `metaKeywords`

- **Existing data**: Empty (never populated)
- **Impact**: None

---

## Verification Plan

### Manual Verification

1. Run `npm run dev` to start Next.js
2. Navigate to Sanity Studio (`/studio`)
3. Open an existing Product
4. Verify:
   - 7 tabs visible (Basic, Specifications, Storytelling, Media, Pricing, Inventory, SEO)
   - `content` field shows rich text editor
   - `metaKeywords` field is gone
   - All fields in correct groups

### Automated Tests

- Run `pnpm typegen` to regenerate TypeScript types
- Verify no build errors with `pnpm build`
