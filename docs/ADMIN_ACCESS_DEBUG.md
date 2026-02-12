# 🔧 ADMIN ACCESS DEBUG GUIDE

## The Problem

You're signed in with Clerk, but `/admin` doesn't show the admin dashboard.

---

## Root Cause

The admin check (in `lib/auth/admin.ts`) compares your **Clerk account email** with the `ADMIN_EMAILS` environment variable.

**The logic**:

```typescript
// Line 9 in lib/auth/admin.ts
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .filter(Boolean);

// Line 23-24
const email = user.emailAddresses[0].emailAddress;
return ADMIN_EMAILS.includes(email);
```

---

## 🔍 Step 1: Check Your Clerk Email

1. Go to: `https://dodo-nutrition-ecommerce.vercel.app/`
2. Sign in with Clerk
3. Click on your profile picture (top right)
4. **Copy your email address EXACTLY** (e.g., `dalijardak@gmail.com`)

---

## 🔍 Step 2: Check Vercel Environment Variable

1. Go to: **[Vercel Dashboard](https://vercel.com)** → Your Project → **Settings** → **Environment Variables**
2. Find `ADMIN_EMAILS`
3. **Verify the email EXACTLY matches** your Clerk email

### Common Issues:

| Issue        | Example                                                        | Fix                          |
| ------------ | -------------------------------------------------------------- | ---------------------------- |
| Wrong email  | Vercel: `admin@example.com` <br> Clerk: `dalijardak@gmail.com` | Update Vercel to match Clerk |
| Typo         | Vercel: `dalijardk@gmail.com` (missing 'a')                    | Fix typo                     |
| Extra spaces | Vercel: `dalijardak@gmail.com` (spaces)                        | Remove spaces                |
| Not set      | Variable not added to Vercel                                   | Add it now                   |

---

## ✅ Step 3: Fix in Vercel

1. **Delete** the existing `ADMIN_EMAILS` variable in Vercel (if it exists)
2. **Add New** `ADMIN_EMAILS`:
   - Variable Name: `ADMIN_EMAILS`
   - Value: `dalijardak@gmail.com` ← **YOUR EXACT CLERK EMAIL**
   - Scope: **All**
3. Click **Save**
4. Go to **Deployments** → **Redeploy** latest deployment

---

## 🧪 Step 4: Test After Redeploy

1. Wait for redeploy to finish (2-3 min)
2. Clear browser cache or open incognito window
3. Go to: `https://dodo-nutrition-ecommerce.vercel.app/admin`
4. Sign in with Clerk
5. **You should see the admin dashboard** ✅

---

## 🚨 Still Not Working?

**Debug in browser console**:

1. Go to `/admin`
2. Open Developer Tools (F12)
3. Go to **Console** tab
4. Look for errors

**Common errors**:

- `"Accès administrateur requis"` → Email doesn't match
- Redirect loop → Clerk not configured correctly
- 500 error → Check Vercel logs

---

## 📋 Quick Checklist

- [ ] Signed in with Clerk
- [ ] Copied EXACT email from Clerk profile
- [ ] Checked `ADMIN_EMAILS` in Vercel Settings → Environment Variables
- [ ] Verified email matches EXACTLY (no typos, spaces, or wrong email)
- [ ] Saved and redeployed
- [ ] Cleared browser cache
- [ ] Tested `/admin` again

---

## Multiple Admins (Optional)

To add multiple admin emails, separate with commas (NO SPACES):

```
ADMIN_EMAILS=email1@gmail.com,email2@gmail.com,email3@gmail.com
```

**NOT**: `email1@gmail.com, email2@gmail.com` ← Spaces will break it!

---

**Most likely issue**: Email in Vercel doesn't match your Clerk account. Fix that and it will work! ✅
