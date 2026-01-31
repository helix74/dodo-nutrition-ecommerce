# Tech Stack

> **Project**: Dodo Nutrition  
> **Purpose**: Complete technology reference

---

## Core Stack

| Layer               | Technology | Version         |
| ------------------- | ---------- | --------------- |
| **Framework**       | Next.js    | 16 (App Router) |
| **Language**        | TypeScript | 5.x (strict)    |
| **Runtime**         | Node.js    | 20+             |
| **Package Manager** | pnpm       | 9.x             |

---

## Frontend

| Category          | Technology      | Purpose                   |
| ----------------- | --------------- | ------------------------- |
| **Styling**       | Tailwind CSS    | Utility-first CSS         |
| **UI Components** | Shadcn/UI       | Accessible components     |
| **Icons**         | Lucide React    | Consistent iconography    |
| **State**         | Zustand         | Client state (cart, chat) |
| **Forms**         | React Hook Form | Form handling             |
| **Carousel**      | Embla Carousel  | Product carousels         |

---

## Backend

| Category     | Technology | Purpose              |
| ------------ | ---------- | -------------------- |
| **CMS**      | Sanity v4  | Content + Database   |
| **Auth**     | Clerk      | Authentication       |
| **Email**    | Resend     | Transactional emails |
| **Payments** | Stripe     | Future payments      |

---

## AI / ML

| Category         | Technology           | Purpose           |
| ---------------- | -------------------- | ----------------- |
| **SDK**          | Vercel AI SDK        | Streaming + tools |
| **LLM Provider** | Groq                 | Fast inference    |
| **Model**        | llama-3.1-8b-instant | Chat + insights   |

---

## DevOps

| Category    | Technology      | Purpose               |
| ----------- | --------------- | --------------------- |
| **Hosting** | Vercel          | Edge deployment       |
| **CI/CD**   | Vercel + GitHub | Auto deploy           |
| **Linting** | Biome           | Fast linter/formatter |

---

## Security Tools

| Tool                 | Purpose           |
| -------------------- | ----------------- |
| **Clerk Middleware** | Route protection  |
| **Zod**              | Input validation  |
| **Server Actions**   | CSRF protection   |
| **Env vars**         | Secret management |

---

## Key Dependencies

```json
{
  "next": "^16.0.0",
  "react": "^19.0.0",
  "@clerk/nextjs": "^latest",
  "@sanity/client": "^latest",
  "ai": "^latest",
  "@ai-sdk/groq": "^latest",
  "zustand": "^5.0.0",
  "zod": "^3.0.0",
  "resend": "^latest",
  "stripe": "^latest",
  "tailwindcss": "^4.0.0"
}
```

---

## File Structure

```
├── app/                 # Next.js App Router
│   ├── (admin)/         # Admin routes (protected)
│   ├── (app)/           # Customer routes
│   ├── api/             # API routes
│   └── studio/          # Sanity Studio
├── components/          # React components
│   ├── admin/           # Admin components
│   ├── app/             # App components
│   ├── home/            # Homepage sections
│   ├── providers/       # Context providers
│   └── ui/              # Shadcn components
├── lib/                 # Utilities
│   ├── actions/         # Server actions
│   ├── ai/              # AI agent config
│   ├── auth/            # Auth helpers
│   ├── constants/       # App constants
│   ├── data/            # Data fetching
│   ├── mail/            # Email config
│   ├── sanity/          # Sanity queries
│   ├── store/           # Zustand stores
│   └── validations/     # Zod schemas
├── sanity/              # Sanity config
│   ├── schemaTypes/     # Document schemas
│   └── lib/             # Sanity client
├── emails/              # React Email templates
├── docs/                # Documentation
├── specs/               # Feature specs
└── public/              # Static assets
```
