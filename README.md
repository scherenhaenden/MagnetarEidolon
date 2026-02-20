# Canonical Project Model of MagnetarEidolon

## Purpose
MagnetarEidolon exists to provide a canonical, reusable project governance and execution model for building Magnetar-aligned agent systems with transparent planning, traceable delivery, and cross-platform portability. This repository solves the problem of fragmented project standards by consolidating documentation, planning artifacts, and operational controls into a single, reproducible baseline. It follows the Magnetar standard for documentation, planning, and governance.

## How to Use This Repository
1. Clone this canonical model repository.
2. Copy and complete `projects/_template.project.yml` for your concrete project instance.
3. Replicate and maintain the required documentation set in the repository root.
4. Follow WIP, branching, and blocker handling rules from governance documents.
5. Consult the example project artifacts to resolve process or formatting questions.

## Project Contents
| File | Purpose |
| --- | --- |
| `PLAN.md` | Project tasks, milestones, ownership, and effort tracking. |
| `BITACORA.md` | Chronological logbook of state changes, decisions, blockers, and exceptions. |
| `REQUIREMENTS.md` | Functional and non-functional requirements baseline. |
| `ARCHITECTURE.md` | System and module architecture, including component interactions. |
| `RULES.md` | Canonical naming conventions, task states, and workflow standards. |
| `STATUS.md` | Health summary, milestone status, and risk outlook. |
| `TESTING.md` | Testing strategy, coverage targets, and reporting process. |
| `BLOCKERS.md` | Active and resolved blockers, ownership, and escalation tracking. |

Governance references: `BRANCHING_MODEL.md` and `WIP_GUIDELINES.md`.

## Progress Model Overview
Progress is tracked through milestones and tasks that move through explicit lifecycle states:

`planned -> ready -> in_progress -> in_review -> done`

When blocked, a task transitions to `blocked` and is linked to an entry in `BLOCKERS.md`. Every state transition and significant decision must be recorded in `BITACORA.md`.

## YAML Project Schema
The `projects/_template.project.yml` file is the canonical machine-readable schema. It captures:
- metadata
- stakeholders
- milestones
- tasks
- risks
- reporting hooks

This schema is the authoritative bridge between human planning artifacts and automation-ready project state.

## Guidance for AI Collaborators
AI collaborators must:
- Parse the project YAML file before beginning work.
- Use `PLAN.md` and `STATUS.md` to determine execution focus.
- Respect `RULES.md`, `WIP_GUIDELINES.md`, and `BRANCHING_MODEL.md`.
- Update `BITACORA.md` after completing any work or changing task state.

## Architecture Diagram (Recommended)
```text
[RULES + BRANCHING + WIP + BLOCKERS]
                 |
                 v
              [PLAN]
                 |
                 v
[REQUIREMENTS] [ARCHITECTURE] [TESTING] [STATUS]
                 |
                 v
             [BITACORA]
                 |
                 v
   [projects/*.project.yml machine state]
```

## Applying This Template
1. Copy this repository structure into your new project.
2. Replace placeholder content with project-specific details.
3. Instantiate and validate a project YAML file in `projects/`.
4. Define initial milestones and tasks in `PLAN.md`.
5. Log initial baseline state in `STATUS.md` and `BITACORA.md`.

## Validating Canon Compliance
- [ ] All required canonical files exist.
- [ ] Project YAML exists and matches canonical schema fields.
- [ ] `BITACORA.md` is updated chronologically and immutably.
- [ ] Active branches conform to `BRANCHING_MODEL.md`.
- [ ] Testing commitments align with `TESTING.md`.
- [ ] Blocker handling follows `BLOCKERS.md` escalation process.
