# 🚨 VERCEL BUILD FIX — Quick Guide

**Error**: Missing environment variable: `NEXT_PUBLIC_SANITY_DATASET`  
**Cause**: Vercel doesn't have env vars yet

---

## STEP 1: Add Environment Variables in Vercel

1. Go to: **[Vercel Dashboard](https://vercel.com/dashboard)** → Your Project → **Settings** → **Environment Variables**

2. Click **"Add New"** and add **each** of these (copy values from your **`.env.local`**):

### Required Variables (copy EXACT values from .env.local)

| Variable                            | Example Value          | Where to Find       |
| ----------------------------------- | ---------------------- | ------------------- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`     | `abc123xyz`            | `.env.local` line 2 |
| `NEXT_PUBLIC_SANITY_DATASET`        | `production`           | `.env.local` line 3 |
| `NEXT_PUBLIC_SANITY_ORG_ID`         | `orgId_xyz`            | `.env.local` line 4 |
| `SANITY_API_WRITE_TOKEN`            | `skXXXXXXX...`         | `.env.local` line 5 |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_test_XXX...`       | `.env.local`        |
| `CLERK_SECRET_KEY`                  | `sk_test_XXX...`       | `.env.local`        |
| `GROQ_API_KEY`                      | `gsk_XXX...`           | `.env.local`        |
| `RESEND_API_KEY`                    | `re_XXX...`            | `.env.local`        |
| `ADMIN_EMAILS`                      | `your.email@gmail.com` | Your Clerk email    |
| `NEXT_PUBLIC_BASE_URL`              | See below              | -                   |

### For `NEXT_PUBLIC_BASE_URL`:

**Production**: Add the value `https://YOUR-PROJECT.vercel.app` (your Vercel URL)  
**Development**: Add the value `http://localhost:3000`

> **Important**: For each variable, set **Scope** to **All** (Production + Preview + Development)

3. After adding ALL variables, click **"Redeploy"** in the Deployments tab

---

## STEP 2: Fix Middleware Warning (Optional but recommended)

Next.js 16.1+ wants `proxy.ts` instead of `middleware.ts`.

**Fix locally**:

```bash
git mv middleware.ts proxy.ts
git add -A
git commit -m "Rename middleware.ts to proxy.ts (Next.js 16.1+ convention)"
git push origin main
```

Vercel will auto-redeploy.

---

## Quick Checklist

- [ ] Open Vercel → Settings → Environment Variables
- [ ] Add all 10 environment variables (copy from `.env.local`)
- [ ] Set Scope to "All" for each
- [ ] Click "Redeploy" in Deployments tab
- [ ] (Optional) Rename `middleware.ts` → `proxy.ts` locally and push

---

**Expected**: Build should pass after env vars are added ✅
