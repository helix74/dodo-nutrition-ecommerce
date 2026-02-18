# Changelog

> **Project**: Dodo Nutrition  
> **Format**: Based on [Keep a Changelog](https://keepachangelog.com/)

---

## [1.4.0] - 2026-02-16 — Pre-Launch Feature Complete (Specs 020–029)

### Added — Admin Analytics & BI (Spec 022)

- Revenue chart component (`RevenueChart`) — 30-day revenue trend
- Order status distribution chart (`OrderStatusChart`)
- Orders by gouvernorat chart (`OrdersByCity`)
- Enhanced KPIs widget (`EnhancedKPIs`) — avg order value, low stock count, top category, cancellation rate
- Charts section with parallel data fetching (`ChartsSection`)
- Admin analytics server actions (`lib/actions/admin-analytics.ts`)

### Added — Admin Pre-ERP MVP (Spec 023)

- Supplier management page (`/admin/suppliers`) + `supplierType` Sanity schema
- Invoice management page (`/admin/invoices`) + `invoiceType` Sanity schema
- Low stock dashboard widget (`LowStockDashboardWidget`) with product links
- Low stock badge component (`LowStockBadge`) on inventory rows
- Shipping status component (`ShippingStatus`) for order details
- GROQ queries for suppliers (`lib/sanity/queries/suppliers.ts`) and invoices (`lib/sanity/queries/invoices.ts`)
- Sanity schema types now total 11 (added `supplier`, `invoice`)

### Added — Tracking Integration (Spec 024)

- Google Analytics 4 component (`components/tracking/GoogleAnalytics.tsx`)
- Meta Pixel component (`components/tracking/MetaPixel.tsx`)
- Meta Conversions API server-side tracking (`lib/tracking/meta-capi.ts`)
- Unified tracking event system (`lib/tracking/events.ts`) — ViewContent, AddToCart, Purchase, InitiateCheckout
- `TrackViewContent` component for product page view tracking

### Added — Ciblex Delivery Integration (Spec 025)

- Ciblex API client (`lib/shipping/ciblex.ts`) — create shipments, track status, cancel
- Gouvernorat-based zone pricing and delivery estimates (`lib/shipping/gouvernorats.ts`)
- Shipping server actions (`lib/actions/shipping.ts`)
- Admin shipping sync API route (`/api/admin/shipping/sync`)

### Added — SEO & Discovery (Spec 026)

- JSON-LD structured data component (`components/seo/JsonLd.tsx`) — Product, Organization, BreadcrumbList schemas
- Dynamic sitemap.xml generation (`app/sitemap.ts`) — products, categories, brands
- Open Graph and Twitter Card meta tags on all public pages

### Added — Pre-Launch Features (Spec 027)

- Cart upsell/cross-sell component (`components/app/CartUpsell.tsx`) + API route (`/api/cart-upsell`)
- Packs client with filtering and sorting (`components/app/PacksClient.tsx`)
- Brand detail pages (`/brands/[slug]`)
- Category detail pages (`/categories/[slug]`)
- Framer Motion animation components (`components/ui/motion.tsx`) — FadeIn, SlideUp, ScaleIn, StaggerContainer

### Added — Testing & Documentation (Specs 028–029)

- Testing infrastructure setup
- Documentation audit: updated ROADMAP.md, CHANGELOG.md, ProjectHandover.mdc

### Changed — Site Revision Phase 2 (Spec 020)

- Added Framer Motion animations to homepage sections
- Further UI polish and responsive improvements

### Fixed — Admin Dashboard Critical Fixes (Spec 021)

- **A1**: Added logout button to admin sidebar
- **A2**: Sidebar hidden on login page (isolated layout)
- **A3**: Prices now visible in inventory list
- **A4**: Save confirmation button for price/quantity changes
- **A5**: Admin route properly protected

---

## [1.3.0] - 2026-02-16 — Homepage Revision & UI Polish (Spec 019)

### Added

- Mobile hamburger menu: categories accordion, brands accordion, search bar
- Two-row brands marquee with reverse animation on homepage
- Darija Arabic titles/subtitles for GoalNavigator, FeaturedProducts, CategoryShowcase, BrandsMarquee, FinalCTA, Testimonials sections
- AI chat CTA in FinalCTA section (opens ChatSheet)
- `MobileMenu` component with full navigation (categories, brands, search)

### Changed

- **Hero section**: CTAs repositioned to bottom, buttons enlarged (h-12 px-8 text-base), image render height 800→1080
- **Trust badges**: Switched from flex-wrap to 2-column grid on mobile for proper alignment
- **All CTA buttons**: Increased from default to h-12/px-8/text-base across all homepage sections
- **AddToCartButton**: Global height increased from h-11 to h-12
- **Brand links**: Fixed routing from `/brands/{slug}` (404) to `/shop?brand={slug}` in both MegaMenu and mobile menu
- **Category links**: Fixed routing from `/categories/{slug}` (404) to `/shop?category={slug}` in mobile menu
- **Brands marquee**: Animation speed increased from 20s→8s
- **Header/Footer**: Converted remaining Arabic navigation labels to French
- **MegaMenu brands**: Made responsive (was fixed 6-column, now adapts)
- **Hero section**: Secondary CTA button hover text fixed (was black on dark, now stays white)
- **LoginPromptDialog**: "Continuer sans compte" hover text fixed
- **GoalNavigator**: Icon size reduced from text-5xl to text-3xl

### Fixed

- Mobile menu auto-focusing search field (caused keyboard popup + zoom) — removed `autoFocus`
- Checkout with logged-in accounts failing (email validation issue)
- Order confirmation email failing (`last:` Tailwind classes not inlined by `@react-email`)
- Hydration mismatch in TopBar.tsx (`suppressHydrationWarning`)
- Hero section headline field no longer required in Sanity schema
- TypeScript build errors: replaced broken `FILTER_PRODUCTS_BY_NAME_QUERYResult` type with `PROMOTIONS_QUERYResult`
- `FeaturedProduct.images` type accepting null from Sanity TypeGen
- `PackProduct.quantity` accepting null

### Translated (EN → FR)

- Order detail page: all labels (Commande, Articles, Qté, Sous-total, Adresse de livraison, Paiement, Statut)
- Checkout success page: all labels (Commande confirmée, Détails de la commande, Livraison à, Statut du paiement)
- ProductGallery: "No images available" → "Aucune image disponible"
- RelatedProducts/FeaturedCarousel: "No image" → "Pas d'image"
- Order page metadata: "Order Details | Furniture Shop" → "Détails de la commande | Dodo Nutrition"

---

## [1.2.0] - 2026-02-14 — Admin Auth Refactor & Doc Cleanup

### Added

- Custom JWT authentication for admin dashboard (`lib/auth/admin-session.ts`)
- Admin login page (`/admin/login`) with username/password
- Server actions for all Sanity mutations (`lib/actions/admin-mutations.ts`)
- Server actions for all Sanity reads (`lib/actions/admin-data.ts`)
- API routes: `/api/admin/auth`, `/api/admin/products`, `/api/admin/upload`
- `jose` package for JWT handling
- Consolidated [ROADMAP.md](./ROADMAP.md) — single source of truth

### Changed

- **BREAKING**: Admin auth switched from Clerk to custom JWT
- All admin components now use server actions instead of Sanity SDK hooks
- Inventory/Orders pages converted to server components with client wrappers
- 10+ admin components refactored (PriceInput, StockInput, FeaturedToggle, StatusSelect, PublishButton, DeleteButton, AddressEditor, ImageUploader, ProductRow, OrderRow)
- Insights API now uses JWT auth instead of Clerk `isAdmin()`
- Admin layout no longer wraps with `SanityAppProvider`

### Removed

- `@sanity/sdk-react` dependency from admin routes
- `Providers.tsx` wrapper from admin layout
- Clerk auth requirement for admin routes
- 15 redundant documentation files (content merged into [ROADMAP.md](./ROADMAP.md))

### Fixed

- Order status update "Authentification requise" error (wrong import path)
- Insights API 403 error (was using Clerk instead of JWT)

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
