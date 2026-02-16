---
name: deployment-checklist
description: Pre-deployment verification checklist for Dodo Nutrition. Use when preparing for deployment, running pre-launch checks, or verifying the application is production-ready.
---

# Deployment Checklist

## Pre-Deployment Verification

### 1. Build Check

```bash
pnpm build
```

Must complete without errors. Fix any build failures before proceeding.

### 2. TypeScript Check

```bash
npx tsc --noEmit
```

Zero type errors required.

### 3. Schema Validation

```bash
npx sanity schema extract
npx sanity typegen generate --enforce-required-fields
```

### 4. Linting

```bash
pnpm lint
```

## Environment Variables

Verify all required env vars are set in Vercel:

- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- [ ] `CLERK_SECRET_KEY`
- [ ] `NEXT_PUBLIC_SANITY_PROJECT_ID` (tivydqqm)
- [ ] `NEXT_PUBLIC_SANITY_DATASET` (production)
- [ ] `SANITY_API_TOKEN`
- [ ] `GROQ_API_KEY`
- [ ] `RESEND_API_KEY`
- [ ] `ADMIN_EMAILS`
- [ ] `JWT_SECRET`

## Critical Path Testing

### Storefront

- [ ] Homepage loads with all 9 sections
- [ ] Product listing page shows products
- [ ] Product detail page renders correctly
- [ ] Cart add/remove/update works
- [ ] Checkout form validates and submits
- [ ] Order confirmation page shows
- [ ] Search functionality works
- [ ] Mega menu navigation works

### Admin

- [ ] Admin login works
- [ ] Dashboard shows stats
- [ ] Order management works
- [ ] Inventory management works
- [ ] Review moderation works

### Integrations

- [ ] Clerk sign-up/sign-in works
- [ ] Sanity Studio accessible at /studio
- [ ] AI chat responds correctly
- [ ] Order confirmation emails send
- [ ] Low stock emails send

## Performance

- [ ] Lighthouse score > 80
- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] Images optimized (WebP, proper sizing)

## Security

- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] Admin routes protected
- [ ] API routes have rate limiting
- [ ] No secrets in client bundle
- [ ] .env files excluded from git

## Post-Deployment

- [ ] Verify live homepage
- [ ] Test one complete checkout flow
- [ ] Check Sanity webhook connectivity
- [ ] Monitor error logs for first hour
