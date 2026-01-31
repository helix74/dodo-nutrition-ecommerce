# 🦤 Dodo Nutrition

> **Premium E-commerce Platform for Sports Nutrition**  
> Built for the Tunisian Market

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)](https://www.typescriptlang.org/)
[![Sanity](https://img.shields.io/badge/Sanity-v4-red)](https://sanity.io/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-purple)](https://clerk.com/)

---

## ✨ Features

### Customer Experience

- 🛒 **Shopping Cart** with real-time updates
- 💳 **COD Checkout** (Cash on Delivery)
- ❤️ **Wishlist** with persistence
- 🔍 **AI Shopping Assistant** for product discovery
- ⭐ **Reviews & Testimonials**
- 📦 **Order Tracking**

### Admin Panel

- 📊 **Analytics Dashboard** with AI insights
- 📋 **Order Management** with status updates
- 📦 **Inventory Management**
- ✅ **Review Moderation**

### Technical

- 🚀 **Next.js 16** with App Router
- 🔐 **Clerk Authentication**
- 📝 **Sanity CMS**
- 🤖 **AI-powered** chat and insights
- 📧 **Email Notifications**
- 🌙 **Dark Theme**

---

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/helix74/dodo-nutrition-ecommerce.git
cd dodo-nutrition-ecommerce

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your keys

# Run development server
pnpm dev
```

**Open**: [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
├── app/                 # Next.js App Router
│   ├── (admin)/         # Admin routes
│   ├── (app)/           # Customer routes
│   └── api/             # API endpoints
├── components/          # React components
├── lib/                 # Utilities & logic
├── sanity/              # CMS config
├── docs/                # Documentation
└── specs/               # Feature specs
```

---

## 🔧 Environment Variables

```env
# Required
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_SANITY_PROJECT_ID=
SANITY_API_WRITE_TOKEN=
ADMIN_EMAILS=admin@example.com

# Optional (AI & Email)
GROQ_API_KEY=
RESEND_API_KEY=
```

---

## 📚 Documentation

| Document                                                   | Description    |
| ---------------------------------------------------------- | -------------- |
| [Documentation Hub](./docs/README.md)                      | All docs index |
| [Architecture](./docs/03-architecture/system-context.md)   | System diagram |
| [API Contracts](./docs/03-architecture/api-contracts.md)   | Endpoints      |
| [Security Model](./docs/03-architecture/security-model.md) | Auth & ACL     |
| [Contributing](./CONTRIBUTING.md)                          | Code standards |

---

## 🛡️ Security

- ✅ Admin routes protected via middleware
- ✅ Role-based authorization (ADMIN_EMAILS)
- ✅ Input validation with Zod
- ✅ Atomic stock operations
- ✅ Secure session management

---

## 🎨 Tech Stack

| Layer     | Technology           |
| --------- | -------------------- |
| Framework | Next.js 16           |
| Language  | TypeScript           |
| CMS       | Sanity v4            |
| Auth      | Clerk                |
| Styling   | Tailwind CSS         |
| UI        | Shadcn/UI            |
| AI        | Vercel AI SDK + Groq |
| Email     | Resend               |

---

## 📜 License

[MIT](./LICENSE.md)

---

## 🏗️ Built By

Developed for Dodo Nutrition 🦤
