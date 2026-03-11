# Changes for fix/ensure-primary-provider

## Summary
- Resolved a bug risk in `ProviderConfigService.ensurePrimaryExists()` where demoting the only primary provider would leave the system without a primary.
- Removed the `excludedProviderId` logic, ensuring that the system always re-promotes a backup if no primary is present, even in single-provider scenarios.

## Affected Tasks
- `task-provider-103`: Add state tests for provider ordering and failover eligibility (bug identified during testing/review).

## State Transitions
- `task-provider-103`: Bug fix implemented while in `in_review`.

## Log Entry (BITACORA.md candidate)
- **2026-03-11 12:02**: Fixed bug in `ProviderConfigService` to ensure a primary provider always exists when possible in branch `fix/ensure-primary-provider`.
