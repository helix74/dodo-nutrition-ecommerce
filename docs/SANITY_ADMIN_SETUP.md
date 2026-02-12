# 🎯 SANITY + ADMIN SETUP - Complete Guide

**Problem**: `/admin` maykhdamch, studio maykhdamch  
**Root Cause**: Missing `NEXT_PUBLIC_SANITY_ORG_ID` w confusion entre 2 systèmes

---

## 🧩 Understanding The 2 Separate Systems

### System 1: Custom Admin Dashboard (`/admin`)

- **What**: Ton tableau de bord custom (orders, inventory, analytics)
- **Authentication**: **Clerk** (login with email)
- **Authorization**: `ADMIN_EMAILS` env var
- **Tech**: Uses **Sanity App SDK** (@sanity/sdk-react)
- **Requires**: `NEXT_PUBLIC_SANITY_ORG_ID` ← **THIS IS MISSING!**

### System 2: Sanity Studio (`/studio`)

- **What**: Content Management System (pour éditer products, categories)
- **Authentication**: **Sanity account** (separate from Clerk)
- **Tech**: Traditional Sanity Studio
- **Requires**: Studio deployment (optional for production)

---

## 🔴 CRITICAL FIX: Get Your Sanity Org ID

### Step 1: Get Your Org ID from Sanity

1. Go to: **https://www.sanity.io/manage**
2. Click on your organization ("dodo_nutrition" or whatever you named it)
3. Look at the URL — it will be like:
   ```
   https://www.sanity.io/organizations/ORG-1234567890
   ```
4. **Copy the org ID** (the part after `/organizations/`)
   - Example: `ORG-1234567890` or `orgKsY8z9...`

### Step 2: Add to Local `.env.local`

Replace line 4 in `.env.local`:

**Before**:

```bash
NEXT_PUBLIC_SANITY_ORG_ID=Your_value_goes_here
```

**After**:

```bash
NEXT_PUBLIC_SANITY_ORG_ID=ORG-1234567890
```

(use YOUR actual org ID)

### Step 3: Add to Vercel

1. Vercel Dashboard → Settings → Environment Variables
2. Find `NEXT_PUBLIC_SANITY_ORG_ID` (if it exists, delete it)
3. Add new:
   - Name: `NEXT_PUBLIC_SANITY_ORG_ID`
   - Value: `ORG-1234567890` ← YOUR org ID
   - Scope: **All**
4. **Redeploy**

### Step 4: Test Locally First

```bash
pnpm dev
```

Go to: `http://localhost:3000/admin`

- Sign in with Clerk (your dalijardak@gmail.com account)
- **Should now see the admin dashboard** ✅

---

## 🎨 How Authentication Works

### For `/admin` (Your Custom Dashboard):

```
User → Goes to /admin
     → Middleware checks: is this /admin route?
     → Clerk: "Are you signed in?" (dalijardak@gmail.com)
     → Admin check: "Is your email in ADMIN_EMAILS?"
     → If YES → Show admin dashboard ✅
     → If NO → "Accès administrateur requis" ❌
```

**You sign in with**: Clerk (dalijardak@gmail.com)  
**Authorization**: Email must be in `ADMIN_EMAILS` env var

### For `/studio` (Sanity CMS):

```
User → Goes to /studio
     → Sanity: "Sign in with your Sanity account"
     → Different login (not Clerk!)
     → Sanity checks: "Do you have access to this project?"
     → If YES → Show Sanity Studio ✅
```

**You sign in with**: Sanity account (separate login)  
**Authorization**: Project permissions in Sanity dashboard

---

## 📦 Optional: Deploy Sanity Studio

**Do you need this?** Only if you want `/studio` accessible in production.

**For now**: You can skip this. The `/admin` dashboard is more important.

**If you want it later**:

```bash
cd c:\Users\Mohamed Ali Jardak\.gemini\antigravity\ecommerce-ai
pnpm dlx sanity deploy
```

This will:

1. Deploy the studio to Sanity's hosting
2. Make it available at: `https://dodo-nutrition.sanity.studio`
3. Also accessible at: `https://your-site.vercel.app/studio`

---

## ✅ Quick Fix Checklist

- [ ] Get Sanity Org ID from https://www.sanity.io/manage
- [ ] Add to `.env.local`: `NEXT_PUBLIC_SANITY_ORG_ID=ORG-...`
- [ ] Test locally: `pnpm dev` → `localhost:3000/admin`
- [ ] Verify admin works locally
- [ ] Add `NEXT_PUBLIC_SANITY_ORG_ID` to Vercel
- [ ] Redeploy on Vercel
- [ ] Test production: `https://dodo-nutrition-ecommerce.vercel.app/admin`

---

## 🎯 After Fix

**`/admin`** → Your custom dashboard (Clerk login, email = dalijardak@gmail.com)  
**`/studio`** → Sanity CMS (Sanity login, optional for now)

**Both are separate!** Don't confuse them.

---

**Bottom Line**: Add `NEXT_PUBLIC_SANITY_ORG_ID` w `/admin` bech yemchi! 🚀
