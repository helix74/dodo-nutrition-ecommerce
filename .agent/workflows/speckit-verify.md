---
description: Verify implementation is complete and correct. Run after /speckit.implement to confirm quality before closing the spec.
---

# Speckit Verify Workflow

> **When to Use**: After `/speckit.implement` completes, run this to QA the work.

1.  **Context**:

    - Ask the user which feature to verify (e.g., "002-product-schema").
    - This is the **final gate** before a spec is considered "Done".

2.  **Load Artifacts**:

    - Read `specs/NNN-slug/spec.md` (requirements)
    - Read `specs/NNN-slug/plan.md` (technical plan)
    - Read `specs/NNN-slug/tasks.md` (checklist)
    - Identify the files that were modified

3.  **Verification Checks**:

    - **Task Completion**: Are ALL tasks in `tasks.md` marked `[x]`?
    - **Spec Alignment**: Do the code changes match what `spec.md` required?
    - **Plan Alignment**: Do the code changes match what `plan.md` proposed?
    - **Build/Lint Check**: Run `pnpm build` or `pnpm typecheck` to confirm no errors.
    - **Gaps**: Is there anything in the spec that was NOT implemented?

4.  **Output**:

    - Create `specs/NNN-slug/verification.md` with:

      ```markdown
      # Verification Report: [Feature Name]

      ## Status: ✅ PASSED | ❌ FAILED

      ## Checks

      - [x] All tasks completed
      - [x] Spec requirements met
      - [x] Plan followed
      - [x] Build passes
      - [ ] Gaps: [list any gaps]

      ## Conclusion

      [Ready to close / Needs rework]
      ```

5.  **Decision**:
    - If PASSED → Recommend updating `ROADMAP.md` to mark feature complete.
    - If FAILED → List what needs to be fixed before re-running `/speckit.implement`.
