import { describe, expect, it } from 'vitest';

import { deriveTestSeed, createTestFaker } from './factories/faker.js';
import {
  createGoal,
  createMagnetarState,
  createMemoryItem,
  createTask,
  createToolCall,
  createToolResult,
} from './factories/magnetar-factories.js';

describe('magnetar faker factories', () => {
  it('creates reproducible fixtures for the same namespace seed', () => {
    const seed = deriveTestSeed('sdk-factory-repro');
    const firstFaker = createTestFaker(seed);
    const secondFaker = createTestFaker(seed);

    const firstState = createMagnetarState(undefined, firstFaker);
    const secondState = createMagnetarState(undefined, secondFaker);

    expect(secondState).toEqual(firstState);
  });

  it('supports deterministic overrides for core runtime models', () => {
    const faker = createTestFaker(deriveTestSeed('sdk-factory-overrides'));

    const goal = createGoal({ status: 'active' }, faker);
    const task = createTask({ status: 'in_progress' }, faker);
    const memory = createMemoryItem({ metadata: { source: 'manual' } }, faker);
    const toolCall = createToolCall({ toolName: 'search' }, faker);
    const result = createToolResult({ success: false, error: 'search failed' }, faker);

    expect(goal.status).toBe('active');
    expect(task.status).toBe('in_progress');
    expect(memory.metadata).toEqual({ source: 'manual' });
    expect(toolCall.toolName).toBe('search');
    expect(result).toEqual({
      success: false,
      output: expect.any(String),
      error: 'search failed',
    });
  });
});
