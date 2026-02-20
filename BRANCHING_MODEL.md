# Branching Model of MagnetarEidolon

## Introduction
This document describes the Git branching strategy used in the MagnetarEidolon project. It is based on a simplified GitFlow model designed for continuous integration and stability.

## Core Branches

### `master`
- **Role**: The main integration branch. It contains the latest stable code that is ready for release.
- **Protection**: Direct commits are prohibited. Changes must be merged via Pull Requests (PRs).
- **Stability**: Must always be in a deployable state. CI/CD pipelines run on every commit.

### `develop` (Optional)
- **Role**: The main development branch where feature branches are merged before stabilization.
- **Usage**: Use if the project complexity requires an integration step before `master`.

## Supporting Branches

### Feature Branches (`feature/*`)
- **Source**: `master` (or `develop`)
- **Target**: `master` (or `develop`)
- **Naming**: `feature/<short-description>` (e.g., `feature/add-chroma-memory`)
- **Lifecycle**: Created for new features or non-trivial changes. Deleted after merge.

### Bugfix Branches (`fix/*`)
- **Source**: `master` (or `develop`)
- **Target**: `master` (or `develop`)
- **Naming**: `fix/<issue-id>-<short-description>` (e.g., `fix/issue-102-typo`)
- **Lifecycle**: Created to fix bugs in the development line.

### Hotfix Branches (`hotfix/*`)
- **Source**: `master` (tag)
- **Target**: `master` and `develop`
- **Naming**: `hotfix/<version>-<description>`
- **Lifecycle**: Urgent fixes for production issues. Triggers a `STATUS.md` update.

### Chore Branches (`chore/<short-description>`)
- **Source**: `master` (or `develop`)
- **Target**: `master` (or `develop`)
- **Naming**: `chore/<short-description>`
- **Lifecycle**: For maintenance, refactoring, documentation, or other non-feature changes.

### Experiment Branches (`experiment/<short-description>`)
- **Source**: `master` (or `develop`)
- **Target**: `master` (or `develop`)
- **Naming**: `experiment/<short-description>`
- **Lifecycle**: For exploratory work that may or may not be merged.

## Workflow & Merge Rules
1.  **Start**: Create a branch from `master` (or `develop`).
2.  **Work**: Commit changes frequently with clear messages.
3.  **Sync**: Rebase your branch on `master` (or `develop`) regularly to avoid conflicts before opening a PR.
4.  **PR**: Open a Pull Request when ready for review. The PR must reference relevant task IDs from `PLAN.md` and include updates to `BITACORA.md` if applicable.
5.  **Review**: Address feedback and obtain approval from the required number of reviewers.
6.  **Merge**: Squash and merge into the target branch. Delete the source branch after merging.
7.  **CI/CD**: All merges to `master` must pass the full CI suite, including tests and governance documentation checks.
