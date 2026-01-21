# Tasks: Product Schema Redesign (Feature 002)

## Implementation Checklist

- [ ] **1. Update field groups** in `productType.ts`

  - Change "Nutrition Info" → "Specifications"
  - Add "Storytelling" group
  - Rename "SEO" → "SEO (Optional)"

- [ ] **2. Delete `metaKeywords` field**

  - Remove the entire `defineField` block for `metaKeywords`

- [ ] **3. Upgrade `longDescription` to Portable Text**

  - Rename field to `content`
  - Change type from `text` to `array` with block types
  - Add styles: H2, H3, H4, blockquote
  - Add lists: bullet, number
  - Add marks: bold, italic, link
  - Add image block support

- [ ] **4. Reassign fields to new groups**

  - `unit` → specifications
  - `quantity` → specifications
  - `servings` → specifications
  - `flavors` → specifications
  - `benefits` → storytelling
  - `allergens` → storytelling
  - `certifications` → storytelling
  - `dosage` → storytelling

- [ ] **5. Regenerate TypeScript types**

  - Run `pnpm typegen`

- [ ] **6. Verify in Sanity Studio**
  - Start dev server: `npm run dev`
  - Navigate to `/studio`
  - Open a product and check all 7 tabs
  - Confirm `content` field shows rich text editor
  - Confirm `metaKeywords` is gone
