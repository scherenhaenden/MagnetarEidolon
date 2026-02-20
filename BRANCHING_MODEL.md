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

## Workflow Rules
1.  **Start**: Create a branch from `master` (or `develop`).
2.  **Work**: Commit changes frequently with clear messages.
3.  **Sync**: Rebase on `master` regularly to avoid conflicts.
4.  **PR**: Open a Pull Request when ready for review. Link relevant tasks.
5.  **Review**: Address feedback and obtain approval.
6.  **Merge**: Squash and merge into the target branch. Delete the feature branch.
