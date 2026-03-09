import { Observable, of } from 'rxjs';
import { Tool, ToolResult } from '../interfaces.js';

/**
 * A virtual/mock filesystem for the web browser environment.
 * Existing keys are readable even when their content is the empty string.
 */
export class WebFileSystemTool implements Tool {
  public readonly name = 'filesystem';
  public readonly description = 'Read and write files in a virtual browser-based sandbox.';

  private virtualFS: Map<string, string> = new Map();

  public execute(args: { action: 'read' | 'write' | 'list'; path: string; content?: string }): Observable<ToolResult> {
    if (!args.path || typeof args.path !== 'string') {
      return of({ success: false, error: 'Invalid path provided.' });
    }

    switch (args.action) {
      case 'read':
        if (!this.virtualFS.has(args.path)) {
          return of({ success: false, error: `File not found: ${args.path}` });
        }

        // Empty-string content is a valid file payload, not a missing-file signal.
        return of({ success: true, output: this.virtualFS.get(args.path) ?? '' });
      case 'write':
        if (args.content === undefined) {
           return of({ success: false, error: 'Content is required for write action.' });
        }
        this.virtualFS.set(args.path, args.content);
        return of({ success: true, output: `Virtual file ${args.path} written.` });
      case 'list':
        const files = Array.from(this.virtualFS.keys()).filter(f => f.startsWith(args.path));
        return of({ success: true, output: files.join(', ') || '(empty virtual sandbox)' });
      default:
        return of({ success: false, error: `Unknown action: ${(args as any).action}` });
    }
  }
}
