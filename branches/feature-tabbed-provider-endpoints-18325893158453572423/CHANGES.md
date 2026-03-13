# Branch Changes — feature/tabbed-provider-endpoints-18325893158453572423

## 2026-03-13
- Reworked the provider API surface editor from a long stacked endpoint list into a tabbed endpoint view so large providers such as LM Studio are easier to inspect without excessive scrolling.
- Preserved single-panel rendering for endpoint details:
  - endpoint tab buttons remain visible in the tab bar
  - only the active endpoint detail panel is rendered in the editor body
- Added endpoint-selection state reset when:
  - switching providers
  - entering a new-provider configuration flow
  - leaving configuration mode back to the configured-provider browser
- Review cleanup:
  - removed an accidentally committed local runtime artifact (`server_output.log`)
  - verified the tabbed endpoint view still typechecks cleanly
