# Branch Changes — fix/schema-validation-pipeline

## 2026-03-20
- Rewrote GitHub blocker `#79` into a concrete, declarative description with explicit scope, impact, and closure criteria.
- Added a repository-level project YAML schema validator for `projects/*.project.yml`.
- Added validator tests so the schema rules themselves have a small automated regression net.
- Wired project schema validation into root npm scripts and the TypeScript CI workflow.
- Scoped the implementation to the blocker itself: enforce project YAML shape automatically and fail CI on invalid machine-state files.
