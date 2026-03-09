import { Observable, of, from, map, switchMap, tap, catchError } from 'rxjs';
import { MagnetarEidolon, MemoryItem, ToolCall } from './models';
import { LLMProvider, Tool, MemoryStore, ToolResult } from './interfaces';

export class MagnetarAgent {
  private tools: Map<string, Tool> = new Map();

  constructor(
    private state: MagnetarEidolon,
    tools: Tool[],
    private memoryStore: MemoryStore,
    private llm: LLMProvider
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
  }

  private think(): Observable<any> {
    const prompt = this.constructPrompt();
    return this.llm.generate([{ role: 'user', content: prompt }]).pipe(
      map(response => this.parseAction(response.content))
    );
  }

  private act(action: any): Observable<void> {
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
          }),
          map(() => void 0)
        );
      } else {
        this.state.shortTermMemory.push({
          id: crypto.randomUUID(),
          content: `Error: Tool ${action.name} not found.`,
          timestamp: new Date(),
          metadata: {}
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
      return of(void 0);
    }
    return of(void 0);
  }

  private reflect(): Observable<void> {
    if (this.state.shortTermMemory.length > 0) {
      const lastMem = this.state.shortTermMemory[this.state.shortTermMemory.length - 1];
      return this.memoryStore.addMemory(lastMem.content, { timestamp: lastMem.timestamp.toISOString() });
    }
    return of(void 0);
  }

  private constructPrompt(): str {
    const history = this.state.shortTermMemory
      .slice(-5)
      .map(m => `- ${m.content}`)
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

  private parseAction(content: string): any {
    const trimmed = content.trim();
    if (trimmed.startsWith('TOOL:')) {
      const lines = trimmed.split('\n');
      const toolName = lines[0].replace('TOOL:', '').trim();
      const argsStr = lines.slice(1).join('\n').replace('ARGS:', '').trim();
      try {
        return { type: 'tool', name: toolName, args: JSON.parse(argsStr) };
      } catch (e) {
        return { type: 'error', message: 'Failed to parse arguments' };
      }
    } else if (trimmed.startsWith('FINAL:')) {
      return { type: 'finish', message: trimmed.replace('FINAL:', '').trim() };
    }
    return null;
  }
}
