# Project Constitution: Dodo Nutrition

> **The governing document for all development on this project.**  
> **Last Updated**: 2026-02-14

---

## 1. Core Principles

- **User First**: All decisions must prioritize the user experience.
- **Simplicity**: Prefer simple, readable code over complex abstractions.
- **Reliability**: Code must be robust and handle errors gracefully.
- **Documentation First**: All specs reference unified documentation.

---

## 2. Business Context

| Aspect       | Value                  |
| ------------ | ---------------------- |
| **Market**   | Tunisia (local)        |
| **Currency** | TND (Tunisian Dinar)   |
| **Payment**  | COD (Cash on Delivery) |
| **Shipping** | Ciblex                 |

---

## 3. Language & UX

| Language            | Usage                                |
| ------------------- | ------------------------------------ |
| **French**          | Main content, descriptions, forms    |
| **Tunisian Darija** | Headlines, slogans, CTAs, navigation |
| **Arabic Font**     | For Darija text elements             |

> **Goal**: 100% comprehensible experience for Tunisian users.

**Examples:**

- Hero headlines: Darija with Arabic font
- Navigation: French + some Darija
- Product descriptions: French
- CTAs: Darija for impact ("شري دوك" / "Chri Tawa")

---

## 4. Tech Stack

| Layer            | Technology    | Version/Notes             |
| ---------------- | ------------- | ------------------------- |
| **Framework**    | Next.js       | 16 (App Router)           |
| **Language**     | TypeScript    | Strict mode               |
| **CMS**          | Sanity        | v4                        |
| **Auth (Store)** | Clerk         | Customer sign-up/login    |
| **Auth (Admin)** | Custom JWT    | Username/password, `jose` |
| **AI**           | Vercel AI SDK | Groq (Llama)              |
| **Payment**      | COD Only      | No Stripe                 |
| **Styling**      | Tailwind CSS  | v4                        |
| **UI Library**   | Shadcn/UI     | 23+ components            |
| **State**        | Zustand       | Cart, Chat stores         |
| **Linting**      | Biome         | (No ESLint)               |

---

## 5. Design System

### Brand Colors

| Token           | Value     | Usage                |
| --------------- | --------- | -------------------- |
| `--dodo-yellow` | `#fee257` | Primary CTA, Accents |
| `--dodo-red`    | `#f01b24` | Destructive, Promo   |
| `--background`  | `#0a0a0a` | Dark theme base      |

### Typography

| Role   | Font                         |
| ------ | ---------------------------- |
| Sans   | Geist / Inter                |
| Mono   | Geist Mono                   |
| Arabic | Cairo / Tajawal (for Darija) |

### Theme

- **Default**: Dark mode
- **Ratio**: 70% dark, 20% yellow, 5% red, 5% white

---

## 6. Architecture

### File Structure

```
app/(app)/     → Customer routes
app/(admin)/   → Admin routes
components/    → React components
lib/           → Actions, AI, Store, Sanity
sanity/        → CMS schemas
docs/          → Documentation
specs/         → Feature specifications
```

---

## 7. Workflow Rules

1. **Docs First**: Before any spec, check `docs/` for current state.
2. **Spec-First**: No code without a plan in `specs/NNN-feature/`.
3. **Review Required**: All major changes need user approval.
4. **Document Changes**: Update `docs/` when architecture changes.

---

## 8. Documentation Index

| Document                                                                           | Purpose             |
| ---------------------------------------------------------------------------------- | ------------------- |
| [docs/ROADMAP.md](./docs/ROADMAP.md)                                               | Development roadmap |
| [docs/README.md](./docs/README.md)                                                 | Documentation hub   |
| [docs/03-architecture/system-context.md](./docs/03-architecture/system-context.md) | System architecture |
| [docs/database-schema.md](./docs/database-schema.md)                               | Sanity schemas      |
| [docs/CHANGELOG.md](./docs/CHANGELOG.md)                                           | Version history     |

---

**This document is the law. All development must follow it.**
