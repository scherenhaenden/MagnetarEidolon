# Changes for feature/rehome-ui-and-bootstrap-ts-testing

## Summary
Starts the cleanup of the TypeScript product workspace by replacing the temporary `typescript-angular-skeleton` positioning with a product-aligned UI directory strategy, and bootstraps the first dedicated TypeScript validation pipeline.

## Changes
- **PLAN.md**:
    - Added milestone `ms-16` for UI workspace rehome and TypeScript delivery pipeline.
    - Added tasks for moving the UI to `apps/magnetar-ui`, bootstrapping TS CI, and validating the test harness itself.
- **ARCHITECTURE.md**:
    - Documented the target repository structure: `apps/magnetar-ui`, future `packages/magnetar-sdk`, Python legacy baseline, and dedicated CI.
- **apps/magnetar-ui/**:
    - Moved the UI workspace from the temporary `typescript-angular-skeleton/` location into `apps/magnetar-ui/`.
    - Renamed the workspace metadata to reflect MagnetarEidolon product identity.
    - Added `Vitest` bootstrap tests and workspace-level typecheck/test scripts.
- **TESTING.md**:
    - Refined the TypeScript testing strategy around `Vitest` and `@faker-js/faker`.
    - Added an explicit CI baseline and a “testing the tests” section.
- **.github/workflows/ci-typescript-ui.yml**:
    - Added a dedicated CI workflow for install, test, and typecheck of the TypeScript UI workspace.
- **STATUS.md** / **README.md** / **BITACORA.md**:
    - Recorded the active transition from a temporary TS skeleton to a product-aligned workspace layout and the first local validation results.
