# Canonical Plan of MagnetarEidolon

## Introduction
This plan captures the project's milestones, tasks, estimates, and status. Its structure must be kept intact to ensure consistency across the Magnetar ecosystem.

## Milestones Overview Table

| Milestone ID | Name | Target Date | Description | Completion Criteria |
| :--- | :--- | :--- | :--- | :--- |
| `ms-01` | Canon Bootstrap | 2026-03-05 | Establish canonical governance and planning artifacts. | All required canonical docs created and reviewed. |
| `ms-02` | Magnetar Model Baseline | 2026-03-12 | Define MagnetarEidolon architecture and machine-readable project schema. | Architecture and project YAML align with requirements and rules. |
| `ms-03` | Operational Readiness | 2026-03-20 | Finalize testing, blocker flow, and contribution processes. | Governance processes validated and initial progress reporting active. |
| `ms-04` | Project Initialization & Governance | 2026-05-15 | Establish the canonical project structure, governance files, and initial repository setup. | All required files (`RULES.md`, `BITACORA.md`, etc.) created and verified. |
| `ms-05` | Core Architecture Implementation | 2026-06-01 | Implement the core MagnetarModel (state) and Agent Core (reasoning engine) using Python and Pydantic. | `MagnetarModel` schema defined; `Agent Core` loop implemented; Unit tests passing. |
| `ms-06` | Tool System & OS Integration | 2026-06-15 | Develop the tool system abstraction and implement core OS tools (filesystem, shell) for cross-platform support. | Tool interface defined; `FileTool`, `ShellTool` implemented; Platform abstraction layer working. |
| `ms-07` | Memory & Knowledge Systems | 2026-07-01 | Integrate LiteLLM for model independence and ChromaDB for long-term memory. | `LiteLLM` provider configured; `ChromaDB` storage implemented; Memory retrieval working. |
| `ms-08` | Interface & Distribution | 2026-07-15 | Create CLI with Typer, setup logging, and prepare packaging configuration. | CLI commands working; Logging structured; `pyproject.toml` ready for distribution. |

## Task Backlog Table

| Task ID | Milestone | Title | Owner | Effort (pts) | State | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `task-101` | `ms-01` | Create canonical documentation baseline | Core Team | 5 | done | Initial canonical files created. |
| `task-102` | `ms-02` | Draft Magnetar architecture and stack mapping | Core Team | 4 | in_review | Validate against architecture and stack docs. |
| `task-103` | `ms-02` | Build project YAML schema template | Core Team | 3 | done | `_template.project.yml` completed. |
| `task-104` | `ms-03` | Define governance for branching and WIP | Core Team | 4 | ready | Pending team review kickoff. |
| `task-105` | `ms-03` | Establish testing and blocker controls | Core Team | 6 | in_progress | Drafting acceptance and escalation mechanics. |
| `task-201` | `ms-04` | Create Canonical Documentation Files | Jules | 3 | done | Creating `RULES.md`, `PLAN.md`, etc. created. |
| `task-202` | `ms-04` | Setup Git Repository Structure | Jules | 1 | done | Initial commit and branch setup. |
| `task-203` | `ms-04` | Define Project YAML Template | Jules | 2 | done | `projects/_template.project.yml` created. |
| `task-301` | `ms-05` | Define MagnetarModel Pydantic Schema | Jules | 5 | done | Core state definition. `src/magnetar/core/model.py` implemented. |
| `task-302` | `ms-05` | Implement Agent Loop Controller | Jules | 8 | done | Main execution logic. `src/magnetar/core/agent.py` implemented. |
| `task-401` | `ms-06` | Implement Abstract Tool Interface | Jules | 3 | done | Base class for tools. `src/magnetar/tools/base.py` implemented. |
| `task-402` | `ms-06` | Create File System Tools | Jules | 5 | done | Read/Write/List files. `src/magnetar/tools/filesystem.py` implemented. |
| `task-501` | `ms-07` | Integrate LiteLLM Provider | Jules | 5 | done | Model abstraction. `src/magnetar/llm/provider.py` implemented. |
| `task-502` | `ms-07` | Setup ChromaDB for Memory | Jules | 8 | done | Vector store integration. `src/magnetar/memory/chroma.py` implemented. |
| `task-601` | `ms-08` | Build CLI with Typer | Jules | 5 | done | Command line interface. `src/magnetar/cli.py` implemented. |

## Effort Summary

- **Total effort**: 67 pts
- **Completed**: 53 pts
- **In progress**: 6 pts
- **Remaining**: 8 pts

## State Definitions

- **planned**: Task identified but work has not started.
- **ready**: Task is prioritized and ready for assignment.
- **in_progress**: Work is actively being performed.
- **in_review**: Work is complete, awaiting review/merge.
- **blocked**: Task cannot proceed due to external factors.
- **done**: Task is completed and verified.

## Change Management

This document must be updated whenever tasks change state or scope. Changes must be reflected in the project's YAML file and recorded in `BITACORA.md`.
