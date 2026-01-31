# ADR-001: Tech Stack Selection

**Status**: Accepted  
**Date**: 2026-01

---

## Context

Needed to select a modern tech stack for a Tunisian e-commerce platform that is:

- Fast to develop
- SEO-friendly
- Easy to maintain
- Suitable for a solo developer

## Decision

Selected the following stack:

| Layer     | Choice                  | Alternative Considered |
| --------- | ----------------------- | ---------------------- |
| Framework | Next.js 16 (App Router) | Remix, Nuxt            |
| Language  | TypeScript              | JavaScript             |
| CMS       | Sanity                  | Strapi, Contentful     |
| Auth      | Clerk                   | NextAuth, Supabase     |
| Styling   | Tailwind CSS            | Styled Components      |
| UI        | Shadcn/UI               | Chakra, MUI            |
| State     | Zustand                 | Redux, Jotai           |
| AI        | Vercel AI SDK + Groq    | OpenAI direct          |

## Consequences

### Positive

- Next.js provides excellent DX and performance
- TypeScript catches errors at compile time
- Sanity offers real-time preview and flexible schema
- Clerk handles auth complexity with minimal code
- Tailwind enables rapid UI development
- Zustand is simple for cart/chat state

### Negative

- Sanity has usage-based pricing at scale
- Clerk pricing for production
- Next.js App Router learning curve

---

# ADR-002: Cash on Delivery (COD) as Primary Payment

**Status**: Accepted  
**Date**: 2026-01

---

## Context

Tunisian market has limited card payment adoption. Most e-commerce relies on COD.

## Decision

Implement COD as the primary (and initially only) payment method.

## Consequences

### Positive

- Matches customer expectations
- No payment gateway complexity initially
- Higher conversion (customers trust COD)

### Negative

- Risk of order abandonment on delivery
- No upfront payment confirmation
- Manual reconciliation needed

---

# ADR-003: Dark Theme as Default

**Status**: Accepted  
**Date**: 2026-01

---

## Context

Brand positioning requires a premium, modern aesthetic.

## Decision

Implement dark theme as the only theme (no toggle).

Color Ratio: 70% dark, 20% yellow, 5% red, 5% white

## Consequences

### Positive

- Strong brand identity
- Modern, premium feel
- Reduced development complexity (one theme)
- Better for OLED screens

### Negative

- May not suit all users
- Harder to read in bright environments

---

# ADR-004: Sanity for Database (NoSQL)

**Status**: Accepted  
**Date**: 2026-01

---

## Context

Needed a flexible content management system that can also serve as the primary database.

## Decision

Use Sanity as both CMS and database for all data (products, orders, customers, reviews).

## Consequences

### Positive

- Single source of truth
- Real-time updates
- Flexible schema evolution
- Built-in Studio for content management
- GROQ query language is powerful

### Negative

- Not a traditional relational database
- No transactions (mitigated with careful design)
- Usage-based pricing at scale
- Document locking happens at document level

---

# ADR-005: Email-Based Admin Role

**Status**: Accepted  
**Date**: 2026-01

---

## Context

Needed a simple admin authorization system without complex role management.

## Decision

Use email whitelist via `ADMIN_EMAILS` environment variable.

## Consequences

### Positive

- Simple to implement and understand
- No database changes needed
- Easy to add/remove admins
- Works with any Clerk user

### Negative

- Requires env var update for changes
- Requires redeploy for admin changes
- No granular permissions (admin or not)

---

# ADR-006: Zustand for Client State

**Status**: Accepted  
**Date**: 2026-01

---

## Context

Needed client-side state management for cart, wishlist, and chat.

## Decision

Use Zustand with localStorage persistence.

## Consequences

### Positive

- Minimal boilerplate
- Built-in persistence
- Works without auth (guest cart)
- Simple DevTools integration

### Negative

- State not synced across devices
- No server-side cart (by design)
- Manual hydration handling needed
