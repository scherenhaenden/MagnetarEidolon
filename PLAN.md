# Canonical Plan of MagnetarEidolon

## Introduction
This plan captures the project's milestones, tasks, estimates, and status. Its structure must be kept intact to ensure consistency across the Magnetar ecosystem.

## Milestones Overview Table

| Milestone ID | Name | Target Date | Description | Completion Criteria |
| :--- | :--- | :--- | :--- | :--- |
| ms-01 | Project Initialization & Governance | 2026-05-15 | Establish the canonical project structure, governance files, and initial repository setup. | All required files (`RULES.md`, `BITACORA.md`, etc.) created and verified. |
| ms-02 | Core Architecture Implementation | 2026-06-01 | Implement the core MagnetarModel (state) and Agent Core (reasoning engine) using Python and Pydantic. | `MagnetarModel` schema defined; `Agent Core` loop implemented; Unit tests passing. |
| ms-03 | Tool System & OS Integration | 2026-06-15 | Develop the tool system abstraction and implement core OS tools (filesystem, shell) for cross-platform support. | Tool interface defined; `FileTool`, `ShellTool` implemented; Platform abstraction layer working. |
| ms-04 | Memory & Knowledge Systems | 2026-07-01 | Integrate LiteLLM for model independence and ChromaDB for long-term memory. | `LiteLLM` provider configured; `ChromaDB` storage implemented; Memory retrieval working. |
| ms-05 | Interface & Distribution | 2026-07-15 | Create CLI with Typer, setup logging, and prepare packaging configuration. | CLI commands working; Logging structured; `pyproject.toml` ready for distribution. |
| ms-voice-01 | Voice UI Prototype | 2024-05-22 | Create a functional prototype with UI and Voice-to-Text capabilities. | App runs; UI accepts input; Transcription works. |

## Task Backlog Table

| Task ID | Milestone | Title | Owner | Effort (pts) | Weight (%) | State | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| task-101 | ms-01 | Create Canonical Documentation Files | Jules | 3 | 5% | in_progress | Creating `RULES.md`, `PLAN.md`, etc. |
| task-102 | ms-01 | Setup Git Repository Structure | Jules | 1 | 2% | ready | Initial commit and branch setup. |
| task-103 | ms-01 | Define Project YAML Template | Jules | 2 | 3% | planned | `projects/_template.project.yml`. |
| task-201 | ms-02 | Define MagnetarModel Pydantic Schema | TBD | 5 | 10% | planned | Core state definition. |
| task-202 | ms-02 | Implement Agent Loop Controller | TBD | 8 | 15% | planned | Main execution logic. |
| task-301 | ms-03 | Implement Abstract Tool Interface | TBD | 3 | 5% | planned | Base class for tools. |
| task-302 | ms-03 | create File System Tools | TBD | 5 | 8% | planned | Read/Write/List files. |
| task-401 | ms-04 | Integrate LiteLLM Provider | TBD | 5 | 10% | planned | Model abstraction. |
| task-402 | ms-04 | Setup ChromaDB for Memory | TBD | 8 | 12% | planned | Vector store integration. |
| task-501 | ms-05 | Build CLI with Typer | TBD | 5 | 8% | planned | Command line interface. |
| task-voice-101 | ms-voice-01 | Setup Project Structure | Jules | 3 | 5% | in_progress | Setup poetry, deps, dirs. |
| task-voice-102 | ms-voice-01 | Implement Voice UI & Logic | Jules | 5 | 10% | planned | Gradio UI + SR Logic. |

## Effort Summary

- **Total effort**: 53 pts
- **Completed**: 0 pts
- **In progress**: 6 pts
- **Remaining**: 47 pts

## State Definitions

- **planned**: Task identified but work has not started.
- **ready**: Task is prioritized and ready for assignment.
- **in_progress**: Work is actively being performed.
- **in_review**: Work is complete, awaiting review/merge.
- **blocked**: Task cannot proceed due to external factors.
- **done**: Task is completed and verified.

## Change Management

This document must be updated whenever tasks change state or scope. Changes must be reflected in the project's YAML file and recorded in `BITACORA.md`.
