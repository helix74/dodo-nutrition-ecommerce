# Security Checklist

> **Project**: Dodo Nutrition  
> **Purpose**: Pre-deploy security verification

---

## Authentication ✅

- [x] Clerk middleware configured
- [x] Protected routes defined
- [x] Admin routes require auth
- [x] Session management via Clerk

## Authorization ✅

- [x] Admin role via ADMIN_EMAILS
- [x] `requireAdmin()` in all admin actions
- [x] API routes check admin status
- [x] No unauthorized data access

## Input Validation ✅

- [x] Zod schemas for checkout
- [x] Server-side validation
- [x] Type-safe throughout
- [x] No dangerouslySetInnerHTML

## Data Protection ✅

- [x] Env vars server-only
- [x] No secrets in client bundle
- [x] HTTPS enforced (Vercel)
- [x] Secure cookies (Clerk)

## Stock Integrity ✅

- [x] Validation before checkout
- [x] Atomic stock updates (transaction)
- [x] Idempotency check in webhooks

---

## npm Audit

Run before each deploy:

```bash
pnpm audit
```

---

## Dependency Monitoring

- [ ] Enable GitHub Dependabot
- [ ] Review security alerts weekly
- [ ] Update critical packages promptly

---

## Environment Security

| Variable                 | Confidentiality |
| ------------------------ | --------------- |
| `CLERK_SECRET_KEY`       | 🔴 Secret       |
| `SANITY_API_WRITE_TOKEN` | 🔴 Secret       |
| `STRIPE_SECRET_KEY`      | 🔴 Secret       |
| `GROQ_API_KEY`           | 🔴 Secret       |
| `RESEND_API_KEY`         | 🔴 Secret       |
| `ADMIN_EMAILS`           | 🟡 Server-only  |
| `NEXT_PUBLIC_*`          | 🟢 Public       |

---

## OWASP Top 10 Status

| Risk                  | Status | Notes                       |
| --------------------- | ------ | --------------------------- |
| Injection             | ✅     | GROQ prevents SQL injection |
| Broken Auth           | ✅     | Clerk handles auth          |
| Sensitive Data        | ✅     | Server-only secrets         |
| XXE                   | ✅     | No XML processing           |
| Broken Access         | ✅     | ACL implemented             |
| Misconfiguration      | ✅     | Minimal config exposure     |
| XSS                   | ✅     | React escaping              |
| Deserialization       | ✅     | No unsafe deserialization   |
| Vulnerable Components | ⚠️     | Run npm audit               |
| Logging               | ⚠️     | Add monitoring              |
