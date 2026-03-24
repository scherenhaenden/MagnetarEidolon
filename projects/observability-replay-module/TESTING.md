# Testing the Observability and Replay Module

This document describes how to test the observability features.

## Unit Testing

Unit tests should focus on ensuring that the `MagnetarAgent` correctly emits `TraceEvent`s at each phase of its execution loop (Observe, Think, Act, Reflect).

1.  **Test Observation:** Verify that calling `agent.step()` (or specific internal methods if exposed) emits an observation event.
2.  **Test Thought Generation:** Mock the LLM provider to return a specific action (e.g., tool call) and verify that a thought event is recorded with the parsed action.
3.  **Test Action Execution:** Mock a tool execution (success or failure) and verify that an action event is recorded containing the result or error.
4.  **Test Reflection:** Verify that a reflection event is added to the trace store after an action completes.
5.  **Test Goal Completion:** Verify that a final summary or completion event is emitted when the agent finishes its goal.

## Integration Testing

Integration tests should involve running the `MagnetarAgent` with a real or mocked LLM and tools to verify that a complete execution trace is generated and stored correctly.

1.  **Simple Goal Execution:** Run an agent with a basic goal (e.g., a simple calculation or file read). Verify that the resulting execution trace contains all the expected events in the correct order.
2.  **Error Handling:** Force a tool failure or an LLM parsing error and verify that the error is correctly captured in the trace and the agent handles it gracefully (or fails appropriately if configured to do so).

## User Acceptance Testing (Manual Verification)

1.  Run the CLI or UI and execute a goal.
2.  Verify that the execution trace is visible and understandable.
3.  Ensure that sensitive information (if any) is handled correctly in the trace (e.g., masked or not recorded depending on policy).
