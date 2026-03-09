# Changes for feature/extract-magnetar-sdk-package

## Summary
Starts the extraction of the shared TypeScript runtime into `packages/magnetar-sdk` so the product UI and the reusable SDK/runtime contract stop living in the same workspace.

## Changes
- **PLAN.md / STATUS.md / README.md / BITACORA.md**:
    - Moved the SDK split from future intent to active work.
- **ARCHITECTURE.md**:
    - Marked the runtime extraction as an active architectural transition.
- **TESTING.md**:
    - Updated the coverage/testing target to follow the shared runtime package path.
- **packages/magnetar-sdk/**:
    - Created a dedicated SDK package for shared TypeScript runtime code.
    - Moved shared agent/runtime files and tool adapters out of the UI workspace.
    - Added package metadata and standalone TypeScript validation config.
- **apps/magnetar-ui/**:
    - Kept only product UI concerns plus local tests.
    - Updated the UI workspace to consume the extracted SDK paths during validation.
- **.github/workflows/ci-typescript-ui.yml**:
    - Extended validation to include SDK typecheck alongside UI tests/typecheck.
- **docs/UI_RUNTIME_BOOTSTRAP_PLAN.md / README.md / CONTRIBUTING.md / PLAN.md / STATUS.md / BITACORA.md**:
    - Added a detailed runtime bootstrap plan for making the TypeScript workspace actually runnable via web and CLI entrypoints.
    - Recorded the canonical GitHub issue tracker and project board locations.
    - Tracked the work in GitHub issue `#129`.
