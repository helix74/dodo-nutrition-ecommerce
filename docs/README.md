# 📚 Dodo Nutrition - Documentation Hub

> **Central index for all project documentation.**  
> **Last Updated**: 2026-01-17

---

## 🗂️ Document Directory

| Document                                   | Description                                          | Status      |
| ------------------------------------------ | ---------------------------------------------------- | ----------- |
| [architecture.md](./architecture.md)       | 🏗️ Full project architecture, tech stack, user flows | ✅ Complete |
| [database-schema.md](./database-schema.md) | 🗄️ Sanity schemas (Product, Order, Customer)         | ✅ Complete |
| [components.md](./components.md)           | 🧩 Component library reference                       | ✅ Complete |
| [ROADMAP.md](../ROADMAP.md)                | 📅 Development phases and features                   | ✅ Current  |
| [constitution.md](../constitution.md)      | ⚖️ Project rules and tech standards                  | ✅ Current  |

---

## 🔗 Quick Links

### Tech Stack

| Layer        | Technology                           |
| ------------ | ------------------------------------ |
| Frontend     | Next.js 16 (App Router)              |
| CMS          | Sanity.io v4                         |
| Auth         | Clerk                                |
| State        | Zustand                              |
| Style        | Tailwind CSS v4                      |
| **Payment**  | **COD (Cash on Delivery)**           |
| **Shipping** | **Ciblex API**                       |
| **Currency** | **TND (Tunisian Dinar)**             |
| Design       | Dodo Yellow `#fee257`, Red `#f01b24` |

### Key Directories

- **Schemas**: [sanity/schemaTypes/](../sanity/schemaTypes/)
- **Components**: [components/](../components/) — 50+ components
- **AI Agent**: [lib/ai/](../lib/ai/)

---

## 📊 Current Project Status

```
┌─────────────────────────────────────────────────────┐
│  DODO NUTRITION - STATUS OVERVIEW                   │
├─────────────────────────────────────────────────────┤
│  ✅ Core E-commerce: COMPLETE                       │
│  ✅ Authentication: COMPLETE (Clerk)                │
│  ⚠️ Checkout: NEEDS COD IMPLEMENTATION              │
│  ✅ AI Assistant: COMPLETE                          │
│  ⚠️ Admin Dashboard: NEEDS IMPROVEMENTS             │
│  ⚠️ Ciblex Integration: PLANNED                     │
│  ✅ Reviews: BASIC COMPLETE                         │
└─────────────────────────────────────────────────────┘
```

---

## 🎭 Multi-Agent Architecture

| Agent                | Domain                     | Reference                                  |
| -------------------- | -------------------------- | ------------------------------------------ |
| 🎭 Maestro           | Coordination, Architecture | [architecture.md](./architecture.md)       |
| 🗄️ Database Agent    | Sanity, Schemas, Data      | [database-schema.md](./database-schema.md) |
| 🎨 Frontend Agent    | UI, Components, Pages      | [components/](../components/)              |
| 🔌 Integration Agent | Ciblex, Analytics          | Planned                                    |
| 🤖 AI Agent          | Shopping Assistant         | [lib/ai/](../lib/ai/)                      |

---

## 📝 Workflow

1. **Check docs** → Read relevant documentation first
2. **Create spec** → `/speckit.specify` for new features
3. **Plan** → `/speckit.plan` for implementation plan
4. **Implement** → `/speckit.implement` to build
5. **Verify** → `/speckit.verify` to validate
6. **Update docs** → Keep documentation current

---

**This is the source of truth for project documentation.**
