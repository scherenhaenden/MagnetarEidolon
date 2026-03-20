# PR Review Issues

## Scope
This branch captures the actionable review feedback collected from PRs `#233`, `#235`, and `#236` after the provider-configuration stack was opened.

## PR #233
- `provider-config.service.ts` - High
  Reset fallback currently preserves `apiKey` when preset metadata is unavailable. That breaks the expected reset semantics and can leave stale credentials in place.

## PR #234
- No review comments or actionable findings were present on this PR.

## PR #235
- `provider-registry.service.spec.ts` - High
  Backend fixture loading uses a developer-specific absolute path. That makes the suite non-portable across machines and CI agents.
- `chat.gateway.service.spec.ts` - High
  The fixture registry override uses the same hardcoded absolute path and carries the same portability risk.

## PR #236
- `provider-config.service.ts` - High
  The raw JSON inspector serializes `apiKey` values in plaintext. Sensitive fields should be masked before they are shown in the UI.

## Project Rule Reinforced
- The repository must not depend on machine-specific absolute filesystem paths in source code, tests, scripts, or documentation examples.
- Fixtures and support files must be resolved relative to the repository or module under test.
