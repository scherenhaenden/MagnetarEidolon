# Branch Changes — feature/provider-config-json-inspector

## 2026-03-16
- Started the next Providers UX slice from `feature/provider-config-instance-management`.
- Scoped the goal to configured providers only: each existing provider configuration should expose its final resolved JSON payload from the editor so users can inspect the exact stored shape.
- Kept the quick-add preset catalog out of the delete path; this slice is only about inspection of configured instances, not catalog mutation.
- Added a provider-service serialization path for configured instances so the editor can render the resolved stored JSON shape directly from the live provider state.
- Added a `Raw Config` block to the existing-provider editor, with a contextual toggle that is hidden during new-provider creation flows.
- Extended provider-config tests to cover JSON serialization for existing instances and missing-provider handling.
- Revalidated the Angular workspace with `npm --prefix apps/magnetar-ui run typecheck`.
