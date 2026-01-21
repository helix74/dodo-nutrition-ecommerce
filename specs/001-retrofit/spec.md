# Specification: Initial Project Retrofit

## Goal

Retrofit the existing `ecommerce-ai` project with the Spec-Kit workflow. The project is a functional e-commerce platform (Next.js 16, Sanity, Clerk, Stripe) but lacks organized documentation and a structured development process. This specification aims to document the current state and establish a "clean" baseline for future features.

## User Stories

- **As a Developer**, I want a clear "Constitution" that reflects the actual tech stack (Next.js, Sanity, Biome) so that AI agents generate correct code.
- **As a Developer**, I want a `specs/` directory structure so that I can isolate new features (e.g., "002-reviews").
- **As a Developer**, I want to identify any "messy" areas in the codebase (e.g., unused files, inconsistent styling) to plan a cleanup.

## Current Architecture (Documented)

- **Frontend**: Next.js 16 (App Router), Tailwind CSS v4, Shadcn/UI.
- **Backend**: Next.js Server Actions, Sanity CMS (Headless).
- **Auth**: Clerk (with AgentKit for AI context).
- **AI**: Vercel AI SDK + Anthropic Claude Sonnet.
- **Database**: Sanity (Content), Stripe (Payments).

## Non-Functional Requirements

- **No Code Changes yet**: This specific "feature" (001-retrofit) is primarily about documentation and structure, not changing app behavior.
- **Preserve Existing Functionality**: The retrofit must not break the existing store or admin dashboard.

## Success Criteria

- `constitution.md` is accurate.
- `specs/001-retrofit/` contains this spec, a plan, and tasks.
- The user confirms the project feels "under control".
