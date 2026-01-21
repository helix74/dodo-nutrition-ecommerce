---
description: Create technical implementation plans with your chosen tech stack
---

# Speckit Plan Workflow

1.  **Context**: Ask the user which feature they want to plan (e.g., "001-create-taskify").
2.  **Prerequisites**: Read `specs/NNN-slug/spec.md` and `constitution.md`.
3.  **Research**:
    - (Optional) Create `specs/NNN-slug/research.md` if complex tech choices are needed.
4.  **Draft Plan**:
    - Create `specs/NNN-slug/plan.md`.
    - **Proposed Changes**: List every file to be created or modified.
    - **Verification Plan**: Define how we will test this.
5.  **Review**: Use `notify_user` to get explicit approval on `specs/NNN-slug/plan.md`.
