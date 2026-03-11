# Changes for fix/ci-sdk-subpath-resolution

## Summary
- Resolved SDK subpath imports in UI tests by correctly mapping internal SDK paths in the CI environment.
- Addresses build failures and improves test reliability by ensuring proper module resolution within the CI pipeline.

## Affected Tasks
- `task-ts-qa-107`: Activate CI pipeline for the TypeScript UI (fix identifies build failure and improves reliability).

## State Transitions
- `task-ts-qa-107`: CI reliability fix implemented while in `in_review`.

## Log Entry (BITACORA.md candidate)
- **2026-03-11 11:53**: Resolved SDK subpath imports in UI tests in branch `fix/ci-sdk-subpath-resolution`.
