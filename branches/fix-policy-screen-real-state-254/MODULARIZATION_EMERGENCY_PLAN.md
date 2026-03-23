# Emergency Side Plan: UI Modularization Stabilization

## Purpose
This plan captures an urgent architectural cleanup direction for the MagnetarEidolon UI without interrupting the current issue-driven delivery flow.

It is intentionally **not** a replacement for the current branch scope. It exists so the modularization work can be executed deliberately once the current fixes are complete.

## Why This Is Urgent
The current Angular UI has accumulated too much surface area inside `app.component.ts`.

This creates several problems:
- HTML templates are embedded directly inside large TypeScript component files.
- Multiple screens live in the same file instead of being separated into focused view components.
- UI behavior, layout, and state boundaries are harder to test and reason about.
- Small changes increase merge-conflict risk because unrelated screens share the same file.
- The current structure works for rapid PoC delivery, but it is now a scaling liability.

## Non-Negotiable Direction
1. **HTML should not remain inline inside large component classes.**
2. **Different views must become different components/files.**
3. **State and view concerns should be separated more aggressively.**
4. **This refactor should begin only after the current targeted fixes are safely landed.**

## Immediate Refactor Goals

### Goal 1: Remove large inline templates
Move inline Angular templates out of oversized component files and into dedicated HTML files.

Target outcome:
- each screen gets its own `.component.html`
- styles move into dedicated `.css` or `.scss` files where appropriate
- TypeScript files focus on state, event handling, and integration logic

### Goal 2: One screen, one component boundary
Each major route/screen should become its own component directory or file set.

Minimum screen split target:
- Dashboard
- Live Run
- Chat
- Builder
- Tool Catalog
- Memory
- Providers
- Policy Center

### Goal 3: Separate screen orchestration from reusable UI parts
Large route components should not keep absorbing all sub-layout markup.

Target split:
- route/screen components own composition
- reusable cards, panels, rails, forms, and inspectors become focused UI components
- state-heavy logic moves to model/service/state classes when possible

### Goal 4: Make the UI testable by structure
The component layout should support test isolation naturally.

Target outcome:
- screen state becomes independently testable
- presentational components can be tested with small fixture inputs
- route-level tests focus on composition and interaction, not monolith rendering

## Proposed Refactor Phases

### Phase A: Structural decomposition
- Extract each route-level screen from `app.component.ts`
- Keep behavior unchanged during extraction
- Introduce dedicated files for TS/HTML/styles
- Confirm routes continue to point to the new screen components

### Phase B: Shared UI decomposition
- Identify repeated layout patterns and reusable shells
- Extract stable subcomponents such as:
  - section headers
  - detail panels
  - cards
  - lists
  - empty states
  - action bars
  - status summaries

### Phase C: State extraction
- Move non-trivial UI state into focused state/model classes where beneficial
- Keep components thinner
- Avoid pushing business/state logic back into templates

### Phase D: Test realignment
- Add or update tests so the new component structure is protected
- Ensure refactor improves test clarity instead of only moving files around

## Recommended Execution Order
1. Finish the current issue-driven fixes already in flight.
2. Freeze new broad UI PoC additions temporarily.
3. Extract route-level screens first, without redesigning them.
4. Extract shared subcomponents only after route-level boundaries are stable.
5. Move inline HTML out of the remaining oversized components.
6. Align tests with the new structure as each slice lands.

## Suggested File Direction

Illustrative direction only:

```text
apps/magnetar-ui/src/app/screens/
  dashboard/
    dashboard-screen.component.ts
    dashboard-screen.component.html
    dashboard-screen.component.css
  live-run/
    live-run-screen.component.ts
    live-run-screen.component.html
  chat/
    chat-screen.component.ts
    chat-screen.component.html
  providers/
    providers-screen.component.ts
    providers-screen.component.html
  policy/
    policy-screen.component.ts
    policy-screen.component.html

apps/magnetar-ui/src/app/ui/components/
  policy-card/
  policy-detail-panel/
  provider-card/
  screen-header/
  empty-state/
```

## Constraints
- Do not mix this refactor into every active functional branch opportunistically.
- Do not rewrite behavior and architecture at the same time unless a slice is extremely small.
- Preserve the current product visual language while decomposing structure.
- Prefer extraction and containment over speculative redesign.

## Definition of Ready
This modularization effort should start only when:
- the currently targeted branch work is merged or intentionally paused
- the next slice is scoped as a structural refactor, not disguised feature work
- there is agreement on the first extraction boundary

## Definition of Done
This emergency side plan is satisfied only when:
- route-level screens are no longer concentrated in `app.component.ts`
- large inline HTML blocks are removed from oversized TypeScript files
- the main UI is organized by screen/component responsibility
- the resulting structure is easier to test, review, and extend
