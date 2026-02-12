# 📚 SANITY COMPLETE GUIDE — For Dodo Nutrition

> **Created**: 2026-02-12  
> **Purpose**: Teaching document — everything about Sanity configuration, deployment, and integration  
> **Level**: From zero to production

---

## Table of Contents

1. [What is Sanity?](#1-what-is-sanity)
2. [Key Concepts](#2-key-concepts)
3. [Your Project Architecture](#3-your-project-architecture)
4. [How Authentication Works](#4-how-authentication-works)
5. [Sanity Dashboard Configuration](#5-sanity-dashboard-configuration-step-by-step)
6. [Local Project Configuration](#6-local-project-configuration)
7. [Deployment Guide](#7-deployment-guide)
8. [CORS Configuration](#8-cors-configuration)
9. [Troubleshooting](#9-troubleshooting)
10. [Glossary](#10-glossary)

---

## 1. What is Sanity?

Sanity is a **headless CMS** (Content Management System). Think of it as a cloud database specifically designed for content (products, orders, reviews, etc.) with a visual editor (Studio) and real-time capabilities.

### What Sanity Gives You

| Component        | What It Does                              | Analogy                              |
| ---------------- | ----------------------------------------- | ------------------------------------ |
| **Content Lake** | Cloud database that stores all your data  | Like a Firebase/MongoDB in the cloud |
| **Studio**       | Visual editor for content (drag and drop) | Like WordPress admin panel           |
| **App SDK**      | React hooks to build custom dashboards    | Like building your own admin panel   |
| **APIs**         | HTTP/GROQ endpoints to query data         | Like a REST API                      |
| **Dashboard**    | Web portal to manage projects             | Like AWS Console                     |

---

## 2. Key Concepts

### 2.1 Organization

**What**: The top-level container. Like a "company account" in Sanity.

```
Organization (ex: "Dodo Nutrition")
├── Project 1 (ex: "dodo_nutrition")
│   ├── Dataset: production
│   └── Dataset: staging (optional)
├── Project 2 (optional, for other apps)
└── Members (who has access)
```

**Organization ID**: A unique identifier (format: `org-XXXXX` or alphanumeric string).

- **Where to find it**: https://www.sanity.io/manage → Click your org → Look at the URL
- **Used by**: `sanity.cli.ts` to link your App SDK app to your organization

### 2.2 Project

**What**: A container inside an org that holds your content schemas and data.

**Project ID**: A unique identifier (format: `abc123xyz`).

- **Where to find it**: https://www.sanity.io/manage → Click your project → Settings
- **Your Project ID**: `tivydqqm` (from your `.env.local`)

### 2.3 Dataset

**What**: A "database" inside a project. Like `production` vs `staging` databases.

- **Your dataset**: `production`
- You can have multiple: `production`, `staging`, `development`
- Most projects only need `production` for now

### 2.4 Studio vs App SDK

This is the **most important distinction** to understand:

| Aspect         | Sanity Studio                    | Sanity App SDK                              |
| -------------- | -------------------------------- | ------------------------------------------- |
| **Purpose**    | Edit content directly            | Build custom interfaces                     |
| **Route**      | `/studio`                        | `/admin` (in your project)                  |
| **Package**    | `sanity`                         | `@sanity/sdk` + `@sanity/sdk-react`         |
| **Config**     | `sanity.config.ts`               | `sanity.cli.ts` (app section)               |
| **Auth**       | Sanity account login             | Sanity account via Dashboard or Studio mode |
| **Features**   | Document editor, GROQ playground | Custom React components, hooks              |
| **Use case**   | Add/edit products, categories    | View orders, inventory, analytics           |
| **Deployment** | `sanity deploy` or self-host     | `sanity deploy` (to Dashboard) or self-host |

---

## 3. Your Project Architecture

```
┌─────────────────────────────────────────────────────────┐
│ Your Next.js App (deployed on Vercel)                   │
│                                                         │
│ ┌──────────┐  ┌──────────┐  ┌───────────────┐          │
│ │ /        │  │ /studio  │  │ /admin        │          │
│ │ Storefront│  │ Sanity   │  │ Custom Admin  │          │
│ │ (public) │  │ Studio   │  │ Dashboard     │          │
│ └────┬─────┘  └────┬─────┘  └───────┬───────┘          │
│      │              │                │                   │
│      │              │                │                   │
│      │         sanity.config.ts  SanityAppProvider       │
│      │         (Studio config)   (App SDK config)        │
│      │              │                │                   │
│      │              │         ┌──────┴──────┐           │
│      │              │         │ SanityApp   │           │
│      │              │         │ component   │           │
│      │              │         │ (from SDK)  │           │
│      │              │         └──────┬──────┘           │
│      │              │                │                   │
│ ┌────┴──────────────┴────────────────┴──────┐           │
│ │ Sanity Content Lake (cloud database)       │           │
│ │ Project: tivydqqm | Dataset: production    │           │
│ └────────────────────────────────────────────┘           │
│                                                         │
│ Authentication:                                         │
│ ┌──────────┐        ┌──────────────┐                    │
│ │ Clerk    │        │ Sanity Auth  │                    │
│ │ (routes) │        │ (data access)│                    │
│ └──────────┘        └──────────────┘                    │
│ Protects: /admin,   Required by:                        │
│ /orders, /account   useDocuments(),                     │
│                     useDocumentProjection()              │
└─────────────────────────────────────────────────────────┘
```

### Your Config Files

| File                                         | Purpose                                   | Content                    |
| -------------------------------------------- | ----------------------------------------- | -------------------------- |
| `sanity.config.ts`                           | Studio config: schemas, plugins, basePath | Defines `/studio` route    |
| `sanity.cli.ts`                              | CLI + App SDK config: org ID, entry point | Links admin to Sanity org  |
| `sanity/env.ts`                              | Environment variables: projectId, dataset | Shared by Studio + App SDK |
| `sanity/lib/client.ts`                       | Sanity client for server-side queries     | Used in server actions     |
| `components/providers/SanityAppProvider.tsx` | `SanityApp` wrapper for admin             | Provides SDK context       |
| `components/providers/Providers.tsx`         | Dynamic import of SanityAppProvider       | Loaded client-side only    |

---

## 4. How Authentication Works

### DUAL AUTH SYSTEM

Your admin dashboard has **TWO** layers of authentication:

```
User visits /admin
    │
    ▼
Layer 1: CLERK (Route Protection)
    │ middleware.ts checks: "Is user signed in with Clerk?"
    │ If NO → Redirect to /sign-in
    │ If YES → Continue to page
    │
    ▼
Layer 2: SANITY APP SDK (Data Access)
    │ SanityApp component checks: "Is user authenticated with Sanity?"
    │ If NO → Shows Sanity login prompt
    │ If YES → SDK hooks (useDocuments, etc.) work
    │
    ▼
Layer 3: ADMIN CHECK (Authorization)
    │ Server actions check: "Is user's email in ADMIN_EMAILS?"
    │ If NO → "Accès administrateur requis"
    │ If YES → Data returned ✅
```

### Why 2 Login Systems?

**Clerk** = Controls WHO can access the admin ROUTES  
**Sanity** = Controls WHO can access the admin DATA

This is why you see **two different login screens**:

1. First: Clerk login (email/password)
2. Then: Sanity login (Sanity account)

### App SDK Authentication Modes

The App SDK has **2 modes** for authentication:

| Mode                         | How It Works                                                                        | When Used                                                               |
| ---------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **Dashboard Mode** (default) | App runs inside Sanity Dashboard iframe. Dashboard passes auth token automatically. | When deployed via `sanity deploy` and accessed from sanity.io dashboard |
| **Studio Mode**              | App uses Studio's local storage token or cookie.                                    | When embedded alongside Studio code                                     |

**Your current situation**: The admin is deployed on Vercel (NOT inside Sanity Dashboard), so it falls into a **self-hosted** scenario where:

- The `SanityApp` component detects it's not inside a Dashboard iframe
- It redirects to Sanity login to get an authentication token
- This is why you see the Sanity login screen

---

## 5. Sanity Dashboard Configuration (Step by Step)

### Step 1: Find Your Organization ID

1. Go to: https://www.sanity.io/manage
2. You'll see your organizations listed
3. Click on your organization
4. Look at the **URL bar**:
   ```
   https://www.sanity.io/organizations/org-abc123xyz
   ```
5. The org ID is: `org-abc123xyz` (everything after `/organizations/`)
6. **Alternative**: Run in terminal:
   ```bash
   npx sanity@latest orgs list
   ```

### Step 2: Verify Project Settings

1. Go to: https://www.sanity.io/manage
2. Click on your project ("dodo_nutrition")
3. Go to **Settings** → **General**
4. Verify:
   - **Project ID**: Should be `tivydqqm`
   - **Dataset**: Should have `production`

### Step 3: Configure CORS Origins

> [!IMPORTANT]
> This is CRITICAL for Vercel deployment! Without this, your app cannot talk to Sanity.

1. Go to: https://www.sanity.io/manage
2. Click on your project → **Settings** → **CORS Origins**
3. Add these origins:

| Origin                                        | Allow Credentials |
| --------------------------------------------- | ----------------- |
| `http://localhost:3000`                       | ✅ Yes            |
| `https://dodo-nutrition-ecommerce.vercel.app` | ✅ Yes            |

**Why "Allow Credentials"?** The App SDK uses authentication cookies/tokens. Without credentials, Sanity will block authenticated requests.

4. Click **"Add CORS origin"** for each

### Step 4: Verify API Token

1. Go to: Project → **Settings** → **API** → **Tokens**
2. You should have a token with **Editor** or **Write** permissions
3. This token is your `SANITY_API_WRITE_TOKEN` in `.env.local`
4. If you don't have one: Click **"Add API Token"** → Name it "Next.js Write" → Select **Editor** → **Save**

---

## 6. Local Project Configuration

### Your `.env.local` — Complete and Correct

```bash
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=tivydqqm
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_ORG_ID=YOUR_ORG_ID_HERE    # ← GET THIS FROM STEP 1 ABOVE
SANITY_API_WRITE_TOKEN=skdcAIkU...             # ← Your existing token

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# AI
GROQ_API_KEY=gsk_...

# Email
RESEND_API_KEY=re_...

# Admin
ADMIN_EMAILS=dalijardak@gmail.com

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### How Config Files Work Together

```
.env.local
    │
    ├── sanity/env.ts ← Reads NEXT_PUBLIC_SANITY_PROJECT_ID & DATASET
    │       │
    │       ├── sanity.config.ts (Studio)  ← Uses projectId, dataset
    │       │       └── Defines: basePath='/studio', schema, plugins
    │       │
    │       └── SanityAppProvider.tsx (Admin SDK) ← Uses projectId, dataset
    │               └── Wraps admin pages with SanityApp context
    │
    └── sanity.cli.ts ← Reads NEXT_PUBLIC_SANITY_ORG_ID
            └── Defines: app.organizationId, app.entry, api settings
```

---

## 7. Deployment Guide

### 7.1 What Gets Deployed Where

| Component                           | Where                | How                      | Needed?     |
| ----------------------------------- | -------------------- | ------------------------ | ----------- |
| **Storefront** (`/`, `/shop`, etc.) | Vercel               | `git push` → auto-deploy | ✅ Yes      |
| **Studio** (`/studio`)              | Vercel (embedded)    | `git push` → auto-deploy | ✅ Yes      |
| **Studio** (standalone)             | Sanity hosting       | `pnpm dlx sanity deploy` | ⚡ Optional |
| **Admin Dashboard** (`/admin`)      | Vercel (self-hosted) | `git push` → auto-deploy | ✅ Yes      |
| **Admin Dashboard** (in Dashboard)  | Sanity Dashboard     | `pnpm dlx sanity deploy` | ⚡ Optional |

### 7.2 Deploy to Vercel (Your Main Deployment)

When you `git push`, Vercel automatically:

1. Builds the Next.js app
2. Includes embedded Studio at `/studio`
3. Includes admin dashboard at `/admin`
4. Everything is under one URL

**Requirements**:

- All env vars set in Vercel
- CORS origins configured in Sanity → must include your Vercel URL

### 7.3 Deploy Studio to Sanity Hosting (Optional)

This creates a **standalone** Studio at `your-name.sanity.studio`:

```bash
cd c:\Users\Mohamed Ali Jardak\.gemini\antigravity\ecommerce-ai

# Make sure NEXT_PUBLIC_SANITY_ORG_ID is set in .env.local first!
pnpm dlx sanity deploy
```

**What happens**:

1. CLI asks for a hostname (e.g., `dodo-nutrition`)
2. Studio is built and uploaded
3. Available at: `https://dodo-nutrition.sanity.studio`
4. Also adds `deployment.appId` to your `sanity.cli.ts`

**When to do this**:

- If you want a standalone Studio URL outside your Vercel app
- If `/studio` on Vercel shows "Studio not registered yet"
- Good to have as a backup access to your content

### 7.4 Deploy Admin App to Sanity Dashboard (Optional)

Because your `sanity.cli.ts` has the `app` config, running `sanity deploy` may also register your admin as a Sanity Dashboard app:

```bash
pnpm dlx sanity deploy
```

This would make your admin accessible from the **Sanity Dashboard** (sanity.io/manage) as an embedded app. The Dashboard would handle authentication automatically (no separate Sanity login needed).

> [!NOTE]
> This is optional and primarily useful if you want to access the admin from the Sanity Dashboard UI instead of directly via your Vercel URL.

---

## 8. CORS Configuration

### What is CORS?

CORS (Cross-Origin Resource Sharing) is a security mechanism. When your site at `dodo-nutrition-ecommerce.vercel.app` tries to fetch data from `tivydqqm.api.sanity.io`, the browser checks if Sanity allows requests from your domain.

### Required Origins

| Origin                                        | Environment          | Purpose           |
| --------------------------------------------- | -------------------- | ----------------- |
| `http://localhost:3000`                       | Local development    | `pnpm dev`        |
| `https://dodo-nutrition-ecommerce.vercel.app` | Production           | Vercel deployment |
| `https://dodo-nutrition.sanity.studio`        | Studio (if deployed) | Standalone Studio |

### How to Add

1. https://www.sanity.io/manage → Your Project → Settings → CORS Origins
2. Click "Add CORS origin"
3. Enter the URL (no trailing slash!)
4. Check "Allow credentials" ✅
5. Save

### CLI Method

```bash
npx sanity@latest cors add https://dodo-nutrition-ecommerce.vercel.app --credentials --project tivydqqm
npx sanity@latest cors add http://localhost:3000 --credentials --project tivydqqm
```

---

## 9. Troubleshooting

### Problem: "/studio shows 'Studio not registered yet'"

**Cause**: Studio hasn't been deployed to Sanity hosting  
**Fix**: Either:

- Deploy: `pnpm dlx sanity deploy` (creates standalone URL)
- Or: The embedded Studio at your Vercel URL `/studio` should still work if CORS is configured

### Problem: "/admin shows Sanity login instead of dashboard"

**Cause**: App SDK needs Sanity authentication to access data  
**This is EXPECTED BEHAVIOR when self-hosting!**  
The flow is:

1. Login with Clerk (route protection)
2. Login with Sanity (data access)
3. Then admin dashboard loads

**To simplify** (one less login): Deploy via `pnpm dlx sanity deploy` and access admin through the Sanity Dashboard — authentication will be seamless.

### Problem: "CORS error in browser console"

**Cause**: Missing CORS origin  
**Fix**: Add your Vercel URL to Sanity CORS origins (see section 8)

### Problem: "Missing environment variable: NEXT_PUBLIC_SANITY_DATASET"

**Cause**: Env var not set in Vercel  
**Fix**: Add all env vars to Vercel Settings → Environment Variables

### Problem: "Build fails on Vercel"

**Cause**: Missing env vars  
**Fix**: All `NEXT_PUBLIC_*` and server vars must be in Vercel

---

## 10. Glossary

| Term             | Definition                                                       |
| ---------------- | ---------------------------------------------------------------- |
| **Content Lake** | Sanity's cloud database where all your content lives             |
| **Dataset**      | A "database" within a project (like `production`)                |
| **GROQ**         | Sanity's query language (like SQL but for JSON)                  |
| **Organization** | Top-level account container in Sanity                            |
| **Project**      | Container for datasets and schemas within an org                 |
| **Schema**       | Definition of your content types (product, order, etc.)          |
| **Studio**       | Visual content editor (built with `sanity` package)              |
| **App SDK**      | React tools for building custom interfaces on Sanity data        |
| **SanityApp**    | React provider component that handles authentication and context |
| **CORS**         | Security rule that allows your domain to access Sanity APIs      |
| **API Token**    | Secret key for server-side access to Sanity data                 |

---

## Quick Action Checklist

- [ ] **Get Org ID**: https://www.sanity.io/manage → URL contains org ID
- [ ] **Update .env.local**: Set `NEXT_PUBLIC_SANITY_ORG_ID`
- [ ] **Add CORS Origins**: Add `localhost:3000` and Vercel URL to Sanity project settings
- [ ] **Update Vercel**: Add `NEXT_PUBLIC_SANITY_ORG_ID` env var
- [ ] **Deploy Studio** (optional): `pnpm dlx sanity deploy`
- [ ] **Redeploy Vercel**: After CORS + env var updates
- [ ] **Test**: `/studio` loads Studio, `/admin` loads admin (after dual login)

---

**Questions? Re-read section 4 (Authentication) — it explains WHY there are two logins and HOW they work together.** 🎯
