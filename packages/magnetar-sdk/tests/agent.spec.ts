import { describe, it, expect, vi } from 'vitest';
import { of } from 'rxjs';

import { MagnetarAgent } from '../src/agent.js';
import { LLMProvider, MemoryStore, Tool } from '../src/interfaces.js';
import { InMemoryTraceStore } from '../src/providers/in-memory-trace-store.js';
import {
  createGoal,
  createMagnetarState,
  createMemoryItem,
  createToolResult,
} from './factories/magnetar-factories.js';
import { createTestFaker, deriveTestSeed } from './factories/faker.js';

function createTestState(seedNamespace: string, overrides = {}) {
  const faker = createTestFaker(deriveTestSeed(seedNamespace));

  return createMagnetarState(
    {
      agentId: 'test-agent',
      plan: [],
      shortTermMemory: [],
      toolHistory: [],
      metadata: {},
      ...overrides,
    },
    faker,
  );
}

function createMemoryStoreMock(): MemoryStore {
  return {
    addMemory: vi.fn().mockReturnValue(of(void 0)),
    query: vi.fn().mockReturnValue(of([])),
  };
}

describe('MagnetarAgent Tracing', () => {
  it('should emit trace events during the step lifecycle', () => {
    return new Promise<void>((resolve, reject) => {
      const state = createTestState('agent-tracing-tool-step');

      const mockTool: Tool = {
        name: 'testTool',
        description: 'A test tool',
        execute: vi.fn().mockReturnValue(of(createToolResult({ output: 'Tool success' }))),
      };

      const mockMemoryStore = createMemoryStoreMock();

      const mockLlm: LLMProvider = {
        generate: vi.fn().mockReturnValue(of({
          content: 'TOOL: testTool\nARGS: {"param": "value"}'
        })),
      };

      const traceStore = new InMemoryTraceStore();
      const agent = new MagnetarAgent(state, [mockTool], mockMemoryStore, mockLlm, traceStore);

      agent.step().subscribe({
        next: () => {
          const events = traceStore.getTrace();

          try {
            expect(events.length).toBeGreaterThan(0);

            const observeEvent = events.find(e => e.type === 'observe');
            expect(observeEvent).toBeDefined();
            expect(observeEvent?.data.environment).toBeDefined();

            const thinkEvent = events.find(e => e.type === 'think');
            expect(thinkEvent).toBeDefined();
            expect(thinkEvent?.data.promptPreview).toBeDefined();
            expect(thinkEvent?.data.promptLength).toBeGreaterThan(0);
            expect(thinkEvent?.data.responsePreview).toContain('TOOL: testTool');
            expect(thinkEvent?.data.parsedAction).toEqual({
              type: 'tool',
              name: 'testTool',
              args: { param: 'value' }
            });

            const actEvent = events.find(e => e.type === 'act');
            expect(actEvent).toBeDefined();
            expect(actEvent?.data.action.name).toBe('testTool');
            expect(actEvent?.data.result.output).toBe('Tool success');

            const reflectEvent = events.find(e => e.type === 'reflect');
            expect(reflectEvent).toBeDefined();
            expect(reflectEvent?.data.memoryAdded.content).toContain('Tool testTool returned: Tool success');

            resolve();
          } catch (e) {
            reject(e);
          }
        },
        error: (err) => reject(err),
      });
    });
  });

  it('should emit finish event on FINAL action', () => {
    return new Promise<void>((resolve, reject) => {
      const state = createTestState('agent-tracing-finish-step', {
        goal: createGoal({ status: 'active' }, createTestFaker(deriveTestSeed('agent-tracing-finish-goal'))),
      });

      const mockMemoryStore = createMemoryStoreMock();

      const mockLlm: LLMProvider = {
        generate: vi.fn().mockReturnValue(of({
          content: 'FINAL: Task completed'
        })),
      };

      const traceStore = new InMemoryTraceStore();
      const agent = new MagnetarAgent(state, [], mockMemoryStore, mockLlm, traceStore);

      agent.step().subscribe({
        next: () => {
          const events = traceStore.getTrace();

          try {
            const finishEvent = events.find(e => e.type === 'finish');
            expect(finishEvent).toBeDefined();
            expect(finishEvent?.data.message).toBe('Task completed');
            expect(state.goal?.status).toBe('completed');

            resolve();
          } catch (e) {
            reject(e);
          }
        },
        error: (err) => reject(err),
      });
    });
  });

  it('should emit an error trace when a tool is not found', () => {
    return new Promise<void>((resolve, reject) => {
      const state = createTestState('agent-tracing-missing-tool');

      const mockMemoryStore = createMemoryStoreMock();

      const mockLlm: LLMProvider = {
        generate: vi.fn().mockReturnValue(of({
          content: 'TOOL: missingTool\nARGS: {}'
        })),
      };

      const traceStore = new InMemoryTraceStore();
      const agent = new MagnetarAgent(state, [], mockMemoryStore, mockLlm, traceStore);

      agent.step().subscribe({
        next: () => {
          const events = traceStore.getTrace();

          try {
            const errorEvent = events.find(e => e.type === 'error');
            expect(errorEvent).toBeDefined();
            expect(errorEvent?.data.error).toContain('not found');
            expect(state.shortTermMemory.at(-1)?.content).toContain('missingTool');

            resolve();
          } catch (e) {
            reject(e);
          }
        },
        error: (err) => reject(err),
      });
    });
  });

  it('should build prompts from the last five generated memory entries only', () => {
    return new Promise<void>((resolve, reject) => {
      const faker = createTestFaker(deriveTestSeed('agent-tracing-history-window'));
      const history = Array.from({ length: 6 }, (_, index) =>
        createMemoryItem({ content: `memory-${index}` }, faker),
      );
      const state = createMagnetarState(
        {
          agentId: 'test-agent',
          goal: createGoal({ description: 'Inspect history', status: 'active' }, faker),
          plan: [],
          shortTermMemory: history,
          toolHistory: [],
          metadata: {},
        },
        faker,
      );
      const mockMemoryStore = createMemoryStoreMock();
      const mockLlm: LLMProvider = {
        generate: vi.fn().mockReturnValue(of({
          content: 'FINAL: History inspected'
        })),
      };
      const traceStore = new InMemoryTraceStore();
      const agent = new MagnetarAgent(state, [], mockMemoryStore, mockLlm, traceStore);

      agent.step().subscribe({
        next: () => {
          try {
            const prompt = mockLlm.generate.mock.calls[0]?.[0]?.[0]?.content as string;

            expect(prompt).not.toContain('memory-0');
            expect(prompt).toContain('memory-1');
            expect(prompt).toContain('memory-5');
            expect(state.goal?.status).toBe('completed');

            resolve();
          } catch (e) {
            reject(e);
          }
        },
        error: (err) => reject(err),
      });
    });
  });
});
