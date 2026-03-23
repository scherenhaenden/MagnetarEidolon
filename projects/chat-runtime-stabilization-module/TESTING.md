# Chat Runtime Stabilization Testing

## Objectives
- Prove that chat works through the backend path, not by accident.
- Catch transport/schema failures before manual testing has to find them.
- Keep a repeatable manual acceptance checklist for LM Studio validation.

## Automated Coverage Targets
- Backend endpoint request-shape coverage.
- UI service request-shape coverage.
- Stream success, malformed event, and missing-body coverage.
- Send-key semantics: `Enter` sends, `Shift+Enter` inserts newline.

## Manual Acceptance
1. Start LM Studio and load a model.
2. Run root `npm run dev`.
3. Open the chat tab.
4. Send a prompt with `Enter`.
5. Verify tokens stream in incrementally.
6. Verify errors are understandable when LM Studio is unavailable or misconfigured.

## Diagnostics Validation
- Backend heartbeat endpoint responds with process metadata plus a provider-registry check.
- Deeper provider-health checks can fail independently from the lightweight heartbeat path.
- Browser network requests terminate at the backend, not the provider.
