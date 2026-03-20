# Branch Changes — fix/provider-config-post-pr-test-fixes

## 2026-03-20
- Collected the actionable review findings from PRs `#233`, `#235`, and `#236`.
- Documented three concrete follow-up fixes:
  - remove hardcoded absolute fixture paths from backend tests
  - mask `apiKey` values in the Providers raw JSON inspector output
  - clear `apiKey` in the reset fallback path even when preset metadata is unavailable
- Scoped this branch only to review-driven correctness and portability fixes.
- Confirmed that PR `#234` has no review comments to convert into follow-up work.
- Added an explicit project rule and testing rule that prohibit machine-specific absolute filesystem paths and require repo-relative fixture resolution.
- Added branch-local issue linkage notes for PRs `#233`, `#235`, and `#236`, including closure candidates for `#191`, `#186`, and `#188`, plus the new follow-up issues `#237`, `#238`, and `#239`.
