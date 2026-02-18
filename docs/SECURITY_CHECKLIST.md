# Security Checklist — Dodo Nutrition

> Last updated: 2026-02-18

---

## 1. API Routes & Authentication

| Route | Method | Auth | Rate Limit | Input Validation | Notes |
|-------|--------|------|------------|------------------|-------|
| `/api/admin/auth` | POST | Credentials → JWT | — | Username/password check | Login endpoint, sets HTTP-only cookie |
| `/api/admin/insights` | GET | JWT (`isAdminAuthenticated`) | 5 req/min/IP | — | AI-generated analytics |
| `/api/admin/products` | POST | **MISSING** | — | — | Creates draft product — needs auth guard |
| `/api/admin/upload` | POST | **MISSING** | — | File type check | Image upload — needs auth guard |
| `/api/admin/shipping/sync` | POST | JWT (`isAdminAuthenticated`) | — | — | Ciblex status sync |
| `/api/chat` | POST | Optional (Clerk) | 10 req/min/IP | — | AI shopping assistant |
| `/api/cart-upsell` | POST | None (public) | — | Array check | Product upsell suggestions |

### Action Items

- [ ] **CRITICAL**: Add `isAdminAuthenticated()` check to `/api/admin/products` route
- [ ] **CRITICAL**: Add `isAdminAuthenticated()` check to `/api/admin/upload` route
- [ ] Consider adding rate limiting to `/api/admin/products` and `/api/admin/upload`
- [ ] Consider adding rate limiting to `/api/cart-upsell`

---

## 2. Authentication Systems

### Admin Auth (JWT via `jose`)

- **Login**: Username/password verified against env vars `ADMIN_USERNAME` / `ADMIN_PASSWORD`
- **Session**: JWT token stored in HTTP-only, Secure, SameSite=Lax cookie
- **Duration**: 7 days
- **Verification**: `isAdminAuthenticated()` checks JWT signature + `role === "admin"`
- **Files**: `lib/auth/admin-session.ts`

### Customer Auth (Clerk)

- **Provider**: Clerk (hosted auth)
- **Usage**: Optional for checkout (COD supports guest checkout)
- **Files**: `lib/auth/admin.ts` (Clerk-based admin check via email list)

### Recommendations

- [ ] Ensure `ADMIN_JWT_SECRET` is a strong, unique secret (not a fallback)
- [ ] Consider rotating JWT secret periodically
- [ ] Monitor failed login attempts

---

## 3. Rate Limiting

| Endpoint | Limit | Window | Implementation |
|----------|-------|--------|----------------|
| `/api/chat` | 10 requests | 1 minute | IP-based, in-memory |
| `/api/admin/insights` | 5 requests | 1 minute | IP-based, in-memory |

### Implementation Details

- **Method**: In-memory sliding window counter (`lib/rate-limit.ts`)
- **Cleanup**: Old entries purged every 5 minutes
- **IP Detection**: `x-forwarded-for` → `x-real-ip` → `"unknown"`

### Recommendations

- [ ] Upgrade to Redis-backed rate limiting for production (e.g., `@upstash/ratelimit`)
- [ ] Add rate limiting to all admin write endpoints
- [ ] Add rate limiting to `/api/cart-upsell` to prevent abuse

---

## 4. Input Validation

### Zod Schemas (`lib/validations/schemas.ts`)

| Schema | Used In | Validates |
|--------|---------|-----------|
| `CODOrderSchema` | `lib/actions/checkout.ts` | Cart items, email, phone, address |
| `CartItemSchema` | Checkout flow | Product ID, name, price, quantity |
| `AddressSchema` | Checkout flow | Name (min 2), line1 (min 5), city, gouvernorat |
| `SubmitReviewSchema` | Review submission | Author (min 2), rating (1-5), comment (min 10) |
| `OrderStatusSchema` | Admin mutations | Status enum validation |
| `UpdateOrderStatusSchema` | Admin mutations | Order ID + status enum |

