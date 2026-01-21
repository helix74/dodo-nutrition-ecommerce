---
description: The "Maestro" - Analyze project goals, define architecture, and create a phased implementation roadmap.
---

# Speckit Architect Workflow

1.  **Context**:

    - This workflow acts as the **Principal Engineer / Architect**.
    - It does _not_ write code. It defines _what_ needs to be built and in _what order_.

2.  **Input**:

    - Ask the user for the **High-Level Project Vision** (e.g., "I want to build an Uber clone").
    - Read `constitution.md` to ensure architectural alignment.

3.  **Analysis**:

    - Break the vision down into **Phases** (e.g., MVP, Beta, V1).
    - For each Phase, identify the necessary **Features** (e.g., Auth, Database, API, UI).
    - Define the **Dependencies** (e.g., "Database must be set up before API").

4.  **Output**:

    - Create or Update `ROADMAP.md` in the project root.
    - **Format**:

      ```markdown
      # Project Roadmap

      ## Phase 1: Foundation

      - [ ] Feature: Database Setup (Priority: High)
      - [ ] Feature: Authentication (Priority: High)

      ## Phase 2: Core Loop

      - [ ] Feature: Booking Flow
      ```

    - **Architecture Overview**: Add a section in `ROADMAP.md` describing the high-level data flow and schema suggestions.

5.  **Handoff**:
    - Suggest the next step: "Now run `/speckit.specify` for the first item in Phase 1."
