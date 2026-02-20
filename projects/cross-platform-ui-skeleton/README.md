# Canonical Project Model of Cross-Platform UI Skeleton

## Purpose
Cross-Platform UI Skeleton exists to establish a reusable, governed baseline for this module and to reduce ambiguity in implementation. It follows the Magnetar standard for documentation, planning, and governance.

## How to Use This Repository
1. Clone the canonical model.
2. Copy and fill out `projects/_template.project.yml`.
3. Replicate the required documentation set.
4. Follow the WIP, branching, and blocker rules.
5. Consult the example project to resolve questions.

## Project Contents

| File | Purpose |
| :--- | :--- |
| `PLAN.md` | Project tasks & milestones. |
| `BITACORA.md` | Chronological logbook. |
| `REQUIREMENTS.md` | Functional & non-functional specs. |
| `ARCHITECTURE.md` | System/module structure. |
| `RULES.md` | Naming & workflow standards. |
| `STATUS.md` | Health summary & progress stats. |
| `TESTING.md` | Test coverage & reporting rules. |
| `BLOCKERS.md` | Documented blockers & escalation paths. |
| `BRANCHING_MODEL.md` | Governance reference for branch strategy. |
| `WIP_GUIDELINES.md` | Governance reference for WIP limits. |

## Progress Model Overview
Progress is tracked across milestones and task states using this lifecycle:
`planned` → `in_progress` → `in_review` → `done`.
All state changes must be recorded in `BITACORA.md`.

## YAML Project Schema
`projects/_template.project.yml` is the canonical machine-readable schema containing metadata, stakeholders, milestones, tasks, risks, and reporting settings.

## Guidance for AI Collaborators
AI collaborators must:
- Parse the project YAML file.
- Use `PLAN.md` and `STATUS.md` to determine focus.
- Respect `RULES.md`, `WIP_GUIDELINES.md`, and `BRANCHING_MODEL.md`.
- Update `BITACORA.md` after completing any work.

## Architecture Diagram
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
1. Copy the repository structure.
2. Replace placeholder content with project-specific details.
3. Instantiate and validate a project YAML file.
4. Establish initial milestones.
5. Log the initial state in `PLAN.md`, `STATUS.md`, and `BITACORA.md`.

## Validating Canon Compliance
- [ ] All required files exist.
- [ ] Project YAML matches the schema.
- [ ] `BITACORA.md` is updated chronologically.
- [ ] Active branches follow the `BRANCHING_MODEL.md` rules.
- [ ] Testing commitments and blocker processes match `TESTING.md` and `BLOCKERS.md`.
