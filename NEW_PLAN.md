# NEW PLAN — MagnetarEidolon

## 1) Product Purpose
Create an agent platform that is **easy to use, trustworthy, and visually clear**, focused on helping anyone automate complex tasks without becoming an expert in security or infrastructure.

Core promise:

> **"Build, run, observe, and trust AI agents without technical chaos."**

---

## 2) Guiding Principles (Non-Negotiable)

1. **Radical simplicity**
   Users should be able to start in minutes.
2. **Trust by design**
   Risky actions must always be visible and approvable.
3. **Full observability**
   Everything an agent does must be understandable and reviewable.
4. **Human control always available**
   Users can approve, deny, or pause critical decisions.
5. **Explicit, manageable memory**
   Users can view, edit, and delete what the agent "remembers."
6. **Premium experience**
   An elegant command-center interface, not a generic chat UI.

---

## 3) What We Want to Preserve and What to Avoid

### Preserve
- Flexibility to work with different models.
- Use of tools connected to real-world systems.
- Reusable flows (recipes/skills).
- History and traces for debugging.
- Human approval for sensitive actions.
- A backend-controlled boundary for provider and integration traffic so the browser UI does not own local-provider transport details.

### Avoid
- Unnecessary initial complexity.
- Integrations that hide risk.
- "Magic" automations that are hard to audit.
- Importing external recipes without validation and transparency.
- Experiences where users do not understand what just happened.

---

## 4) Desired User Experience

### Ideal Onboarding
1. Open the app.
2. Choose trust mode.
3. Enable tools from a visual catalog.
4. Load context (documents/project).
5. Enter an objective.
6. Review the plan and approve risky actions.
7. Receive the result with a clear summary of what happened.

### Product Feeling
- "I have power, but also control."
- "I know what the agent is doing at all times."
- "I do not have to guess risks."
- "I can reuse what works."

---

## 5) Product Usage Modes

1. **Execution Mode**
   Run objectives quickly with minimal friction.
2. **Build Mode**
   Design reusable flows and recipes.
3. **Debug Mode**
   Inspect decisions, errors, costs, and performance.

These modes should coexist without being merged into one confusing experience.

---

## 6) Trust and Security Model (Product)

- Every impactful action is classified by risk level.
- Read-only operations can run with less friction.
- Write/modify operations require approval by default.
- Destructive actions require double confirmation or a simulation first.
- Every sensitive action leaves an auditable record.
- Every imported flow starts disabled and undergoes permission review.
- Permissions must be explained in human language, not technical jargon.

---

## 7) Key Screens for the Product MVP

1. **Main Dashboard**
   Agent status, recent runs, pending approvals.
2. **Live Execution View**
   Plan, progress, intermediate results, critical decisions.
3. **Recipe Builder**
   Create reusable automations visually.
4. **Tool Catalog**
   Enable capabilities with clear risk and scope definitions.
5. **Memory Inspector**
   View, pin, delete, and understand agent knowledge.
6. **Trace/Replay**
   Review step-by-step what happened during execution.
7. **Policy Center**
   Define approval and security rules in clear language.

---

## 8) Product Roadmap (By Phase)

### Phase 1 — Immediate Individual Value
- Simple local experience.
- One main assistant.
- Visible runs with approvals.
- Basic reusable recipes.

### Phase 2 — Power for Advanced Users
- Multiple specialists per task.
- Manageable long-term memory.
- Finer-grained policies.
- Replays and run comparisons.

### Phase 3 — Team Collaboration
- Shared workspaces.
- Roles and permissions.
- Approval queues.
- Stronger governance and traceability.

### Phase 4 — Ecosystem and Expansion
- Safe recipe exchange.
- Third-party integrations with strict controls.
- Optional scaling without losing the "control first" philosophy.

---

## 9) Strategic Differentiators

1. **Operational clarity**: users always understand the "what" and the "why."
2. **Default trust**: security is integrated, not optional.
3. **Beautiful observability**: debugging becomes a competitive advantage.
4. **Visual + editable hybrid**: accessible for everyone, powerful for experts.
5. **Recipe portability**: reusable, shareable automations.

---

## 10) Success Criteria

- Users create their first useful automation in under 15 minutes.
- Users understand risks before approving sensitive actions.
- Users can explain what the agent did after each run.
- Users reuse recipes in future tasks with minimal adaptation.
- Teams perceive the platform as "powerful but safe."

---

## 11) Executive Summary

**MagnetarEidolon should be an agent system centered on simplicity, trust, and full visibility.**

The goal is not to add technical complexity, but to deliver an experience where automation is fast, governable, and understandable from first use.
