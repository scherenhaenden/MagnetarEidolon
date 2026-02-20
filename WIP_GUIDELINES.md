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

## Prioritization Rules
- Complete highest-risk/highest-value tasks first.
- Avoid starting a new task while a current one is pending review unless explicitly approved.

## Exceptions Process

If you need to exceed the WIP limit (e.g., due to urgent hotfixes or blocked dependencies):
1.  **Request Approval**: Notify the team or project lead and obtain approval from the governance owner.
2.  **Document Exception**: Log the reason and approved duration in `BITACORA.md`, including a timestamp and author.
    -   *Example*: "Exception: Assigned task-205 (Hotfix) while task-102 is blocked. WIP limit exceeded by 1."
3.  **Prioritize Completion**: Focus on closing the excess task immediately.

## Review Hand-off
- Before moving a task to `in_review`, ensure all acceptance criteria are met.
- Update dependent documents (`STATUS.md`, `PLAN.md`, `BLOCKERS.md`) and add clear acceptance notes to the task or PR.

## Review and Enforcement

- **Daily Standup**: WIP limits are reviewed daily.
- **Audit**: Periodic checks ensure compliance with `RULES.md`.
- **Bot Enforcement**: CI/CD pipelines may block new PRs if WIP limits are exceeded without a documented exception.
