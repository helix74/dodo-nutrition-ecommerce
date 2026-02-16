---
name: speckit
description: Structured spec-first development workflow for Dodo Nutrition. Use when the user mentions speckit, /speckit, spec, feature planning, feature specification, implementation workflow, or wants to create/plan/implement/verify a feature. Provides 11 workflow commands for the complete feature lifecycle.
---

# Speckit — Structured Feature Development

Speckit is the project's spec-first methodology. Every feature goes through a structured lifecycle with documented artifacts in `specs/NNN-feature-name/`.

## Available Commands

When the user invokes any `/speckit.*` command, read the corresponding workflow file from `.agent/workflows/` and follow its instructions exactly.

| Command | File | Purpose |
|---------|------|---------|
| `/speckit.constitution` | `.agent/workflows/speckit-constitution.md` | Create/update project governing principles |
| `/speckit.audit` | `.agent/workflows/speckit-audit.md` | Deep audit of existing project state |
| `/speckit.architect` | `.agent/workflows/speckit-architect.md` | Define architecture and phased roadmap |
| `/speckit.specify` | `.agent/workflows/speckit-specify.md` | Write feature requirements (spec.md) |
| `/speckit.clarify` | `.agent/workflows/speckit-clarify.md` | Resolve ambiguities in a spec |
| `/speckit.plan` | `.agent/workflows/speckit-plan.md` | Create technical implementation plan |
| `/speckit.tasks` | `.agent/workflows/speckit-tasks.md` | Break plan into actionable task checklist |
| `/speckit.implement` | `.agent/workflows/speckit-implement.md` | Execute tasks and build the feature |
| `/speckit.verify` | `.agent/workflows/speckit-verify.md` | Quality assurance and verification |
| `/speckit.analyze` | `.agent/workflows/speckit-analyze.md` | Cross-artifact consistency check |
| `/speckit.checklist` | `.agent/workflows/speckit-checklist.md` | Generate custom quality checklists |

## Workflow

### New Feature (typical sequence)

```
/speckit.specify → /speckit.clarify → /speckit.plan → /speckit.tasks → /speckit.implement → /speckit.verify
```

### Quick Reference

1. **Read the workflow file** from `.agent/workflows/speckit-{command}.md`
2. **Follow every step** in the workflow exactly
3. **Always reference** `constitution.md` for project principles
4. **Create artifacts** in `specs/NNN-feature-name/` directory
5. **Get user approval** at key decision points

## Artifact Structure

```
specs/NNN-feature-name/
├── spec.md          # Requirements (from /speckit.specify)
├── plan.md          # Technical plan (from /speckit.plan)
├── tasks.md         # Task checklist (from /speckit.tasks)
├── verification.md  # QA report (from /speckit.verify)
├── research.md      # Optional tech research
└── analysis.md      # Consistency report (from /speckit.analyze)
```

## Current State

- Specs 001–018: All completed
- Next spec number: **019**
- Constitution: `constitution.md` (project root)
- Roadmap: `docs/ROADMAP.md`

## Important Rules

- NEVER start coding without a spec and plan
- ALWAYS mark tasks complete in `tasks.md` as you go
- ALWAYS run verification after implementation
- Reference the constitution for all architectural decisions
- User communicates in Tunisian Darija — respond in English/French
