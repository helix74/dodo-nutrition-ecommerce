---
description: Define what you want to build (requirements and user stories)
---

# Speckit Specify Workflow

1.  **Input**: Ask the user for a high-level description of the feature or project they want to build.
2.  **Directory Setup**:
    - Ask the user for a short "slug" name for this feature (e.g., `create-taskify`).
    - Find the next available ID (e.g., `001`, `002`).
    - Create a directory: `specs/NNN-slug/` (e.g., `specs/001-create-taskify/`).
3.  **Draft Specification**:
    - Create `specs/NNN-slug/spec.md`.
    - **Goal**: Clearly state the user's objective.
    - **User Stories**: Break down the goal into user-centric stories.
    - **Non-Functional Requirements**: List performance, security, or usability constraints (referencing `constitution.md`).
4.  **Refine**:
    - Ask clarifying questions if the input is vague.
    - Ensure the spec is implementation-agnostic.
5.  **Output**: A clear, approved `spec.md` inside the feature folder.
