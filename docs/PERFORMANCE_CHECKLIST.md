# Performance Checklist — Dodo Nutrition

> Last updated: 2026-02-18

---

## Core Web Vitals Targets

| Metric | Target | Description |
|--------|--------|-------------|
| **LCP** (Largest Contentful Paint) | < 2.5s | Time until the largest visible element renders |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Visual stability during page load |
| **INP** (Interaction to Next Paint) | < 200ms | Responsiveness to user interactions |

---

## 1. Image Optimization

### Current Setup

- [x] Next.js `<Image>` component used throughout
- [x] Sanity image URL builder with dimension parameters
- [x] `priority` prop on hero/above-the-fold images
- [x] `hotspot: true` on all Sanity image schemas

### Checklist

- [ ] Ensure all images use WebP format via Sanity URL builder (`?fm=webp`)
- [ ] Add `sizes` prop to all `<Image>` components for correct responsive loading
- [ ] Verify lazy loading (`loading="lazy"`) on below-the-fold images
- [ ] Audit image dimensions: avoid serving images larger than display size
- [ ] Consider using `blur` placeholder for better perceived performance

### Example — Optimized Sanity Image

```tsx
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

<Image
  src={urlFor(image).width(800).height(800).format("webp").url()}
  alt={alt}
  width={800}
  height={800}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  loading="lazy"
  className="object-cover"
/>
```

---

## 2. Bundle Analysis

### Setup `@next/bundle-analyzer`

```bash
pnpm add -D @next/bundle-analyzer
```

```ts
// next.config.ts
import withBundleAnalyzer from "@next/bundle-analyzer";

const config = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})({
  // existing config...
});

export default config;
```

```bash
ANALYZE=true pnpm build
```

### Known Heavy Dependencies

| Package | Size Estimate | Notes |
|---------|---------------|-------|
| `sanity` | ~2MB | Studio only — ensure tree-shaken from storefront |
| `recharts` | ~500KB | Admin dashboard only — dynamic import |
| `framer-motion` | ~150KB | Used for animations — consider `motion/react` lite |
| `@clerk/nextjs` | ~200KB | Auth — loaded on all pages |
| `ai` / `@ai-sdk/*` | ~100KB | Chat feature — loaded on demand via ChatSheet |

### Recommendations

- [ ] Run bundle analysis and document top 10 largest modules
- [ ] Ensure Sanity Studio is not included in storefront bundle
- [ ] Dynamic import `recharts` in admin pages
- [ ] Dynamic import `ChatSheet` component
- [ ] Verify `framer-motion` is tree-shaken (only import used features)

---

## 3. Data Fetching & Caching

### Current Architecture

- [x] Homepage: 10 parallel queries via `Promise.all`
- [x] `sanityFetch()` with built-in SanityLive caching
- [x] Server Components by default (minimal client JS)
- [x] React Compiler enabled via `babel-plugin-react-compiler`

### Checklist

- [ ] Verify no data fetching waterfalls (sequential queries that could be parallel)
- [ ] Add `Suspense` boundaries for streaming on heavy pages
- [ ] Use skeleton components for loading states
- [ ] Consider ISR (Incremental Static Regeneration) for product pages
- [ ] Verify Sanity CDN is used for read queries (`useCdn: true`)

---

## 4. JavaScript Optimization

### Current Setup

- [x] React Compiler enabled (automatic memoization)
- [x] Turbopack for development
- [x] Server Components minimize client-side JS

### Checklist

- [ ] Audit `"use client"` directives — move logic to server where possible
- [ ] Ensure heavy client components use `dynamic()` with `ssr: false` when appropriate
- [ ] Minimize third-party scripts (tracking pixels loaded conditionally)
- [ ] Verify no unused dependencies in `package.json`

---

## 5. Font Optimization

### Current Fonts

| Font | Purpose | Loading |
|------|---------|---------|
| Geist / Inter | UI text | `next/font` (self-hosted) |
| Geist Mono | Prices, code | `next/font` (self-hosted) |
| Cairo | Arabic/Darija text | Google Fonts |

### Checklist

- [ ] Ensure `font-display: swap` on all fonts
- [ ] Preload critical fonts
- [ ] Subset Cairo font to Arabic + Latin characters only
- [ ] Verify no layout shift from font loading (CLS impact)

---

## 6. Network & Caching

### Checklist

- [ ] Configure `Cache-Control` headers for static assets
- [ ] Ensure Vercel edge caching is active
- [ ] Add `stale-while-revalidate` for API responses where appropriate
- [ ] Verify Sanity webhook invalidation works correctly with SanityLive
- [ ] Consider service worker for offline product browsing

---

## 7. Monitoring

### Recommended Tools

| Tool | Purpose | Priority |
|------|---------|----------|
| **Vercel Analytics** | Real User Metrics (RUM) | High |
| **Vercel Speed Insights** | Core Web Vitals monitoring | High |
| **Lighthouse CI** | Automated performance testing in CI | Medium |
| **Sentry** | Error tracking + performance monitoring | Medium |

### Setup Vercel Analytics

```bash
pnpm add @vercel/analytics @vercel/speed-insights
```

```tsx
// app/layout.tsx
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

---

## Quick Wins

1. **Add `sizes` prop** to all `<Image>` components (biggest CLS improvement)
2. **Dynamic import** heavy components (recharts, ChatSheet)
3. **Preconnect** to Sanity CDN: `<link rel="preconnect" href="https://cdn.sanity.io" />`
4. **Enable Vercel Speed Insights** for real-world metrics
5. **Subset Arabic font** to reduce font file size
