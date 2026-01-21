---
description: Execute all tasks to build the feature according to the plan
---

# Speckit Implement Workflow

1.  **Context**: Ask the user which feature they want to implement (e.g., "001-create-taskify").
2.  **Loop**:
    - Read `specs/NNN-slug/tasks.md` to find the next uncompleted task.
    - **Execute**: Perform the necessary code edits, file creations, or command runs.
    - **Mark Complete**: Update `specs/NNN-slug/tasks.md` to mark the item as `[x]`.
    - **Verify**: Run relevant tests or checks for that specific task.
3.  **Completion**:
    - When all tasks are done, run the full verification suite defined in `plan.md`.
    - Create `specs/NNN-slug/walkthrough.md` to demonstrate the result.
4.  **Notify**: Inform the user that implementation for this feature is complete.
