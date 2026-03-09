# Testing Strategy for MagnetarEidolon

## Introduction
This document describes the testing strategy for the MagnetarEidolon project, encompassing both the application code (Python and TypeScript) and the governance model. This ensures that the `MagnetarModel` and `Agent Core` logic operate reliably and that the project adheres to the canonical standards for documentation and process.

## Governance and Documentation Testing

### Testing Objectives
Ensure governance artifacts are complete, consistent, and operationally enforceable for canonical Magnetar projects.

### Types of Tests
- **Documentation integrity tests:** verify required files exist and contain expected section headers.
- **Schema validation tests:** validate project YAML structure and required keys.
- **Workflow consistency tests:** verify task states in `PLAN.md` and YAML conform to `RULES.md`.
- **Process tests (manual/audit):** verify `BITACORA.md` chronology and blocker lifecycle compliance.

### Code Coverage Targets
- **Automated checks coverage target:** 90% of canonical governance rules represented by machine-checkable assertions.
- **Minimum accepted threshold:** 80% before release tagging.

## TypeScript SDK Testing Strategy (New)

### High-Quality Standards
The TypeScript implementation of the Magnetar SDK must adhere to the highest quality standards to ensure cross-platform reliability between CLI and Web environments.

### Testing Pyramid

1.  **Modular Unit Tests (100% Coverage Target)**
    - **Focus**: Pure functions, state models, and individual agent logic steps.
    - **Tooling**: `Vitest`.
    - **Data Strategy**: Use `@faker-js/faker` to generate realistic, diverse, and unexpected data payloads. Mocking must be granular and modular.
    - **Requirement**: Ningun codigo en `packages/magnetar-sdk/src/` puede mergearse sin cobertura completa del modulo afectado; mientras exista codigo compartido aun dentro de la UI, aplica la misma exigencia a ese path temporal.

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

### Testing the Tests
- The TypeScript test system itself must be validated, not only the application code.
- Minimum meta-validation plan:
  - maintain at least one deterministic smoke suite that must always pass on CI
  - ensure documented startup commands (`npm run start`, `npm run build:web`, `npm run cli:dev`, `npm run cli`) stay aligned with actual workspace scripts
  - verify failure reporting through artifacts/logs when a test job fails
  - add negative-path cases for filesystem/tool safety rules so the suite proves it catches regressions, not only happy paths
  - periodically validate coverage thresholds and test command wiring after workspace moves or package-script changes

## Application Code Testing (Python Legacy)

### Types of Tests

#### 1. Unit Tests
- **Focus**: Verify the correctness of individual functions and methods within `MagnetarModel` and `Agent Core`.
- **Framework**: `pytest`.

#### 2. Integration Tests
- **Focus**: Verify interactions between components, such as the `Agent Core` calling the `Tool System` or updating the `Memory System`.

#### 3. End-to-End (E2E) Tests
- **Focus**: Verify complete user workflows from initiating a task via CLI to completion.

### Code Coverage
- **Target**: Ensure >80% code coverage for core logic.

## Bug Reporting Process
1.  **Identify & Document**: Identify the issue. Create a bug entry with ID, summary, reproduction steps, severity, and owner.
2.  **Link & Log**: Link affected task(s) in `PLAN.md`. Log discovery and follow-up in `BITACORA.md`.
3.  **Prioritize**: Assign a priority level (Critical, High, Medium, Low).
4.  **Track**: Monitor progress in `STATUS.md` and `BITACORA.md`.
5.  **Validate & Close**: Validate the fix via relevant tests/checks and record closure evidence.
