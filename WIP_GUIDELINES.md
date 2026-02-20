# Work-In-Progress (WIP) Guidelines for MagnetarEidolon

## Introduction
These guidelines define the policies and limits for concurrent tasks to maintain focus and prevent context switching in the MagnetarEidolon project.

## WIP Constraints

### Individual Limits
- **Maximum Concurrent Tasks**: **2** tasks in `in_progress` state per contributor or AI agent.
- **Rationale**: Reduces cognitive load, ensures timely completion, and minimizes merge conflicts.

### Team/Project Limits
- **Maximum Active Features**: **3** concurrent feature branches open for review.
- **Rationale**: Prevents review bottlenecks and ensures continuous integration.

## Exceptions Process

If you need to exceed the WIP limit (e.g., due to urgent hotfixes or blocked dependencies):
1.  **Request Approval**: Notify the team or project lead via `BITACORA.md`.
2.  **Document Exception**: Log the reason and approved duration in `BITACORA.md`.
    -   *Example*: "Exception: Assigned task-205 (Hotfix) while task-102 is blocked. WIP limit exceeded by 1."
3.  **Prioritize Completion**: Focus on closing the excess task immediately.

## Review and Enforcement

- **Daily Standup**: WIP limits are reviewed daily.
- **Audit**: Periodic checks ensure compliance with `RULES.md`.
- **Bot Enforcement**: CI/CD pipelines may block new PRs if WIP limits are exceeded without documentation.
