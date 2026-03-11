# Changes for fix/provider-config-ui-persistence-and-memory

## Summary
- Kept provider configuration state alive across tab switches by moving the service instance to the app shell.
- Restored the Memory tab and added a concrete Memory Inspector screen instead of replacing required navigation with Providers.
- Preserved the Providers screen as an additional product surface rather than a replacement.

## Affected Tasks
- `task-provider-102`: Implement Angular provider configuration screen.
- `task-provider-103`: Add ordering and failover state tests.
- `task-ui-104`: Implement Memory Screen or remove tab.

## State Transitions
- `task-provider-102`: UI regression fix implemented while in `in_review`.
- `task-ui-104`: Memory navigation gap closed in the shell.

## Log Entry (BITACORA.md candidate)
- **2026-03-11 12:26**: Fixed provider configuration state persistence and restored the Memory surface in branch `fix/provider-config-ui-persistence-and-memory`.
