---
description: Deep analysis of existing project before any specification work. MUST be run first on existing projects.
---

# Speckit Audit Workflow

> **CRITICAL**: This workflow MUST be run before `/speckit.architect` or `/speckit.specify` on any _existing_ project. It prevents generating specs that conflict with reality.

1.  **Purpose**:

    - Create a comprehensive `PROJECT_AUDIT.md` that documents everything that _already exists_.
    - This becomes the "truth" for the Architect and Specify workflows.

2.  **Analysis Steps**:

    - **Routes**: List all pages in `app/` (or `pages/`).
    - **Components**: List all components (especially `components/ui/`).
    - **Schemas**: Document database/CMS schemas (e.g., Sanity types).
    - **State**: Identify state management (Zustand, Redux, Context).
    - **API/Integrations**: Document third-party services (Stripe, Clerk, AI).
    - **Styling**: Document the design system (colors, fonts, CSS approach).

3.  **Output**:

    - Create `PROJECT_AUDIT.md` in the project root.
    - Format:

      ```markdown
      # Project Audit

      ## Tech Stack

      - Framework: ...
      - CMS: ...

      ## Routes

      - `/` - Home
      - `/shop` - ...

      ## Components (UI)

      - Button, Card, ...

      ## Database Schema

      - Product: { name, price, ... }

      ## Integrations

      - Stripe (Payments)
      - Clerk (Auth)

      ## Design System

      - Primary Color: #...
      - Font: ...

      ## Current Status & Gaps

      - What's complete?
      - What's missing or broken?
      ```

4.  **Handoff**:
    - After audit is complete, run `/speckit.architect` to create a ROADMAP based on _reality_.
