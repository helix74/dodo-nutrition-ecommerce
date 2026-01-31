# System Context Diagram

> **Project**: Dodo Nutrition  
> **Purpose**: High-level system boundaries and integrations

---

## Overview

```mermaid
C4Context
    title System Context - Dodo Nutrition

    Person(customer, "Customer", "Tunisian fitness enthusiast buying supplements")
    Person(admin, "Admin", "Store owner managing orders and inventory")

    System(webapp, "Dodo Nutrition", "Next.js E-commerce Application")

    System_Ext(clerk, "Clerk", "Authentication Provider")
    System_Ext(sanity, "Sanity CMS", "Content Management")
    System_Ext(stripe, "Stripe", "Payment Processing (Future)")
    System_Ext(groq, "Groq AI", "LLM for Chat & Insights")
    System_Ext(resend, "Resend", "Email Service")
    System_Ext(vercel, "Vercel", "Hosting & Edge Functions")

    Rel(customer, webapp, "Uses", "HTTPS")
    Rel(admin, webapp, "Manages", "HTTPS")
    Rel(webapp, clerk, "Authenticates via", "API")
    Rel(webapp, sanity, "CRUD operations", "GROQ/API")
    Rel(webapp, stripe, "Payments", "API")
    Rel(webapp, groq, "AI generation", "API")
    Rel(webapp, resend, "Sends emails", "API")
    Rel(webapp, vercel, "Deploys to", "Git")
```

---

## Simplified Flow Diagram

```mermaid
flowchart TB
    subgraph Client["Client Browser"]
        Customer["Customer"]
        Admin["Admin"]
    end

    subgraph NextJS["Next.js Application"]
        App["App Router"]
        API["API Routes"]
        ServerActions["Server Actions"]
    end

    subgraph External["External Services"]
        Clerk["Clerk Auth"]
        Sanity["Sanity CMS"]
        Groq["Groq AI"]
        Resend["Resend Email"]
    end

    Customer --> App
    Admin --> App
    App --> ServerActions
    App --> API
    API --> Clerk
    ServerActions --> Sanity
    ServerActions --> Resend
    API --> Groq
```

---

## Data Flow

### Customer Order Flow

```mermaid
sequenceDiagram
    participant C as Customer
    participant A as App
    participant CK as Clerk
    participant S as Sanity
    participant R as Resend

    C->>A: Add to cart
    A->>A: Update Zustand store
    C->>A: Checkout (COD)
    A->>CK: Verify auth (optional)
    A->>S: Fetch product data (validate)
    A->>S: Create order
    A->>S: Decrement stock (transaction)
    A->>R: Send confirmation email
    A->>C: Show success page
```

---

## External Services

| Service    | Purpose             | Auth Method     |
| ---------- | ------------------- | --------------- |
| **Clerk**  | User authentication | API Keys        |
| **Sanity** | CMS + Database      | Project Token   |
| **Groq**   | AI chat + insights  | API Key         |
| **Resend** | Transactional email | API Key         |
| **Stripe** | Future payments     | Secret Key      |
| **Vercel** | Hosting             | Git integration |

---

## Environment Variables Required

```
# Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY

# CMS
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET
SANITY_API_WRITE_TOKEN

# AI
GROQ_API_KEY

# Email
RESEND_API_KEY

# Admin
ADMIN_EMAILS

# Payments (future)
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
```
