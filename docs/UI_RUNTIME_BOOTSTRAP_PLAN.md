# UI Runtime Bootstrap Plan

## Purpose
This plan turns the current TypeScript proof of concept into a runnable product surface with two first-class entrypoints:

- a real web UI served locally in the browser
- a real CLI flow that can be executed directly for console usage

Today, `apps/magnetar-ui` can be built, typechecked, and tested, but it does not yet provide:

- a real browser dev server
- a production-ready web build pipeline
- a direct CLI development flow that avoids manual build friction
- a documented distinction between local development requirements and future "no-install" distribution targets

## Problem Statement
The repository already documents a unified CLI/Web architecture, but the TypeScript workspace is not yet operational in the way a product user or contributor would expect.

Current gaps:
- `npm run start` is only a placeholder and does not launch a web server.
- The web path is not usable as a real product surface.
- The CLI path exists only through compiled output and is not yet optimized for direct developer usage.
- The repository does not clearly separate:
  - local development startup
  - local validation
  - packaged distribution
  - future no-install delivery options

## Guiding Decisions
1. `MagnetarEidolon` is the product identity. The UI workspace must expose product entrypoints, not just a technical scaffold.
2. The shared runtime belongs in `packages/magnetar-sdk`; UI bootstrapping must consume that package boundary rather than regress into a monolithic app workspace.
3. "Run without install" is not a realistic local development requirement on a clean checkout. It is a distribution requirement.
4. The project should support two different experiences explicitly:
   - contributor/developer startup
   - end-user/runtime distribution
5. Test infrastructure must verify not only product code, but also the correctness of the startup commands and the test harness itself.

## Target Outcomes

### Outcome 1: Real web startup
The repository must provide a command that launches the TypeScript UI in a browser-oriented local dev server.

Success conditions:
- `apps/magnetar-ui` has a real `start` or `dev` command that launches the UI without missing dependencies or placeholder behavior.
- The command launches a web application locally.
- The startup path is documented in workspace and root docs.
- The UI consumes `packages/magnetar-sdk` through a stable local package boundary.

### Outcome 2: Real CLI startup
The repository must provide a direct CLI flow for local use and a clear compiled/distribution flow.

Success conditions:
- There is a developer-facing CLI command for direct execution during development.
- There is a production-oriented CLI command for built artifacts.
- Both flows are documented with exact expected usage.

### Outcome 3: Explicit install vs no-install story
The repository must stop implying that a clean checkout can run without dependencies.

Success conditions:
- Docs state clearly that local startup requires dependency installation.
- Docs define future no-install targets separately:
  - browser-hosted web build
  - packaged CLI binary or release artifact

### Outcome 4: Verifiable startup pipeline
The startup flows must be validated in CI and locally.

Success conditions:
- CI validates web build, CLI build, and startup-oriented smoke checks.
- Tests fail if startup scripts drift from actual workspace behavior.
- The repo documents how test-the-tests checks are performed.

## Workstreams

## Workstream A: Establish the runtime contract for launch modes
Clarify which launch modes are supported and what each one means.

Deliverables:
- Canonical definition of:
  - `web-dev`
  - `web-build`
  - `cli-dev`
  - `cli-build`
  - future `web-release`
  - future `cli-release`
- Mapping of each mode to command, dependency expectations, and output artifact.
- Documentation update in root docs and workspace docs.

Open decisions:
- Whether the UI should stay Angular-based or adopt a lighter web runtime if Angular dependencies are still absent.
- Whether the CLI dev flow should use `tsx`, `ts-node`, or an equivalent NodeNext-friendly runner.

## Workstream B: Make the web UI actually runnable
Replace the placeholder startup path with a real browser-serving workflow.

Deliverables:
- Install and wire the missing framework/runtime dependencies.
- Add a real dev-server command in `apps/magnetar-ui/package.json`.
- Ensure the workspace can resolve `@magnetar/magnetar-sdk` during dev and build.
- Add a production build command if the web framework requires one distinct from plain `tsc`.
- Document the web startup flow in:
  - `apps/magnetar-ui/README.md`
  - `README.md`
  - this plan document if implementation deviates

