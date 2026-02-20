# Canonical Project Model of MagnetarEidolon

## Purpose
MagnetarEidolon is a cross-OS autonomous agent framework designed to enable portable, persistent, and intelligent agents. It is built around a clear separation between the agent's cognition state (`MagnetarModel`) and its execution logic (`Agent Core`).

This repository follows the **Magnetar Canonical Project Model**, a rigorous standard for documentation, planning, and governance to ensure consistency, transparency, and AI-readiness.

## How to Use This Repository

1.  **Clone the Canonical Model**: Start by cloning this repository to your local machine.
2.  **Initialize Project**: Copy `projects/_template.project.yml` to `projects/your-project.yml` and fill in the details.
3.  **Consult Documentation**: Familiarize yourself with the required documentation set listed below.
4.  **Follow Governance**: Adhere to the rules in `RULES.md`, `BRANCHING_MODEL.md`, and `WIP_GUIDELINES.md`.
5.  **Log Progress**: Update `BITACORA.md` with every significant event or decision.

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
| `projects/_template.project.yml` | Machine-readable project schema. |

## Progress Model Overview
Projects progress through defined states: `planned` -> `ready` -> `in_progress` -> `in_review` -> `done`.
- **Planning**: Tasks are defined in `PLAN.md` and the project YAML.
- **Execution**: Active tasks are tracked in `PLAN.md`.
- **Logging**: Every state transition (e.g., `ready` to `in_progress`) must be recorded in `BITACORA.md`.
- **Status**: `STATUS.md` provides a high-level snapshot for stakeholders.

## YAML Project Schema
The `projects/_template.project.yml` file contains the canonical machine-readable schema. It defines metadata, stakeholders, milestones, tasks, and risks. This file allows AI agents and tools to parse the project structure programmatically.

## Guidance for AI Collaborators
AI agents working on this project must:
1.  **Parse** the `projects/*.project.yml` file to understand context.
2.  **Read** `PLAN.md` and `STATUS.md` to determine current focus.
3.  **Respect** strict constraints in `RULES.md`, `WIP_GUIDELINES.md`, and `BRANCHING_MODEL.md`.
4.  **Log** all actions and decisions in `BITACORA.md` immediately after completion.

## Applying This Template
To apply this template to a new project:
1.  Copy the entire repository structure.
2.  Replace placeholder content in `README.md` and `projects/_template.project.yml` with project-specific details.
3.  Establish initial milestones in `PLAN.md`.
4.  Log the initialization in `BITACORA.md` and set the initial status in `STATUS.md`.

## Validating Canon Compliance
Ensure your project adheres to the Magnetar Canon:
- [ ] All required files (listed above) exist.
- [ ] The project YAML matches the schema.
- [ ] `BITACORA.md` is updated chronologically.
- [ ] Active branches follow `BRANCHING_MODEL.md`.
- [ ] Testing and blocker processes match `TESTING.md` and `BLOCKERS.md`.
