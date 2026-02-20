# Canonical Ruleset of MagnetarEidolon

## Introduction
This document establishes the fundamental rules and workflow standards for the MagnetarEidolon project. These rules codify the Magnetar standard, and the entire project must comply unless a formal exception is documented in `BITACORA.md`.

## Naming Conventions
- **Repositories**: `magnetar-<domain>-<descriptor>` (e.g., `magnetar-core-agent`, `magnetar-memory-chroma`)
- **Branches**: `<type>/<short-description>`, where type is:
  - `feature`: New functionality
  - `fix`: Bug fixes
  - `chore`: Maintenance tasks
  - `experiment`: Experimental features
  - `hotfix`: Urgent production fixes
- **Tasks and Blockers**: `kebab-case` (e.g., `task-202`, `blocker-db-outage`)
- **YAML Keys**: `lower_snake_case`
- **File Names**: Must mirror those in the canonical repository.

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
- `projects/_template.project.yml`

Any omission requires an explicit exemption logged in `BITACORA.md`.

## Branching Conventions
- **master**: Immutable release line. Merges require successful CI and documentation updates.
- **develop** (optional): Aggregates completed features before stabilization.
- **feature branches**: Originate from `master` or `develop` and must be rebased before merging.
- **hotfix branches**: Start from `master` and must trigger a `STATUS.md` update upon completion.
- **Conflict Avoidance**: Every branch must have a corresponding directory in `branches/` containing its documentation changes. Direct edits to root logs are prohibited until merge.
- Each Pull Request must reference the tasks it affects and include `BITACORA.md` entries.

## Allowed Task States
Tasks must be in one of the following states:
1. **planned**: Task is defined but not yet scheduled for immediate work.
2. **ready**: Task is prioritized and ready to be picked up.
3. **in_progress**: Work has actively begun on the task.
4. **in_review**: Work is complete and awaiting code review or QA.
5. **blocked**: Task cannot proceed due to an external impediment.
6. **done**: Task is fully complete and merged.

**Allowed Transitions:**
- `planned` -> `ready`
- `ready` -> `in_progress`
- `in_progress` -> `in_review` | `blocked`
- `in_review` -> `done` | `in_progress` (if feedback requires changes)
- `blocked` -> `ready` | `in_progress` (when unblocked)

## Work-In-Progress (WIP) Constraints
- **WIP Limit**: Maximum of **2** tasks in `in_progress` state per individual or AI agent.
- **Exceptions**: Exceeding the limit requires approval documented in `WIP_GUIDELINES.md` and logged in `BITACORA.md`.

## Blocker Lifecycle
1. **Discovery**: Log in `BLOCKERS.md` with ID, description, severity, owner, and timestamp.
2. **Assessment**: Update risks in `STATUS.md` and note mitigation ideas in `BITACORA.md`.
3. **Escalation**: If not resolved within one business day, escalate to project lead.
4. **Resolution**: Document solution steps in `BITACORA.md` and update blocker status to `resolved`.
5. **Retrospective**: Capture lessons learned in `BITACORA.md`.

## Documentation Discipline
- **BITACORA.md**: Must chronologically record every state change, decision, or exception.
- **STATUS.md**: Must be updated at least once per day or after each PR merge.
- **PLAN.md**: Is the source of truth for milestones and task assignments.

## AI Agent Responsibilities
- Parse the project YAML file before acting.
- Do not open PRs without confirming the task state is `in_review`.
- Document assumptions in `BITACORA.md` when uncertain.

## Compliance and Enforcement
- Continuous Integration (CI) should validate the presence and structure of required files.
- Periodic audits will be conducted to ensure adherence to the canonical model.
