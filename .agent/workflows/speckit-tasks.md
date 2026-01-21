---
description: Generate actionable task lists for implementation
---

# Speckit Tasks Workflow

1.  **Context**: Ask the user which feature they want to task out (e.g., "001-create-taskify").
2.  **Input**: Read `specs/NNN-slug/plan.md`.
3.  **Breakdown**:
    - Create `specs/NNN-slug/tasks.md`.
    - Convert the "Proposed Changes" into a granular checklist.
    - Ensure tasks are ordered logically (Dependencies first).
4.  **Format**:
    - Use the format `- [ ] Task description <!-- id: N -->`.
    - Group tasks by "Phase" or "User Story" if large.
5.  **Verify**: Check that `tasks.md` covers 100% of `plan.md`.
