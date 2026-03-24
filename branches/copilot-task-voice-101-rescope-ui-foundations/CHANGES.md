# Changes for copilot/task-voice-101-rescope-ui-foundations

## Summary
- Defined the TypeScript-first voice UI architecture and planning module in `projects/voice-ui-module/`.
- Synced the branch with `master` so the branch now inherits the current modular UI/backend/runtime structure and the merged observability work.

## Feature Scope
- Added the `projects/voice-ui-module/` planning set for the voice interaction workstream.
- Documented Angular module boundaries, SDK interface contracts, backend boundary ownership, browser/runtime constraints, testing strategy, and voice-specific risks.
- Updated root planning/status/governance docs so `task-voice-101` is `in_review` and `task-voice-102` is prepared for implementation after acceptance.

## Merge from master
- Merged `master` into `copilot/task-voice-101-rescope-ui-foundations` so the branch keeps the current modularized application structure as the baseline.
- Inherited the current `apps/magnetar-ui`, `apps/magnetar-api`, and `packages/magnetar-sdk` structure from `master`.
- Inherited the already-merged observability work from PR `#253` as part of the branch sync.

## Conflict Resolution
- The merge produced conflicts only in `BITACORA.md` and `STATUS.md`.
- Resolved the conflicts by keeping both the newer `master` canon updates and the voice-branch status/log entries.
- No code-level conflicts were required in the Angular UI, Nest backend, or SDK files during the merge.

## Related Issues
- The observability follow-up issues `#281` through `#286` remain open as documented non-blocking follow-up work already merged into `master`.
- Those issues do not block syncing `master` into this voice-planning branch because this branch does not depend on their closure to preserve correctness.

## Validation
- Root documentation conflicts were resolved without dropping the voice module updates.
- Post-merge validation should run through the repository standard path before merge to `master`.

## BITACORA archive migration
- Verified that root `BITACORA.md` entries older than the newest 20 were preserved in GitHub Discussion `#288` before deleting them from the root logbook.
- Trimmed the root `BITACORA.md` to its newest 20 entries and added a direct pointer to the archive discussion so older history remains discoverable.

## PR review follow-up
- Tightened the voice-planning docs to make backend-transcription failure feedback explicit in requirements, testing, and architecture guidance.
- Clarified that unsupported audio-format handling should map to deterministic user-visible adapter errors.
- Simplified the highest-probability voice risk wording and clarified the voice-path dependency restriction in the root `PLAN.md`.
- Normalized the root `STATUS.md` Voice UI note into clearer sentence-style wording.
- Aligned `task-voice-102` notes across the root plan, voice module plan, and project YAML so the task is consistently treated as planned but blocked until `task-voice-101` is accepted and moved to `done`.
- Declared `projects/voice-ui-module/STATUS.md` as the canonical source for voice-risk wording and reduced the root/project-yaml copies to summarized references.
- Added explicit notes in the voice architecture and requirements docs that the named components, services, and SDK interfaces are planned implementation artifacts rather than symbols that already exist in code today.

## BITACORA.md candidate
- **2026-03-24 12:35 UTC**: Merged `master` into `copilot/task-voice-101-rescope-ui-foundations`, keeping the current modularized application structure and inherited observability work from `master` while preserving the voice re-scope planning updates. Resolved the sync through root documentation conflict reconciliation in `BITACORA.md` and `STATUS.md`.
