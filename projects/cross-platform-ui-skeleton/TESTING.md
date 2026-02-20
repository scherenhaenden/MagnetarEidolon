# Testing Strategy for Cross-Platform UI Skeleton

## Types of Tests
- Unit tests for platform detection and adapter resolution.
- Unit tests for navigation/state container transitions.
- Shell-level smoke tests validating startup payload and route changes.

## Current Automated Baseline
- `tests/test_cross_platform_ui.py` validates:
  - platform normalization (`Linux`, `Darwin`, `Windows`, unknown)
  - adapter selection and capability surface
  - shell startup output contract
  - navigation forward/back transitions
  - UI state toggle behavior

## Code Coverage
Target at least **80%** automated coverage for module logic and critical contracts.

## Bug Reporting Process
1. Create a bug entry with reproduction steps and expected/actual results.
2. Link affected task IDs and milestone.
3. Track remediation progress in `PLAN.md` and `BITACORA.md`.
4. Close only after tests validate the fix.
