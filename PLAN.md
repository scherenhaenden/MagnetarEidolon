# Canonical Plan of MagnetarEidolon

## Introduction
This plan captures the project's milestones, tasks, estimates, and status. Its structure must be kept intact to ensure consistency across the Magnetar ecosystem.

## Milestones Overview Table

| Milestone ID | Name | Target Date | Description | Completion Criteria |
| :--- | :--- | :--- | :--- | :--- |
| ms-01 | Project Initialization & Governance | 2024-05-15 | Establish the canonical project structure, governance files, and initial repository setup. | All required files (`RULES.md`, `BITACORA.md`, etc.) created and verified. |
| ms-02 | Core Architecture Implementation | 2024-06-01 | Implement the core MagnetarModel (state) and Agent Core (reasoning engine) using Python and Pydantic. | `MagnetarModel` schema defined; `Agent Core` loop implemented; Unit tests passing. |
| ms-03 | Tool System & OS Integration | 2024-06-15 | Develop the tool system abstraction and implement core OS tools (filesystem, shell) for cross-platform support. | Tool interface defined; `FileTool`, `ShellTool` implemented; Platform abstraction layer working. |
| ms-04 | Memory & Knowledge Systems | 2024-07-01 | Integrate LiteLLM for model independence and ChromaDB for long-term memory. | `LiteLLM` provider configured; `ChromaDB` storage implemented; Memory retrieval working. |
| ms-05 | Interface & Distribution | 2024-07-15 | Create CLI with Typer, setup logging, and prepare packaging configuration. | CLI commands working; Logging structured; `pyproject.toml` ready for distribution. |

## Task Backlog Table

| Task ID | Milestone | Title | Owner | Effort (pts) | Weight (%) | State | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| task-101 | ms-01 | Create Canonical Documentation Files | Jules | 3 | 5% | done | `RULES.md`, `PLAN.md`, etc. created. |
| task-102 | ms-01 | Setup Git Repository Structure | Jules | 1 | 2% | done | Initial commit and branch setup. |
| task-103 | ms-01 | Define Project YAML Template | Jules | 2 | 3% | done | `projects/_template.project.yml` created. |
| task-201 | ms-02 | Define MagnetarModel Pydantic Schema | Jules | 5 | 10% | done | `src/magnetar/core/model.py` implemented. |
| task-202 | ms-02 | Implement Agent Loop Controller | Jules | 8 | 15% | done | `src/magnetar/core/agent.py` implemented. |
| task-301 | ms-03 | Implement Abstract Tool Interface | Jules | 3 | 5% | done | `src/magnetar/tools/base.py` implemented. |
| task-302 | ms-03 | create File System Tools | Jules | 5 | 8% | done | `src/magnetar/tools/filesystem.py` implemented. |
| task-401 | ms-04 | Integrate LiteLLM Provider | Jules | 5 | 10% | done | `src/magnetar/llm/provider.py` implemented. |
| task-402 | ms-04 | Setup ChromaDB for Memory | Jules | 8 | 12% | done | `src/magnetar/memory/chroma.py` implemented. |
| task-501 | ms-05 | Build CLI with Typer | Jules | 5 | 8% | done | `src/magnetar/cli.py` implemented. |

## Effort Summary

- **Total effort**: 45 pts
- **Completed**: 45 pts
- **In progress**: 0 pts
- **Remaining**: 0 pts

## State Definitions

- **planned**: Task identified but work has not started.
- **ready**: Task is prioritized and ready for assignment.
- **in_progress**: Work is actively being performed.
- **in_review**: Work is complete, awaiting review/merge.
- **blocked**: Task cannot proceed due to external factors.
- **done**: Task is completed and verified.

## Change Management

This document must be updated whenever tasks change state or scope. Changes must be reflected in the project's YAML file and recorded in `BITACORA.md`.
