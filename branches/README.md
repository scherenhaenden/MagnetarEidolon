# Branch Documentation

This directory is used to store documentation and change logs for individual branches to avoid merge conflicts in the main project files (e.g., `PLAN.md`, `BITACORA.md`, `STATUS.md`).

## Workflow

1.  When creating a new branch (e.g., `feature/my-feature`), create a corresponding directory here: `branches/feature-my-feature/`.
2.  Inside your branch directory, create a `CHANGES.md` (or similarly named file) to document your progress, updates to `PLAN.md`, `BITACORA.md` entries, and any other relevant notes.
3.  **Do not** directly edit the root `PLAN.md` or `BITACORA.md` in your branch unless necessary for conflict resolution.
4.  When your branch is ready to merge:
    - Manually consolidate the content from your `branches/feature-my-feature/CHANGES.md` into the main root documentation files.
    - Ensure the root files are updated correctly.
    - You may delete your branch directory after the merge is complete and verified, or keep it for history as per project policy.
