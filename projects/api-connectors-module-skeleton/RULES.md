# Canonical Ruleset of API Connectors Module Skeleton

## Introduction
These rules codify the Magnetar standard for API Connectors Module Skeleton. The entire project must comply unless a formal exception is documented in `BITACORA.md`.

## Naming Conventions
- **Repositories:** `magnetar-<domain>-<descriptor>`
- **Branches:** `<type>/<short-description>` where `type` is `feature`, `fix`, `chore`, `experiment`, or `hotfix`
- **Tasks and Blockers:** `kebab-case`
- **YAML Keys:** `lower_snake_case`
- **File Names:** Must mirror those in the canonical repository.

## Required Files
`README.md`, `PLAN.md`, `BITACORA.md`, `REQUIREMENTS.md`, `ARCHITECTURE.md`, `RULES.md`, `STATUS.md`, `TESTING.md`, `BLOCKERS.md`, `BRANCHING_MODEL.md`, `WIP_GUIDELINES.md`, `CONTRIBUTING.md`, and `projects/<project>.project.yml`.
Any omission requires an explicit exemption logged in `BITACORA.md`.

## Branching Conventions
- `master`: Immutable release line; merges require successful CI and documentation updates.
- `develop` (optional): Aggregates completed features before stabilization.
- `feature` branches: Originate from `master` or `develop` and must be rebased before merging.
- `hotfix` branches: Start from `master` and must trigger a `STATUS.md` update upon completion.
- Every PR must reference affected tasks and include `BITACORA.md` entries.

## Allowed Task States
1. `planned`
2. `ready`
3. `in_progress`
4. `in_review`
5. `blocked`
6. `done`

Allowed transitions: `planned` → `ready`; `ready` → `in_progress`; `in_progress` → `in_review` or `blocked`; `in_review` → `done` or `in_progress`; `blocked` → `ready` or `in_progress`.

## Work-In-Progress (WIP) Constraints
- WIP limit: maximum two `in_progress` tasks per contributor/AI agent.
- Exceeding the limit requires approval documented in `WIP_GUIDELINES.md` and `BITACORA.md`.

## Blocker Lifecycle
1. Discovery: log in `BLOCKERS.md` with ID, description, severity, owner, and timestamp.
2. Assessment: update risks in `STATUS.md` and mitigation notes in `BITACORA.md`.
3. Escalation: escalate unresolved blockers after one business day.
4. Resolution: document solution in `BITACORA.md` and mark blocker `resolved`.
5. Retrospective: capture lessons learned.

## Documentation Discipline
- `BITACORA.md`: Record every state change, decision, or exception chronologically.
- `STATUS.md`: Update at least daily or after each PR merge.
- `PLAN.md`: Source of truth for milestones and assignments.

## AI Agent Responsibilities
- Parse project YAML before acting.
- Do not open PRs without confirming task state is `in_review`.
- Document assumptions in `BITACORA.md` when uncertain.

## Compliance and Enforcement
CI should validate required file presence and structure. Periodic audits enforce compliance.
