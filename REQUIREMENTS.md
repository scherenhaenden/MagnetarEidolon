# Requirements for MagnetarEidolon

## Functional Requirements

### Must-Have
- Define a canonical project governance and execution documentation set.
- Provide explicit milestone/task planning with allowed lifecycle states.
- Provide immutable operational logbook semantics via `BITACORA.md`.
- Provide blocker tracking and escalation workflow.
- Provide machine-readable project schema template under `projects/`.

### Should-Have
- Include architecture guidance tied to Magnetar cognition/runtime separation.
- Include AI collaborator workflow guidance and compliance checks.
- Include test strategy with acceptance criteria and reporting cadence.

### Could-Have
- Add CI validation for required file presence and YAML schema checks.
- Add optional dashboards to visualize status and blocker trends.

### Won't-Have (for initial baseline)
- Full runtime implementation of Magnetar agent core in this phase.
- Provider-specific production deployment automation.

## Non-Functional Requirements

### Must-Have
- Documentation must be version-controlled and human-readable.
- Task states and governance semantics must be deterministic and consistent.
- All required canonical files must exist at repository root (plus `projects/`).

### Should-Have
- Content should be parseable by AI tools and automation scripts.
- Governance rules should be auditable through chronological logs.

### Could-Have
- Add linting rules for Markdown table consistency.
- Add machine validation for task state transitions.

### Won't-Have (for initial baseline)
- Complex enterprise workflow engines or external PM integrations.
