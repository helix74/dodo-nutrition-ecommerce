---
name: feature-development
description: End-to-end feature development workflow for Dodo Nutrition. Use when creating a new feature, implementing a spec, or following the speckit process from start to finish. Covers spec creation through verification.
---

# Feature Development Workflow

Complete guide for developing features in Dodo Nutrition following the speckit methodology.

## Quick Start

```
1. Determine next spec number (check specs/ directory)
2. Create specs/NNN-feature-name/ directory
3. Follow the speckit pipeline
```

## Step-by-Step Process

### Phase 1: Specification

1. **Find next ID**: Check `specs/` for highest number (currently 018)
2. **Create directory**: `specs/019-feature-name/`
3. **Write spec.md**: Goal, user stories, non-functional requirements
4. **Reference**: `constitution.md` for project principles

### Phase 2: Planning

1. **Read spec.md** and understand requirements fully
2. **Create plan.md** with:
   - Proposed file changes (every file to create/modify)
   - Technical approach and trade-offs
   - Verification plan (how to test)
3. **Get user approval** before proceeding

### Phase 3: Task Breakdown

1. **Create tasks.md** from plan.md
2. Format: `- [ ] Task description <!-- id: N -->`
3. Group by phase or user story
4. Ensure 100% coverage of plan.md

### Phase 4: Implementation

1. Read next uncompleted task from tasks.md
2. Implement the change
3. Mark task `[x]` in tasks.md
4. Run `npx tsc --noEmit` after TypeScript changes
5. Repeat until all tasks done

### Phase 5: Verification

1. **Create verification.md** with:
   - Task completion check (all `[x]`?)
   - Spec alignment (does code match spec?)
   - Plan alignment (does code match plan?)
   - Build check: `pnpm build`
   - TypeScript check: `npx tsc --noEmit`
2. **Mark PASSED or FAILED**
3. If failed, list fixes needed

## Key Files to Reference

| File | Purpose |
|------|---------|
| `constitution.md` | Project principles and standards |
| `docs/ROADMAP.md` | Development roadmap |
| `.cursor/rules/ProjectHandover.mdc` | Current project state |

## Verification Commands

```bash
npx tsc --noEmit                    # TypeScript check
npx sanity schema extract           # Extract schema
npx sanity typegen generate --enforce-required-fields  # Generate types
pnpm build                          # Production build
```
