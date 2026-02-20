# Contributing to MagnetarEidolon

## Introduction
This document provides guidelines for contributing to the MagnetarEidolon project. By following these rules, we ensure a high-quality, maintainable, and consistent codebase.

## Development Environment Setup

### Prerequisites
- Python 3.10+
- Poetry (Dependency Management)
- Git

### Installation
1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/your-org/magnetar-eidolon.git
    cd magnetar-eidolon
    ```
2.  **Install Dependencies**:
    ```bash
    poetry install
    ```
3.  **Activate Virtual Environment**:
    ```bash
    poetry shell
    ```

## Code Style & Standards

### Python
- **Formatter**: Use `black` for code formatting.
- **Linter**: Use `ruff` for linting.
- **Type Checking**: Use `mypy` for static type checking.

### Pre-commit Hooks
We recommend installing pre-commit hooks to automate checks:
```bash
pre-commit install
```

## Contribution Workflow
1.  **Review Governance**: Before starting, review `RULES.md`, `PLAN.md`, and `WIP_GUIDELINES.md`.
2.  **Setup**: Follow the "Development Environment Setup" instructions above. Instantiate or update the project YAML in `projects/` for your workstream.
3.  **Branch**: Create a branch from `master` using the naming conventions defined in `BRANCHING_MODEL.md`.
4.  **Work**: Implement your feature or fix. Link your work to the corresponding task IDs in `PLAN.md`.
5.  **Documentation**: Update all relevant documentation. Record state changes, decisions, and discoveries in `BITACORA.md`.
6.  **Testing**: Run all validation checks and ensure tests pass locally.
7.  **Pull Request**: Open a Pull Request against `master`.

## Pull Request Requirements
- The PR title should use a semantic commit message format (e.g., `feat: add chroma memory`).
- The PR description must provide a summary of changes, outline risks, and include testing evidence.
- References the affected task IDs from `PLAN.md`.
- Includes relevant `BITACORA.md` entries for traceability.
- Ensures `STATUS.md` and `PLAN.md` are kept aligned with the changes.
- Documents any new blockers and proposed mitigation in `BLOCKERS.md`.

## Reporting Issues
Please use the GitHub Issue Tracker for general issues or update `BLOCKERS.md` for critical project impediments.
