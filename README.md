# Canonical Project Model of MagnetarEidolon

[![CI (Linux)](https://github.com/scherenhaenden/MagnetarEidolon/actions/workflows/ci-linux.yml/badge.svg)](https://github.com/scherenhaenden/MagnetarEidolon/actions/workflows/ci-linux.yml)
[![CI (macOS)](https://github.com/scherenhaenden/MagnetarEidolon/actions/workflows/ci-macos.yml/badge.svg)](https://github.com/scherenhaenden/MagnetarEidolon/actions/workflows/ci-macos.yml)
[![CI (Windows)](https://github.com/scherenhaenden/MagnetarEidolon/actions/workflows/ci-windows.yml/badge.svg)](https://github.com/scherenhaenden/MagnetarEidolon/actions/workflows/ci-windows.yml)
[![Release](https://github.com/scherenhaenden/MagnetarEidolon/actions/workflows/release.yml/badge.svg)](https://github.com/scherenhaenden/MagnetarEidolon/actions/workflows/release.yml)
[![PyPI](https://img.shields.io/pypi/v/magnetar.svg)](https://pypi.org/project/magnetar/)
[![Python Versions](https://img.shields.io/pypi/pyversions/magnetar.svg)](https://pypi.org/project/magnetar/)
[![License](https://img.shields.io/github/license/scherenhaenden/MagnetarEidolon)](https://github.com/scherenhaenden/MagnetarEidolon/blob/master/LICENSE)

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
| :--- | :--- |
| `PLAN.md` | Central project roadmap, milestones, and task backlog. |
| `BITACORA.md` | Immutable chronological logbook of all events and decisions. |
| `REQUIREMENTS.md` | Functional and non-functional specifications. |
| `ARCHITECTURE.md` | High-level system design and component descriptions. |
| `RULES.md` | Definitive ruleset for naming, workflow, and structure. |
| `STATUS.md` | Current project health, progress, and risk summary. |
| `TESTING.md` | Testing strategy, coverage targets, and bug reporting. |
| `BLOCKERS.md` | Registry of impediments and escalation paths. |
| `BRANCHING_MODEL.md` | Git branching strategy (based on GitFlow). |
| `WIP_GUIDELINES.md` | Policies on concurrent task limits. |
| `CONTRIBUTING.md` | Contribution guidelines, code of conduct, and PR workflow |
| `projects/_template.project.yml` | Machine-readable project schema. |

## Additional Documentation
- `docs/MAGNETAR_TECHNOLOGY_STACK.md`: concrete technology decisions and rationale for implementing Magnetar across Linux, macOS, and Windows.

## GitHub Project Board

To provide a higher-level view of the project's tasks and their status, a GitHub Project board has been set up. This board is the primary tool for visualizing and managing the project's workflow.

- **Project Name**: MagnetarEidolon Development
- **Project URL**: [https://github.com/users/scherenhaenden/projects/8](https://github.com/users/scherenhaenden/projects/8)

While the `PLAN.md` file contains a detailed backlog, the GitHub Project board offers a more interactive way to track progress and priorities.

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
AI agents working on this project must:
1.  **Parse** the `projects/*.project.yml` file to understand context.
2.  **Read** `PLAN.md` and `STATUS.md` to determine current focus.
3.  **Respect** strict constraints in `RULES.md`, `WIP_GUIDELINES.md`, and `BRANCHING_MODEL.md`.
4.  **Log** all actions and decisions in `BITACORA.md` immediately after completion.

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


## PyCharm Compatibility
This repository is compatible with PyCharm, including the `src/` layout and the nested `magnetar_voice_ui/` package.

Recommended setup:
1. Open the repository root in PyCharm.
2. Configure a Python 3.10 interpreter (virtualenv or Poetry environment).
3. Mark `src/` as a **Sources Root** (right-click folder -> *Mark Directory As* -> *Sources Root*).
4. Copy `.env.example` to `.env` and enable **"Paths and environment variables from .env file"** in your run/test configuration.
5. Use `pytest` as the default test runner for the root project.

With this setup, imports such as `magnetar.*` resolve correctly in editor inspections, run configurations, and tests.

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
