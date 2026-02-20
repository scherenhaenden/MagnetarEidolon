# Testing Strategy for MagnetarEidolon

## Testing Objectives
Ensure governance artifacts are complete, consistent, and operationally enforceable for canonical Magnetar projects.

## Types of Tests
- **Documentation integrity tests:** verify required files exist and contain expected section headers.
- **Schema validation tests:** validate project YAML structure and required keys.
- **Workflow consistency tests:** verify task states in `PLAN.md` and YAML conform to `RULES.md`.
- **Process tests (manual/audit):** verify `BITACORA.md` chronology and blocker lifecycle compliance.

## Code Coverage Targets
- **Automated checks coverage target:** 90% of canonical governance rules represented by machine-checkable assertions.
- **Minimum accepted threshold:** 80% before release tagging.

## Acceptance Criteria
- Required canonical files exist and are non-empty.
- Task states use only allowed canonical values.
- Blockers include ID, owner, status, and timestamps.
- `STATUS.md` and `BITACORA.md` are updated according to cadence rules.

## Bug Reporting Process
1. Create a bug entry with ID, summary, reproduction steps, severity, and owner.
2. Link affected task(s) in `PLAN.md` and optionally create/update blocker in `BLOCKERS.md`.
3. Log discovery and follow-up in `BITACORA.md`.
4. Validate fix via relevant tests/checks and record closure evidence.
