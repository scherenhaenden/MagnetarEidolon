# Canonical Ruleset of MagnetarEidolon

## Introduction
These rules codify the Magnetar standard. The project must comply with them unless a formal exception is explicitly documented in `BITACORA.md`.

## Naming Conventions
- **Repositories:** `magnetar-<domain>-<descriptor>`
- **Branches:** `<type>/<short-description>` where `<type>` is one of `feature`, `fix`, `chore`, `experiment`, `hotfix`
- **Tasks and Blockers:** kebab-case IDs (for example: `task-202`, `blocker-db-outage`)
- **YAML keys:** `lower_snake_case`
- **File names:** must mirror canonical repository names and casing

## Required Files
Every Magnetar project must include:
- `README.md`
- `PLAN.md`
- `BITACORA.md`
- `REQUIREMENTS.md`
- `ARCHITECTURE.md`
- `RULES.md`
- `STATUS.md`
- `TESTING.md`
- `BLOCKERS.md`
- `BRANCHING_MODEL.md`
- `WIP_GUIDELINES.md`
- `CONTRIBUTING.md`
- `projects/<project>.project.yml`

Any omission requires an explicit exemption logged in `BITACORA.md`.

## Branching Conventions
- **master:** immutable release line; merges require successful CI and documentation updates.
- **develop (optional):** aggregates completed features before stabilization.
- **feature branches:** originate from `master` or `develop` and must be rebased before merging.
- **hotfix branches:** start from `master` and require a `STATUS.md` update upon completion.
- Every Pull Request must reference affected task IDs and include `BITACORA.md` entries.

## Allowed Task States
Only these task states are valid:
- `planned`
- `ready`
- `in_progress`
- `in_review`
- `blocked`
- `done`

### State Transition Rules
- `planned -> ready` when scope is refined and owner assigned.
- `ready -> in_progress` when implementation begins.
- `in_progress -> in_review` when deliverable is complete and under validation.
- `in_review -> done` when acceptance criteria are met.
- `in_progress|in_review -> blocked` when impeded by external dependency.
- `blocked -> in_progress` when blocker is resolved.

## Work-In-Progress (WIP) Constraints
- **WIP Limit:** maximum of 2 tasks in `in_progress` per human or AI contributor.
- **Exceptions:** exceeding the limit requires documented approval in `WIP_GUIDELINES.md` and an exception entry in `BITACORA.md`.

## Blocker Lifecycle
1. **Discovery:** log blocker in `BLOCKERS.md` with ID, description, severity, owner, timestamp.
2. **Assessment:** update related risks in `STATUS.md` and mitigation ideas in `BITACORA.md`.
3. **Escalation:** escalate if unresolved within 1 business day.
4. **Resolution:** document fix steps in `BITACORA.md` and mark blocker as resolved.
5. **Retrospective:** record lessons learned and prevention actions.

## Documentation Discipline
- `BITACORA.md` must chronologically capture every state change, decision, and exception.
- `STATUS.md` must be updated at least daily or after each PR merge.
- `PLAN.md` is the source of truth for milestones, dependencies, and assignments.

## AI Agent Responsibilities
- Parse project YAML before acting.
- Do not open PRs unless target tasks are in `in_review`.
- Document assumptions in `BITACORA.md` when uncertainty exists.

## Compliance and Enforcement
- CI should validate required file presence and expected structure.
- Periodic governance audits are required to maintain canonical compliance.
