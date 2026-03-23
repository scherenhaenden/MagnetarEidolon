# Changes for work

- Initialized canonical subproject scaffolds for API Connectors, Cross-Platform UI, and System Interaction modules under `projects/` with full documentation sets and module-local YAML definitions.
- Implemented `src/magnetar/ui` cross-platform skeleton module (platform adapters, shell orchestration, navigation/state container) and added `tests/test_cross_platform_ui.py`.
- Updated `projects/cross-platform-ui-skeleton/*` docs and `projects/cross-platform-ui-skeleton.project.yml` to reflect current implementation and move `task-ui-101..104` to `in_review`.
- Reviewed UI review suggestions and applied TypeScript UI refinements: added explicit interfaces (`Agent`, `Run`, `Tool`) to `src/app/ui/mock-data.ts`, aligned run agent naming with `MOCK_AGENTS`, and simplified `UiBadgeComponent` template by moving static classes to markup with `NgClass` for dynamic status styling.
- Added independent release pipelines for npm global publishing, DEB packaging, Windows EXE packaging, and AppImage packaging, each with build + smoke-test steps before artifact upload.
- Bumped `apps/magnetar-ui` package version to `0.2.0`, made package publishable (`private: false`), and added `publishConfig.access=public` to support npm global distribution.
- Updated `RELEASING.md` to document the new packaging workflows and recommended npm-first release path.
- Chose a heartbeat-first diagnostics approach for chat stabilization: a lightweight backend liveness probe now ships as a PoC at `/api/heartbeat`, with project-module docs updated to recommend separating cheap heartbeat checks from deeper provider diagnostics.

## Summary
- Reworked the Memory Inspector from a static placeholder into a service-backed interactive screen.
- Added explicit memory records, filters, selection state, pin/unpin actions, delete support, and restore-default behavior.
- Added targeted Memory Inspector tests and validated the Angular build/typecheck path.

## Affected Tasks
- `task-ui-104`: Implement Memory Screen or remove tab.

## State Transitions
- `task-ui-104`: Memory screen advanced from placeholder content toward an inspectable/governable product surface.

## Log Entry (BITACORA.md candidate)
- **2026-03-23 07:07 UTC**: Began the first service-backed Memory Inspector slice on branch `work`, replacing static placeholder content with filterable/selectable memory records plus pin/delete interactions and dedicated tests.
