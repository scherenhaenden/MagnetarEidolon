# Testing Strategy for MagnetarEidolon

## Introduction
This document describes the testing strategy for the MagnetarEidolon project, focused on the TypeScript SDK/application code and the governance model. This ensures that the `MagnetarModel` and `Agent Core` logic operate reliably and that the project adheres to its documentation and process standards.

## Governance and Documentation Testing

### Testing Objectives
Ensure governance artifacts are complete, consistent, and operationally enforceable for this repository.

### Types of Tests
- **Documentation integrity tests:** verify required files exist and contain expected section headers.
- **Schema validation tests:** validate project YAML structure and required keys.
- **Workflow consistency tests:** verify task states in `PLAN.md` and YAML conform to `RULES.md`.
- **Process tests (manual/audit):** verify `BITACORA.md` chronology and blocker lifecycle compliance.

### Code Coverage Targets
- **Automated checks coverage target:** 90% of governance rules represented by machine-checkable assertions.
- **Minimum accepted threshold:** 80% before release tagging.

## TypeScript SDK Testing Strategy (New)

### High-Quality Standards
The TypeScript implementation of the Magnetar SDK must adhere to the highest quality standards to ensure cross-platform reliability between CLI and Web environments.

### Testing Pyramid

1.  **Modular Unit Tests (100% Coverage Target)**
    - **Focus**: Pure functions, state models, and individual agent logic steps.
    - **Tooling**: `Vitest`.
    - **Data Strategy**: Use `@faker-js/faker` to generate realistic, diverse, and unexpected data payloads. Mocking must be granular and modular.
    - **Requirement**: No code in `packages/magnetar-sdk/src/` may be merged without complete coverage for the affected module. While shared code still lives temporarily inside the UI workspace, the same standard applies there.

2.  **Integration Tests**
    - **Focus**: Interaction between `MagnetarAgent`, `Tool` adapters, and `MemoryStore`.
    - **Scenario**: Verify that a tool execution correctly updates the `MagnetarEidolon` state and is persisted in memory.

3.  **E2E Acceptance Tests**
    - **Focus**: End-to-end workflows from the User's goal to a final completion message.
    - **Verification**: Ensure identical behavior across the Node.js CLI and the Angular Web UI.

### Acceptance Criteria for Merging
- [ ] 100% Unit Test coverage for the affected core module.
- [ ] All integration scenarios passing in both Node and Browser environments (where applicable).
- [ ] No regressions in E2E acceptance flows.
- [ ] `@faker-js/faker` data generation used to verify edge cases in state transitions.

### TypeScript CI Pipeline Baseline
- A dedicated GitHub Actions workflow must validate the TypeScript UI workspace independently of the Python legacy pipeline.
- Minimum baseline stages (Node.js 22):
  - install Node dependencies in `apps/magnetar-ui`
  - build the real web UI entrypoint
  - build the CLI artifact path
  - run at least one CLI smoke invocation from built output
  - run unit tests in CI mode
  - run TypeScript typecheck/build validation
  - upload test/coverage artifacts on failure

### Next Interactive Validation Target
- The next provider-facing validation surface should be an in-app chat flow, not only CLI smoke commands.
- LM Studio is the first planned concrete provider target for this path.
- Chat-driven validation should cover:
  - chat tab shell renders and remains navigable
  - provider reachable and healthy
  - provider unreachable
  - invalid model/config selection
  - successful generation from the embedded UI
  - structured blocks such as code and quotes render predictably
  - copy actions return exact source content for code and prompt snippets
  - streaming preserves scroll stability during incremental rendering
- Provider-configuration validation should also cover:
  - one primary provider exists
  - backups remain ordered for failover
  - disabling the primary promotes the next eligible backup

### Testing the Tests
- The TypeScript test system itself must be validated, not only the application code.
- Minimum meta-validation plan:
  - maintain at least one deterministic smoke suite that must always pass on CI
  - ensure documented startup commands (`npm run start`, `npm run build:web`, `npm run cli:dev`, `npm run cli`) stay aligned with actual workspace scripts
  - verify failure reporting through artifacts/logs when a test job fails
  - add negative-path cases for filesystem/tool safety rules so the suite proves it catches regressions, not only happy paths
  - periodically validate coverage thresholds and test command wiring after workspace moves or package-script changes

## Bug Reporting Process
1.  **Identify & Document**: Identify the issue. Create a bug entry with ID, summary, reproduction steps, severity, and owner.
2.  **Link & Log**: Link affected task(s) in `PLAN.md`. Log discovery and follow-up in `BITACORA.md`.
3.  **Prioritize**: Assign a priority level (Critical, High, Medium, Low).
4.  **Track**: Monitor progress in `STATUS.md` and `BITACORA.md`.
5.  **Validate & Close**: Validate the fix via relevant tests/checks and record closure evidence.
