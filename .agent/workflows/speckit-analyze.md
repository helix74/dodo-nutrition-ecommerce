---
description: Cross-artifact consistency & coverage analysis
---

# Speckit Analyze Workflow

1.  **Context**: Ask the user which feature they want to analyze.
2.  **Read All Artifacts**: Load `constitution.md`, `specs/NNN-slug/spec.md`, `specs/NNN-slug/plan.md`, and `specs/NNN-slug/tasks.md`.
3.  **Check Consistency**:
    - Does the Plan follow the Constitution?
    - Do the Tasks cover the entire Plan?
    - Are there any contradictions?
4.  **Report**:
    - Generate a brief report in `specs/NNN-slug/analysis.md` or chat.
    - Highlight any "Violations" or "Missing Items".
