# Testing Strategy for MagnetarEidolon

## Introduction
This document describes the testing strategy for the MagnetarEidolon project, encompassing both the application code and the governance model. This ensures that the `MagnetarModel` and `Agent Core` logic operate reliably and that the project adheres to the canonical standards for documentation and process.

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

### Acceptance Criteria
- Required canonical files exist and are non-empty.
- Task states use only allowed canonical values.
- Blockers include ID, owner, status, and timestamps.
- `STATUS.md` and `BITACORA.md` are updated according to cadence rules.


## Application Code Testing

### Types of Tests

#### 1. Unit Tests
- **Focus**: Verify the correctness of individual functions and methods within `MagnetarModel` and `Agent Core`.
- **Framework**: `pytest`.
- **Examples**:
    - Validate Pydantic schema constraints.
    - Test serialization/deserialization logic.
    - Mock external dependencies (e.g., file system, network) to isolate unit behavior.

#### 2. Integration Tests
- **Focus**: Verify interactions between components, such as the `Agent Core` calling the `Tool System` or updating the `Memory System`.
- **Framework**: `pytest` with more comprehensive mocks or containerized dependencies (e.g., ChromaDB).
- **Examples**:
    - Ensure the agent correctly selects and executes a sequence of tools.
    - Verify that memory updates persist in ChromaDB.

#### 3. End-to-End (E2E) Tests
- **Focus**: Verify complete user workflows from initiating a task via CLI to completion.
- **Framework**: `pytest` or custom scripts invoking the CLI.
- **Examples**:
    - Run a full agent loop to accomplish a simple task (e.g., "list files in current directory").
    - Validate that the output matches expectations.

### Code Coverage
- **Target**: Ensure >80% code coverage for core logic (`MagnetarModel`, `Agent Core`, `Tool System`).
- **Tools**: `pytest-cov` or `coverage.py`.

### Acceptance Criteria
- All unit and integration tests must pass before merging to `master` or `develop`.
- Code coverage must meet the target threshold.
- No critical bugs (P0) allowed in release candidates.

## Bug Reporting Process
1.  **Identify & Document**: Identify the issue. Create a bug entry with ID, summary, reproduction steps, severity, and owner. For critical bugs, create a GitHub Issue or add an entry to `BLOCKERS.md`.
2.  **Link & Log**: Link affected task(s) in `PLAN.md`. Log discovery and follow-up in `BITACORA.md`.
3.  **Prioritize**: Assign a priority level (Critical, High, Medium, Low).
4.  **Track**: Monitor progress in `STATUS.md` and `BITACORA.md`.
5.  **Validate & Close**: Validate the fix via relevant tests/checks and record closure evidence.
