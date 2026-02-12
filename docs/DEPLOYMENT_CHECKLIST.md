# 🚀 DEPLOYMENT CHECKLIST — Dodo Nutrition

> **Created**: 2026-02-12  
> **For**: Vercel Staging Deployment

---

## ✅ Pre-Deployment (DONE)

- [x] Security audit complete
- [x] Stripe removed (COD-only)
- [x] Rate limiting added
- [x] Middleware fixed (proxy.ts → middleware.ts)
- [x] Build passes (0 errors)
- [x] Dependencies updated
- [x] Git committed
- [x] 2 vulnerabilities remain (acceptable — transitive deps)

---

## 🔧 STEP 1: Push to GitHub

```bash
git push origin main
```

**Expected**: Voir ton commit sur GitHub

---

## 🌐 STEP 2: Configure Vercel Environment Variables

Va sur **[vercel.com/dashboard](https://vercel.com/dashboard)**

### 2.1. Link GitHub Repo (si pas déjà fait)

1. Click **"Add New Project"**
2. Import ton repo GitHub
3. Framework: **Next.js** (auto-détecté)
4. Click **"Deploy"** (ça va échouer sans les env vars — c'est normal)

### 2.2. Add Environment Variables

**Settings** → **Environment Variables** → **Add New**

| Variable Name                       | Value                                   | Where to Find                   | Scope           |
| ----------------------------------- | --------------------------------------- | ------------------------------- | --------------- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`     | Copie depuis `.env.local`               | Sanity dashboard                | **All**         |
| `NEXT_PUBLIC_SANITY_DATASET`        | `production`                            | -                               | **All**         |
| `NEXT_PUBLIC_SANITY_ORG_ID`         | Copie depuis `.env.local`               | Sanity dashboard                | **All**         |
| `SANITY_API_WRITE_TOKEN`            | Copie depuis `.env.local`               | Sanity → API → Tokens           | **All**         |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Copie depuis `.env.local`               | Clerk dashboard                 | **All**         |
| `CLERK_SECRET_KEY`                  | Copie depuis `.env.local`               | Clerk → API Keys                | **All**         |
| `GROQ_API_KEY`                      | Copie depuis `.env.local`               | Groq console                    | **All**         |
| `RESEND_API_KEY`                    | Copie depuis `.env.local`               | Resend → API Keys               | **All**         |
| `ADMIN_EMAILS`                      | **TON EMAIL** (ex: `example@gmail.com`) | Ton compte Clerk                | **All**         |
| `NEXT_PUBLIC_BASE_URL`              | `https://dodo-nutrition.vercel.app`     | Vercel dashboard (après deploy) | **Production**  |
| `NEXT_PUBLIC_BASE_URL`              | `http://localhost:3000`                 | -                               | **Development** |

> [!IMPORTANT]
>
> - Pour `ADMIN_EMAILS`: utilise l'email de ton compte Clerk
> - Pour `NEXT_PUBLIC_BASE_URL` Production: utilise l'URL Vercel (ex: `https://ton-projet.vercel.app`)
> - Tous les autres: copie EXACTEMENT depuis ton `.env.local`

### 2.3. Save and Redeploy

1. Click **"Save"** pour chaque variable
2. **Deployments** → Click **"Redeploy"** sur le dernier deployment

---

## ✅ STEP 3: Verify Deployment

Une fois le deployment terminé (2-3 min):

1. Click sur l'URL Vercel (ex: `https://dodo-nutrition.vercel.app`)
2. Le site doit charger ✅

---

## 🧪 STEP 4: Manual Testing

| #   | Test                | URL                            | Expected Result                     |
| --- | ------------------- | ------------------------------ | ----------------------------------- |
| 1   | Homepage loads      | `/`                            | Hero, products displayed            |
| 2   | Sign up             | `/sign-up`                     | Clerk form appears                  |
| 3   | Sign in             | `/sign-in`                     | Can login with Clerk                |
| 4   | Product page        | `/products/any-slug`           | Product details, AI chat widget     |
| 5   | Add to cart         | Any product                    | Cart badge updates                  |
| 6   | Guest checkout      | `/checkout`                    | Form appears, no login required     |
| 7   | Place order         | `/checkout` → Submit           | Order confirmation page             |
| 8   | Check email         | Inbox                          | Order confirmation email received   |
| 9   | Admin access        | `/admin`                       | Dashboard loads (avec ADMIN_EMAILS) |
| 10  | Admin orders        | `/admin/orders`                | Order list appears                  |
| 11  | Change order status | Click an order → Change status | Status updates                      |
| 12  | Non-admin blocked   | `/admin` (autre compte)        | Redirected or blocked               |
| 13  | AI chat             | Product page → Chat widget     | Responds to questions               |
| 14  | Submit review       | Product page → Write review    | Review saved (pending)              |

### Test Checklist Template

```markdown
- [ ] Homepage loads
- [ ] Sign up works
- [ ] Sign in works
- [ ] Product page loads
- [ ] Add to cart works
- [ ] Guest checkout works
- [ ] Order confirmation email received
- [ ] Admin dashboard accessible
- [ ] Admin can change order status
- [ ] Non-admin blocked from /admin
- [ ] AI chat responds
- [ ] Review submission works
```

---

## 🚨 Common Issues

### Issue 1: "Build Failed"

- **Cause**: Missing env vars
- **Fix**: Vérifier que TOUTES les env vars sont dans Vercel

### Issue 2: "Sanity Client Error"

- **Cause**: Wrong `SANITY_PROJECT_ID` or `DATASET`
- **Fix**: Copier exactement depuis `.env.local`

### Issue 3: "Clerk Authentication Failed"

- **Cause**: Wrong `CLERK_PUBLISHABLE_KEY` or domain not whitelisted
- **Fix**:
  1. Check Clerk dashboard → **Allowed Origins**
  2. Add ton URL Vercel (`https://ton-projet.vercel.app`)

### Issue 4: "Admin Access Denied"

- **Cause**: Email pas dans `ADMIN_EMAILS`
- **Fix**: Vercel → Settings → Environment Variables → Edit `ADMIN_EMAILS`

### Issue 5: "Email Not Received"

- **Cause**: Resend domain problems
- **Fix**:
  1. Check Resend dashboard → **Logs**
  2. Email arrive en spam (acceptable avec `@resend.dev`)
  3. Later: add custom domain

---

## 📋 Post-Deployment Tasks

- [ ] Update `NEXT_PUBLIC_BASE_URL` dans Vercel avec l'URL finale
- [ ] Test checkout complet
- [ ] Test admin panel
- [ ] Vérifier emails de confirmation
- [ ] Test AI chat sur 3-4 produits
- [ ] Soumettre un avis test
- [ ] Changer le statut d'une commande test

---

## 🎯 Next Steps After Successful Deployment

1. **Custom Domain** (si le client a un domaine):
   - Vercel → Settings → Domains → Add
   - Configure DNS records

2. **Resend Custom Domain** (quand client fournit):
   - Resend → Domains → Add domain
   - Configure DNS (SPF, DKIM)

3. **Monitor**:
   - Vercel Analytics
   - Sanity usage
   - Clerk usage

4. **Continue Development**:
   - See `docs/MASTER_PLAN.md` for next features

---

**Status**: ⏳ Ready to Deploy  
**Next**: Execute Step 1 → Push to GitHub
