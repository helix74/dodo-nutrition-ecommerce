# Changelog

> **Project**: Dodo Nutrition  
> **Format**: Based on [Keep a Changelog](https://keepachangelog.com/)

---

## [1.1.0] - 2026-02-12 — Security Audit & Cleanup

### Added

- Rate limiting on `/api/chat` (10 req/min per IP)
- Rate limiting on review submissions (3/hour per user)
- Rate limiting on `/api/admin/insights` (5/min)
- Security headers in `next.config.ts` (X-Frame-Options, HSTS, CSP-lite, etc.)
- Shared rate limiter utility (`lib/rate-limit.ts`)
- Missing spec files (spec.md, plan.md, verification.md) for specs 012-016

### Changed

- **BREAKING**: Renamed `proxy.ts` → `middleware.ts` (fixes Next.js route protection)
- **BREAKING**: Removed Stripe entirely (COD-only project)
- Guest checkout now allowed (removed `/checkout` from protected routes)
- `reviews.ts` now uses Zod validation instead of manual checks
- `orders.ts` now validates status with Zod `OrderStatusSchema`
- Chat API error responses now generic (no internal details leak)
- Package name: `ecommerce-dec-build-sanity-appsdk-clerk` → `dodo-nutrition`
- Updated `constitution.md` with correct AI stack and rules path
- Standardized all spec file naming (`tasks.md`, `verification.md`)

### Removed

- `lib/actions/customer.ts` (Stripe customer sync)
- `components/app/CheckoutButton.tsx` (Stripe checkout button)
- `app/api/webhooks/stripe/route.ts` (Stripe webhook handler)
- `root_agent.yaml` (boilerplate file)
- `stripe` package dependency
- Stripe env vars from `.env.example`

### Fixed

- Middleware now properly named for Next.js recognition
- Guest checkout works (was blocked by middleware)
- Checkout no longer crashes without `STRIPE_SECRET_KEY`

---

## [Unreleased]

### Added

- Comprehensive documentation suite
- Zod validation schemas
- Admin authentication system

### Changed

- Stock updates now use atomic transactions
- Middleware protects admin routes

### Removed

- Debug test files from root

---

## [1.0.0] - 2026-01-31

### Features Complete

- ✅ Product catalog with categories and brands
- ✅ Shopping cart with persistence
- ✅ COD checkout with validation
- ✅ Order history and tracking
- ✅ Wishlist functionality
- ✅ AI shopping assistant
- ✅ Review submission and moderation
- ✅ Product bundles (packs)
- ✅ Admin dashboard with AI insights
- ✅ Order management system
- ✅ Inventory management
- ✅ Email notifications
- ✅ Mega menu navigation

### Security

- ✅ Admin route protection
- ✅ Role-based authorization
- ✅ Input validation (Zod)
- ✅ Atomic stock operations

### Infrastructure

- ✅ Clerk authentication
- ✅ Sanity CMS integration
- ✅ Groq AI integration
- ✅ Resend email service
- ✅ Vercel deployment ready

---

## Development History

### Phase 1: Foundation

- Project setup with Next.js 16
- Sanity CMS configuration
- Clerk authentication

### Phase 2: Core E-commerce

- Product catalog
- Shopping cart
- Basic checkout

### Phase 3: COD & Orders

- COD checkout flow
- Order management
- Email notifications

### Phase 4: Admin & AI

- Admin dashboard
- AI insights
- Review moderation

### Phase 5: Quality & Security

- Security audit
- Documentation
- Code cleanup
