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

## Pull Request Process

1.  **Fork & Branch**: Create a feature branch from `master` (or `develop`).
2.  **Make Changes**: Implement your feature or fix. Ensure tests pass locally.
3.  **Update Documentation**: Update `README.md`, `REQUIREMENTS.md`, or other relevant docs if needed.
4.  **Create PR**: Open a Pull Request against `master`.
    -   **Title**: Use semantic commit messages (e.g., `feat: add chroma memory`).
    -   **Description**: Explain the changes, reference related tasks/issues, and list verification steps.
5.  **Review**: Address feedback from reviewers.
6.  **Merge**: Once approved and CI passes, your changes will be merged.

## Reporting Issues
Please use the GitHub Issue Tracker or update `BLOCKERS.md` for critical issues.
