import { Observable, of, map, switchMap, tap } from 'rxjs';
import { MagnetarEidolon, ToolCall } from './models.js';
import {
  EnvironmentSnapshot,
  LLMProvider,
  MemoryStore,
  Tool,
  ToolResult,
  TraceAction,
  TraceEventInput,
  TraceStore
} from './interfaces.js';

export type AgentAction =
  | { type: 'tool'; name: string; args: Record<string, unknown> }
  | { type: 'finish'; message: string }
  | { type: 'error'; message: string };

export class MagnetarAgent {
  private tools: Map<string, Tool> = new Map();
  private readonly tracePreviewLength = 200;

  constructor(
    private state: MagnetarEidolon,
    tools: Tool[],
    private memoryStore: MemoryStore,
    private llm: LLMProvider,
    private traceStore?: TraceStore
  ) {
    tools.forEach(t => this.tools.set(t.name, t));
  }

  public step(): Observable<MagnetarEidolon> {
    // 1. Observe
    this.observe();

    // 2. Think
    return this.think().pipe(
      switchMap(action => {
        if (!action) return of(this.state);

        // 3. Act
        return this.act(action).pipe(
          // 4. Reflect
          switchMap(() => this.reflect()),
          map(() => this.state)
        );
      })
    );
  }

  private observe(): void {
    this.state.environment = {
      os: 'web', // Placeholder for platform abstraction
      currentDirectory: '/',
      timestamp: new Date()
    };
    this.trace({
      type: 'observe',
      data: { environment: this.getEnvironmentSnapshot() }
    });
  }

  private think(): Observable<AgentAction | null> {
    const prompt = this.constructPrompt();
    return this.llm.generate([{ role: 'user', content: prompt }]).pipe(
      map(response => {
        const responseContent = response.content ?? '';
        const action = responseContent ? this.parseAction(responseContent) : null;

        this.trace({
          type: 'think',
          data: {
            promptPreview: this.createTracePreview(prompt),
            promptLength: prompt.length,
            responsePreview: this.createTracePreview(responseContent),
            responseLength: responseContent.length,
            parsedAction: this.toTraceAction(action)
          }
        });

        return action;
      })
    );
  }

  private act(action: AgentAction): Observable<void> {
    if (action.type === 'tool') {
      const tool = this.tools.get(action.name);
      if (tool) {
        return tool.execute(action.args).pipe(
          tap((result: ToolResult) => {
            const callRecord: ToolCall = {
              toolName: action.name,
              arguments: action.args,
              result: result.output,
              error: result.error,
              timestamp: new Date()
            };
            this.state.toolHistory.push(callRecord);
            this.state.shortTermMemory.push({
              id: crypto.randomUUID(),
              content: `Tool ${action.name} returned: ${result.output || result.error}`,
              timestamp: new Date(),
              metadata: {}
            });
            this.trace({
              type: 'act',
              data: { action: this.toTraceAction(action)!, result }
            });
          }),
          map(() => void 0)
        );
      } else {
        const errorMsg = `Error: Tool ${action.name} not found.`;
        this.state.shortTermMemory.push({
          id: crypto.randomUUID(),
          content: errorMsg,
          timestamp: new Date(),
          metadata: {}
        });
        this.trace({
          type: 'error',
          data: { action: this.toTraceAction(action)!, error: errorMsg }
        });
        return of(void 0);
      }
    } else if (action.type === 'finish') {
      if (this.state.goal) {
        this.state.goal.status = 'completed';
      }
      this.state.shortTermMemory.push({
        id: crypto.randomUUID(),
        content: `Goal Completed: ${action.message}`,
        timestamp: new Date(),
        metadata: {}
      });
      this.trace({
        type: 'finish',
        data: { message: action.message }
      });
      return of(void 0);
    } else if (action.type === 'error') {
      this.state.shortTermMemory.push({
        id: crypto.randomUUID(),
        content: `Error: ${action.message}`,
        timestamp: new Date(),
        metadata: {}
      });
      this.trace({
        type: 'error',
        data: { error: action.message }
      });
      return of(void 0);
    }
    return of(void 0);
  }

  private reflect(): Observable<void> {
    if (this.state.shortTermMemory.length > 0) {
      const lastMem = this.state.shortTermMemory[this.state.shortTermMemory.length - 1];
      return this.memoryStore.addMemory(lastMem.content, { timestamp: lastMem.timestamp.toISOString() }).pipe(
        tap(() => {
          this.trace({
            type: 'reflect',
            data: { memoryAdded: lastMem }
          });
        })
      );
    }
    return of(void 0);
  }

  private trace(event: TraceEventInput): void {
    this.traceStore?.addEvent(event);
  }

  private getEnvironmentSnapshot(): EnvironmentSnapshot {
    const environment = this.state.environment;
    if (!environment) {
      return {};
    }

    return {
      ...(environment.os !== undefined ? { os: environment.os } : {}),
      ...(environment.currentDirectory !== undefined ? { currentDirectory: environment.currentDirectory } : {}),
      ...(environment.timestamp !== undefined ? { timestamp: environment.timestamp } : {})
    };
  }

  private createTracePreview(content: string): string {
    if (content.length <= this.tracePreviewLength) {
      return content;
    }

    return `${content.slice(0, this.tracePreviewLength)}...`;
  }

  private toTraceAction(action: AgentAction | null): TraceAction | null {
    if (!action) {
      return null;
    }

    if (action.type === 'tool') {
      return {
        type: 'tool',
        name: action.name,
        args: action.args
      };
    }

    if (action.type === 'finish') {
      return {
        type: 'finish',
        message: action.message
      };
    }

    return {
      type: 'error',
      message: action.message
    };
  }

  private constructPrompt(): string {
    const history = this.state.shortTermMemory
      .slice(-5)
      .map((m) => `- ${m.content}`)
      .join('\n');

    return `
You are Magnetar.
Goal: ${this.state.goal?.description || 'No goal set'}
Environment: OS=${this.state.environment?.os}, Dir=${this.state.environment?.currentDirectory}
History:
${history}

Available Tools: ${Array.from(this.tools.keys()).join(', ')}

Decide the next step.
Format:
TOOL: <name>
ARGS: <json_args>
OR
FINAL: <message>
`;
  }

  private parseAction(content: string): AgentAction | null {
    const trimmed = content.trim();
    if (trimmed.startsWith('TOOL:')) {
      const lines = trimmed.split('\n');
      const toolName = lines[0].replace('TOOL:', '').trim();
      const argsStr = lines.slice(1).join('\n').replace('ARGS:', '').trim();
      try {
        return { type: 'tool', name: toolName, args: JSON.parse(argsStr) };
      } catch {
        return { type: 'error', message: 'Failed to parse arguments' };
      }
    } else if (trimmed.startsWith('FINAL:')) {
      return { type: 'finish', message: trimmed.replace('FINAL:', '').trim() };
    }
    return null;
  }
}
