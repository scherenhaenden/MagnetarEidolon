# Testing Strategy for MagnetarEidolon

## Introduction
This document describes the testing strategy, types of tests, and acceptance criteria for the MagnetarEidolon project, ensuring that the `MagnetarModel` and `Agent Core` logic operate reliably across supported operating systems.

## Types of Tests

### 1. Unit Tests
- **Focus**: Verify the correctness of individual functions and methods within `MagnetarModel` and `Agent Core`.
- **Framework**: `pytest`.
- **Examples**:
    - Validate Pydantic schema constraints.
    - Test serialization/deserialization logic.
    - Mock external dependencies (e.g., file system, network) to isolate unit behavior.

### 2. Integration Tests
- **Focus**: Verify interactions between components, such as the `Agent Core` calling the `Tool System` or updating the `Memory System`.
- **Framework**: `pytest` with more comprehensive mocks or containerized dependencies (e.g., ChromaDB).
- **Examples**:
    - Ensure the agent correctly selects and executes a sequence of tools.
    - Verify that memory updates persist in ChromaDB.

### 3. End-to-End (E2E) Tests
- **Focus**: Verify complete user workflows from initiating a task via CLI to completion.
- **Framework**: `pytest` or custom scripts invoking the CLI.
- **Examples**:
    - Run a full agent loop to accomplish a simple task (e.g., "list files in current directory").
    - Validate that the output matches expectations.

## Code Coverage
- **Target**: Ensure >80% code coverage for core logic (`MagnetarModel`, `Agent Core`, `Tool System`).
- **Tools**: `pytest-cov` or `coverage.py`.

## Bug Reporting Process
1.  **Identify**: Reproduce the issue and confirm it is a bug, not a feature.
2.  **Document**: Create a GitHub Issue or add an entry to `BLOCKERS.md` if critical.
3.  **Reproduce**: Provide clear steps to reproduce the issue, including environment details (OS, Python version).
4.  **Prioritize**: Assign a priority level (Critical, High, Medium, Low).
5.  **Track**: Monitor progress in `STATUS.md` and `BITACORA.md`.

## Acceptance Criteria
- All unit and integration tests must pass before merging to `master` or `develop`.
- Code coverage must meet the target threshold.
- No critical bugs (P0) allowed in release candidates.
