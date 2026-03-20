# PR Issue Linkage

## Purpose
This note records which existing issues can be linked to the open provider PR stack and which newly created follow-up issues came directly from review comments.

## Review-Follow-Up Issues Created
- `#237` `[task-test-105] Remove machine-specific fixture paths from provider backend tests`
  Origin: PR `#235` review comments about hardcoded absolute fixture paths in backend tests.
- `#238` `[task-provider-115] Mask provider API keys in the raw JSON inspector`
  Origin: PR `#236` review comments about exposing plaintext `apiKey` values in the Providers raw JSON inspector.
- `#239` `[task-provider-114] Clear provider API keys during reset fallback`
  Origin: PR `#233` review comments about reset fallback preserving `apiKey` when preset metadata is unavailable.

## Existing Issue Linkage Candidates

### PR #233 `feat(providers): add configured provider instance management`
- Candidate issue to close: `#191` `[task-provider-110] Add CRUD and preset onboarding to the Providers UI`
  Evidence:
  - PR `#233` summary explicitly covers configured provider instance management, stable opaque instance ids, quick-add preset behavior, and reset/delete flows.
  - `PLAN.md` describes `task-provider-110` as the active slice for opaque instance ids plus reset/delete semantics that preserve the quick-add preset catalog.
  Assessment:
  - Strong closure candidate once the PR merges.

### PR #236 `feat(providers): inspect resolved configured provider JSON`
- No clear pre-existing issue found that is specific enough to close from this PR alone.
  Evidence:
  - PR `#236` adds a read-only raw JSON inspector for existing configured providers.
  - The inspected backlog titles do not show a dedicated issue for JSON inspection or raw config viewing.
  Assessment:
  - Keep linked in documentation/PR notes, but do not force-close an unrelated issue.

### PR #235 `feat(provider): add JSON-backed runtime provider resolution`
- Candidate issue to close: `#186` `[task-provider-105] Add a backend-owned provider registry for config-driven execution`
  Evidence:
  - PR `#235` summary explicitly says backend provider execution metadata moved into committed JSON catalog files with local override support.
  - That is a direct match for a backend-owned provider registry foundation.
  Assessment:
  - Strong closure candidate once the PR merges.

- Candidate issue to close: `#188` `[task-provider-106] Integrate OpenRouter through the config-driven backend provider path`
  Evidence:
  - PR `#235` summary explicitly calls out LM Studio and OpenRouter runtime handoff through the JSON-backed backend path.
  - The backend registry and chat gateway changes cover runtime resolution for OpenRouter on that path.
  Assessment:
  - Strong closure candidate once the PR merges.

- Link only, do not close yet: `#187` `[task-provider-107] Move provider secrets and runtime overrides to backend-owned configuration`
  Evidence:
  - PR `#235` adds local override support and configured-instance resolution, which advances backend-owned runtime configuration.
  - The same PR notes that configured-instance resolution is only the start of future custom-provider execution, so the full backend-owned configuration story is not complete yet.
  Assessment:
  - Partial progress only. Link from the PR, but do not close.

- Do not link as closed: `#189` `[task-provider-108] Add provider configuration UI for backend-owned OpenRouter settings`
  Evidence:
  - PR `#235` changes backend execution and UI runtime handoff, but it does not introduce a dedicated backend-owned OpenRouter settings UX.
  Assessment:
  - Out of scope for closure.

## PR #234 Status
- PR `#234` has no review comments and no comment-driven follow-up issue was required.

## Closing Guidance
- Close only issues with direct scope parity after the PR is merged:
  - `#191` from PR `#233`
  - `#186` from PR `#235`
  - `#188` from PR `#235`
- Keep linked but open:
  - `#187`
  - `#189`
- Keep review-follow-up issues open until their fixes land:
  - `#237`
  - `#238`
  - `#239`