Acceptance checks:
- A contributor can run the documented command and open the UI locally without startup-script or dependency-resolution errors.
- The startup command fails loudly and clearly on broken dependency wiring.

## Workstream C: Make the CLI usable in development and distribution
Reduce the friction of using the CLI path.

Deliverables:
- Add a direct development CLI command, for example `cli:dev`.
- Keep a built CLI path, for example `build` plus `cli`.
- Ensure the CLI imports shared runtime code through the SDK package boundary.
- Document sample commands and expected outputs.

Acceptance checks:
- A contributor can run the CLI in development mode without manually invoking compiled files.
- A contributor can also run the built CLI from emitted artifacts.

## Workstream D: Define the no-install story correctly
Separate local development from runtime distribution.

Deliverables:
- Documentation stating:
  - local development requires dependency installation
  - no-install support is a release/distribution goal
- A shortlist of future no-install delivery options:
  - publish static web artifacts for browser hosting
  - package the CLI as a standalone executable or release asset

Acceptance checks:
- No root/workspace doc falsely suggests that a clean checkout can be started without installing dependencies.

## Workstream E: Expand the validation pipeline
Ensure startup behavior is part of quality gates.

Deliverables:
- CI steps for:
  - UI dependency install
  - SDK dependency install
  - web build
  - CLI build
  - CLI smoke invocation
- Optional smoke validation for the web entrypoint if the framework permits headless boot validation.
- Documentation of which checks are blocking and which are advisory.

Acceptance checks:
- CI covers the commands contributors are told to use.
- A broken startup script is caught before merge.

## Workstream F: Test the tests
Add meta-validation so the test system itself is not trusted blindly.

Deliverables:
- A documented method for validating test effectiveness.
- At least one controlled mutation or intentional break procedure for:
  - CLI smoke coverage
  - startup-script coverage
  - SDK boundary validation
- Documentation in `TESTING.md` describing how these checks are run and how often.

Acceptance checks:
- The team can demonstrate that critical smoke checks fail when the startup path is intentionally broken.

## Proposed Task Breakdown

| Proposed Task | Scope | Suggested Milestone |
| :--- | :--- | :--- |
| `task-ui-109` | Make web and CLI entrypoints runnable from `apps/magnetar-ui` | `ms-16` |
| `task-ui-110` | Add real browser dev-server support and product startup docs | `ms-16` |
| `task-ui-111` | Add direct CLI development command and compiled CLI contract | `ms-14` |
| `task-ts-qa-109` | Add startup smoke checks for web/CLI commands | `ms-ts-qa-01` |
| `task-ts-qa-110` | Add meta-validation for startup tests and smoke suite integrity | `ms-ts-qa-01` |

## Recommended Execution Order
1. Confirm the intended web runtime toolchain and dev-server approach.
2. Wire a real web startup command.
3. Wire a direct CLI development command.
4. Update root/workspace docs so startup instructions match reality.
5. Extend CI to verify the documented startup paths.
6. Add meta-validation for the startup-oriented test layer.

## Definition of Done
This plan is complete only when all of the following are true:

- A real browser command exists and is documented.
- A real CLI development command exists and is documented.
- The built CLI path remains working and documented.
- Root docs explain the difference between local startup and no-install distribution.
- CI validates the startup commands contributors are told to use.
- Test strategy documents how startup tests and test-the-tests validation are enforced.

## Current Command Baseline
These are the commands the repository currently expects contributors to use for the TypeScript UI workspace.

```bash
cd apps/magnetar-ui
npm install

# Web local
npm run start

# CLI in development
npm run cli:dev -- about
npm run cli:dev -- canonical-model

# Built CLI
npm run build:cli
npm run cli -- about

# Validation
npm run typecheck
npm run test:ci
npm run build
```
