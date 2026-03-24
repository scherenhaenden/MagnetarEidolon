# Voice UI Module Plan

## Milestones

| Milestone ID | Name | Target Date | Description | Completion Criteria |
| :--- | :--- | :--- | :--- | :--- |
| `ms-voice-01` | Voice Interaction Re-scope | 2026-03-31 | Reframe the legacy voice track for the TypeScript workspace and define all foundations required before implementation begins. | Module boundaries, SDK interfaces, browser constraints, risk mitigations, and testing strategy documented; `task-voice-102` ready to start once `task-voice-101` is accepted and moved to `done`. |
| `ms-voice-02` | Voice Capture and Transcription Baseline | 2026-04-30 | Implement the browser-native voice capture and transcription flow inside the Angular shell. | VoiceCaptureModule compiles, integrates with the chat composer, passes unit and permission tests, and is manually validated on Chrome/Edge. |

## Task Backlog

| Task ID | Milestone | Title | Owner | Effort (pts) | State | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `task-voice-101` | `ms-voice-01` | Re-scope voice UI foundations for the TypeScript workspace | Jules | 3 | in_review | Architecture, module boundaries, browser constraints, risks, and testing strategy are now documented in this module. All Python/Gradio/Poetry assumptions have been removed. |
| `task-voice-102` | `ms-voice-02` | Implement voice capture and interaction flow in the TypeScript UI | Jules | 5 | planned | Planned implementation task. It remains blocked until `task-voice-101` is accepted and moved from `in_review` to `done`, after which implementation must follow `ARCHITECTURE.md` and `REQUIREMENTS.md` in this module with no Python, Gradio, or Poetry dependencies anywhere in the voice feature path. |

## Effort Summary
- **Total effort:** 8 pts
- **Completed (`done`):** 0 pts
- **In review:** 3 pts (`task-voice-101`)
- **Planned:** 5 pts (`task-voice-102`)

## Change Management
If this module changes the product roadmap or test strategy, the root `PLAN.md`, `STATUS.md`, and `TESTING.md` must be updated in the same change set.
