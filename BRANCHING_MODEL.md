# Branching Model for MagnetarEidolon

This project uses a lightweight GitFlow-inspired model.

## Long-Lived Branches
- `master`: stable release branch; protected, merge-only.
- `develop` (optional): integration branch for upcoming release increments.

## Short-Lived Branches
- `feature/<short-description>`: net-new capabilities.
- `fix/<short-description>`: defect correction.
- `chore/<short-description>`: maintenance/refactor/docs.
- `experiment/<short-description>`: exploratory work.
- `hotfix/<short-description>`: urgent production corrections from `master`.

## Merge Rules
- Rebase feature/fix/chore branches before opening PR.
- Each PR must reference task IDs and include `BITACORA.md` updates.
- `master` merges require passing CI and updated governance docs where applicable.
