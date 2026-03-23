# Contributing to MagnetarEidolon

## Introduction
This document provides guidelines for contributing to the MagnetarEidolon project. By following these rules, we ensure a high-quality, maintainable, and consistent codebase.

## Development Environment Setup

### Prerequisites
- Node.js 22+
- npm
- Git

### Installation
1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/scherenhaenden/MagnetarEidolon.git
    cd MagnetarEidolon
    ```
2.  **Install Dependencies**:
    ```bash
    npm run setup
    ```
3.  **Run the Main Development Surface**:
    ```bash
    npm run dev
    ```

## Code Style & Standards

### TypeScript / Angular / NestJS
- **Architecture**: Follow the shared TypeScript product architecture in `README.md` and `ARCHITECTURE.md`: Angular UI in `apps/magnetar-ui`, NestJS backend in `apps/magnetar-api`, and shared runtime code in `packages/magnetar-sdk`.
- **Implementation Style**: Keep runtime and domain logic OOP-first, prefer pure methods and pure stateless helpers where possible, and isolate side effects at clear boundary layers.
- **Type Safety**: Keep `typecheck` clean in both app workspaces before opening a PR.

### Validation Commands
Use the repository root wrappers unless you are working on a workspace-specific issue:

```bash
npm run validate
npm run test
npm run typecheck
npm run build
```

Useful direct workspace commands:

```bash
# Commands for the Angular UI workspace (run from within apps/magnetar-ui)
# Note: `npm run start` is a long-running process. Run the other commands in a new terminal.
npm run start
npm run cli:dev -- about
npm run test:ci

# Commands for the NestJS API workspace (run from within apps/magnetar-api)
# Note: `npm run start:dev` is a long-running process. Run the other commands in a new terminal.
npm run start:dev
npm run test
```

## Contribution Workflow
1.  **Review Governance**: Before starting, review `RULES.md`, `PLAN.md`, and `WIP_GUIDELINES.md`.
2.  **Setup**: Follow the "Development Environment Setup" instructions above. Instantiate or update the project YAML in `projects/` for your workstream.
3.  **Branch**: Create a branch from `master` using the naming conventions defined in `BRANCHING_MODEL.md`.
    - **Immediately create a directory** in `branches/` corresponding to your branch name (e.g., `branches/feature-my-feature/`).
4.  **Work**: Implement your feature or fix. Link your work to the corresponding task IDs in `PLAN.md`.
5.  **Documentation**: Record state changes, decisions, and discoveries in a `CHANGES.md` file within your branch directory (e.g., `branches/feature-my-feature/CHANGES.md`).
    - **Do not edit root documentation files directly** to avoid merge conflicts.
    - Consolidate these changes into the main `BITACORA.md` and `PLAN.md` just before merging.
6.  **Testing**: Run all validation checks and ensure tests pass locally.
7.  **Pull Request**: Open a Pull Request against `master`.

## Pull Request Requirements
- The PR title should use a semantic commit message format (e.g., `feat: add chroma memory`).
- The PR description must provide a summary of changes, outline risks, and include testing evidence.
- References the affected task IDs from `PLAN.md`.
- Includes relevant `BITACORA.md` entries for traceability.
- Ensures `STATUS.md` and `PLAN.md` are kept aligned with the changes.
- Documents any new blockers and proposed mitigation in `BLOCKERS.md`.
- Includes concrete validation evidence from the root scripts or the affected workspace scripts.

## Reporting Issues
Please use the GitHub Issue Tracker for general issues or update `BLOCKERS.md` for critical project impediments.

- Issue Tracker: `https://github.com/scherenhaenden/MagnetarEidolon/issues`
- Primary Project Board: `https://github.com/users/scherenhaenden/projects/7`
- When creating a new implementation issue, check for an existing item first and then add the new issue to the `MagnetarEidolon` GitHub project board if it is net-new work.
