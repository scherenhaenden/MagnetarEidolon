import { describe, it, expect, vi } from 'vitest';
import { of } from 'rxjs';
import { MagnetarAgent } from '../src/agent.js';
import { InMemoryTraceStore } from '../src/providers/in-memory-trace-store.js';
import { MagnetarEidolon } from '../src/models.js';
import { LLMProvider, MemoryStore, Tool } from '../src/interfaces.js';

describe('MagnetarAgent Tracing', () => {
  it('should emit trace events during the step lifecycle', () => {
    return new Promise<void>((resolve, reject) => {
      const state: MagnetarEidolon = {
        agentId: 'test-agent',
        plan: [],
        shortTermMemory: [],
        toolHistory: [],
        metadata: {}
      };

      const mockTool: Tool = {
        name: 'testTool',
        description: 'A test tool',
        execute: vi.fn().mockReturnValue(of({ success: true, output: 'Tool success' }))
      };

      const mockMemoryStore: MemoryStore = {
        addMemory: vi.fn().mockReturnValue(of(void 0)),
        query: vi.fn().mockReturnValue(of([]))
      };

      const mockLlm: LLMProvider = {
        generate: vi.fn().mockReturnValue(of({
          content: 'TOOL: testTool\nARGS: {"param": "value"}'
        }))
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
            expect(thinkEvent?.data.prompt).toBeDefined();
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
        error: (err) => reject(err)
      });
    });
  });

  it('should emit finish event on FINAL action', () => {
    return new Promise<void>((resolve, reject) => {
      const state: MagnetarEidolon = {
        agentId: 'test-agent',
        plan: [],
        shortTermMemory: [],
        toolHistory: [],
        metadata: {}
      };

      const mockMemoryStore: MemoryStore = {
        addMemory: vi.fn().mockReturnValue(of(void 0)),
        query: vi.fn().mockReturnValue(of([]))
      };

      const mockLlm: LLMProvider = {
        generate: vi.fn().mockReturnValue(of({
          content: 'FINAL: Task completed'
        }))
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

            resolve();
          } catch (e) {
            reject(e);
          }
        },
        error: (err) => reject(err)
      });
    });
  });
});
