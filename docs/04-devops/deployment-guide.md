# Deployment Guide

> **Project**: Dodo Nutrition  
> **Purpose**: Production deployment checklist

---

## Pre-Deployment Checklist

### Environment Variables

All these must be set in Vercel:

```env
# Required
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxx
CLERK_SECRET_KEY=sk_live_xxx
NEXT_PUBLIC_SANITY_PROJECT_ID=xxx
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_WRITE_TOKEN=xxx
ADMIN_EMAILS=admin@dodontrition.tn

# AI (optional but recommended)
GROQ_API_KEY=xxx

# Email
RESEND_API_KEY=re_xxx

# Payments (if using Stripe)
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

---

## Vercel Deployment

### 1. Connect Repository

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### 2. Configure in Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Import Git repository
3. Set environment variables
4. Deploy

### 3. Custom Domain

1. In Vercel: Settings → Domains
2. Add your domain
3. Update DNS records:
   - A record: `76.76.21.21`
   - CNAME: `cname.vercel-dns.com`

---

## Sanity Configuration

### 1. CORS Origins

In [sanity.io/manage](https://sanity.io/manage):

1. Go to your project
2. Settings → API → CORS Origins
3. Add: `https://yourdomain.com`

### 2. Webhooks (optional)

For real-time updates:

1. Settings → API → Webhooks
2. Add webhook URL

---

## Clerk Configuration

### 1. Production Instance

1. Create production instance in Clerk
2. Update keys in Vercel
3. Configure allowed origins

### 2. Social Logins (optional)

Configure in Clerk dashboard:

- Google OAuth
- Facebook OAuth

---

## Post-Deployment

### 1. Verify

- [ ] Homepage loads
- [ ] Products display
- [ ] Cart works
- [ ] Checkout completes
- [ ] Admin accessible
- [ ] Emails send

### 2. Monitoring

Set up:

- Vercel Analytics
- Error tracking (Sentry)
- Uptime monitoring

### 3. Performance

Run:

- Lighthouse audit
- Core Web Vitals check
- Mobile test

---

## Rollback

If issues occur:

```bash
# In Vercel dashboard
# Deployments → Previous → Promote to Production

# Or CLI
vercel rollback
```

---

## SSL Certificate

Vercel automatically provisions SSL. No action needed.

---

## CDN & Caching

Vercel Edge Network handles:

- Static file caching
- Image optimization
- Global distribution

---

## Support

- Vercel Status: status.vercel.com
- Sanity Status: status.sanity.io
- Clerk Status: status.clerk.com
