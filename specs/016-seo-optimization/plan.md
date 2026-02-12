# Implementation Plan: SEO Optimization

---

## Proposed Changes

### Phase 1: Dynamic Meta Tags

#### [MODIFY] [page.tsx](<file:///c:/Users/Mohamed%20Ali%20Jardak/.gemini/antigravity/ecommerce-ai/app/(app)/products/[slug]/page.tsx>)

- Add `generateMetadata` function
- Use product name, description, metaTitle, metaDescription
- Add Open Graph tags

---

### Phase 2: JSON-LD Structured Data

#### [NEW] [JsonLd.tsx](file:///c:/Users/Mohamed%20Ali%20Jardak/.gemini/antigravity/ecommerce-ai/components/seo/JsonLd.tsx)

- Reusable JSON-LD component
- Product schema
- Organization schema
- BreadcrumbList schema

#### [MODIFY] [page.tsx](<file:///c:/Users/Mohamed%20Ali%20Jardak/.gemini/antigravity/ecommerce-ai/app/(app)/products/[slug]/page.tsx>)

- Add ProductJsonLd component

#### [MODIFY] [layout.tsx](<file:///c:/Users/Mohamed%20Ali%20Jardak/.gemini/antigravity/ecommerce-ai/app/(app)/layout.tsx>)

- Add OrganizationJsonLd in root layout

---

### Phase 3: Sitemap & Robots

#### [NEW] [sitemap.ts](file:///c:/Users/Mohamed%20Ali%20Jardak/.gemini/antigravity/ecommerce-ai/app/sitemap.ts)

- Auto-generate sitemap with all products, categories, packs
- Set proper changeFrequency and priority

#### [MODIFY] [robots.ts](file:///c:/Users/Mohamed%20Ali%20Jardak/.gemini/antigravity/ecommerce-ai/app/robots.ts)

- Proper crawl rules
- Reference sitemap

---

## Verification Plan

### Automated

```bash
# TypeScript check
pnpm exec tsc --noEmit

# Build verification
pnpm build
```

### Manual Testing

1. **Meta Tags**:
   - Open product page in browser
   - View page source, check `<title>` and `<meta name="description">`
   - Verify they match product data

2. **JSON-LD**:
   - View page source
   - Search for `application/ld+json`
   - Validate at schema.org/docs/validator

3. **Sitemap**:
   - Visit http://localhost:3000/sitemap.xml
   - Verify XML is valid and contains products

4. **Open Graph**:
   - Use Facebook Sharing Debugger or similar tool
   - Verify preview shows product image and title

---

## Estimated Effort

| Phase     | Time    |
| --------- | ------- |
| Meta Tags | 20 min  |
| JSON-LD   | 30 min  |
| Sitemap   | 15 min  |
| **Total** | ~1 hour |