### Validation Points

- [x] Checkout: Zod schema validation before order creation
- [x] Checkout: Server-side stock verification
- [x] Checkout: Price verification against Sanity data
- [x] Reviews: Author, rating, and comment validation
- [x] Order updates: Status enum validation

---

## 5. Environment Variables

### Public (Client-safe) — `NEXT_PUBLIC_*`

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project identifier |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset name |
| `NEXT_PUBLIC_SANITY_ORG_ID` | Sanity org identifier |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key |
| `NEXT_PUBLIC_BASE_URL` | Site URL for meta tags |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel tracking |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics |

### Server-only (MUST NOT be exposed to client)

| Variable | Purpose |
|----------|---------|
| `SANITY_API_WRITE_TOKEN` | Sanity write access |
| `CLERK_SECRET_KEY` | Clerk server secret |
| `GROQ_API_KEY` | Groq AI API key |
| `ADMIN_EMAILS` | Admin email allowlist |
| `ADMIN_USERNAME` | Admin login username |
| `ADMIN_PASSWORD` | Admin login password |
| `ADMIN_JWT_SECRET` | JWT signing secret |
| `RESEND_API_KEY` | Email service key |
| `META_CAPI_ACCESS_TOKEN` | Meta Conversions API |
| `CIBLEX_USER` | Shipping API credentials |
| `CIBLEX_PASS` | Shipping API credentials |

### Recommendations

- [ ] Verify no server-only vars are imported in `"use client"` files
- [ ] Set a unique `ADMIN_JWT_SECRET` (don't rely on the `SANITY_API_WRITE_TOKEN` fallback)
- [ ] Consider using a secrets manager for production

---

## 6. Data Protection

### Sanity CMS

- **Read client**: Public, CDN-cached (used for storefront queries)
- **Write client**: Token-authenticated (used only in server actions + API routes)
- **Perspective**: `"published"` for public, `"drafts"` for admin

### Order Data

- Customer PII (name, email, phone, address) stored in Sanity orders
- No credit card data stored (COD only)
- Clerk handles auth credentials separately

### Recommendations

- [ ] Implement data retention policy for order PII
- [ ] Ensure Sanity CORS settings restrict write origins
- [ ] Consider encrypting phone numbers at rest

---

## 7. Headers & Transport

### Current Setup

- Next.js default security headers
- Clerk middleware handles auth redirects
- HTTP-only cookies for admin sessions

### Recommendations

- [ ] Add Content Security Policy (CSP) headers
- [ ] Add `X-Content-Type-Options: nosniff`
- [ ] Add `X-Frame-Options: DENY`
- [ ] Add `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] Configure `next.config.ts` security headers

---

## 8. Dependency Vulnerabilities

> Last scanned: 2026-02-18 via `pnpm audit`

| Severity | Package | Vulnerability | Path | Fix |
|----------|---------|---------------|------|-----|
| **High** | `@modelcontextprotocol/sdk` < 1.25.2 | ReDoS vulnerability ([GHSA-8r9q-7v3j-jr4g](https://github.com/advisories/GHSA-8r9q-7v3j-jr4g)) | `@clerk/agent-toolkit` → `@modelcontextprotocol/sdk` | Update `@clerk/agent-toolkit` |
| **High** | `@modelcontextprotocol/sdk` < 1.24.0 | DNS rebinding protection missing ([GHSA-w48q-cv73-mx4w](https://github.com/advisories/GHSA-w48q-cv73-mx4w)) | `@clerk/agent-toolkit` → `@modelcontextprotocol/sdk` | Update `@clerk/agent-toolkit` |

### Action Items

- [ ] Update `@clerk/agent-toolkit` to a version that ships `@modelcontextprotocol/sdk >= 1.25.2`
- [ ] Re-run `pnpm audit` after updating

---

## Automated Audit

Run the security audit script:

```bash
npx tsx scripts/security-audit.ts
```

Run dependency vulnerability scan:

```bash
pnpm audit
```
