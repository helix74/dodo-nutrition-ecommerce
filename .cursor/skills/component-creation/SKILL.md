---
name: component-creation
description: Component creation guide for Dodo Nutrition. Use when creating new React components, pages, or UI elements. Covers file placement, naming, patterns, design system compliance, and testing.
---

# Component Creation Guide

## Directory Placement

| Type | Location | Example |
|------|----------|---------|
| Homepage section | `components/home/` | `HeroSection.tsx` |
| Shared app component | `components/app/` | `ProductCard.tsx` |
| Admin component | `components/admin/` | `StatCard.tsx` |
| Layout component | `components/layout/` | `Footer.tsx` |
| UI primitive (shadcn) | `components/ui/` | **DO NOT create — use CLI** |
| Skeleton/loading | `components/app/` | `ProductGridSkeleton.tsx` |
| Email template | `emails/components/` | `Layout.tsx` |

## Naming Conventions

- **PascalCase** for components: `ProductCard.tsx`
- **Named exports** (not default): `export function ProductCard() {}`
- **Client suffix** when paired with server page: `WishlistClient.tsx`
- **Skeleton suffix** for loading states: `ProductGridSkeleton.tsx`

## Component Template

```tsx
// Server Component (default)
import { cn } from "@/lib/utils";

interface ProductSectionProps {
  title: string;
  products: Product[];
  className?: string;
}

export function ProductSection({ title, products, className }: ProductSectionProps) {
  return (
    <section className={cn("py-12", className)}>
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      {/* content */}
    </section>
  );
}
```

```tsx
// Client Component
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function AddToCartButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);
  // ...
}
```

## Design System Checklist

- [ ] Uses Tailwind CSS classes (no inline styles)
- [ ] Uses CSS variables (`bg-background`, `text-foreground`, `border-border`)
- [ ] Uses `bg-dodo-yellow` for CTAs
- [ ] Uses shadcn components where applicable
- [ ] Dark theme compatible
- [ ] Responsive (mobile-first)
- [ ] Arabic text uses `font-cairo` class
- [ ] Prices formatted as `X.XX TND`

## Adding shadcn Components

```bash
npx shadcn@latest add [component-name]
```

NEVER create shadcn components manually. NEVER modify files in `components/ui/`.
