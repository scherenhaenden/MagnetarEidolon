import { Observable, of } from 'rxjs';
import { Tool, ToolResult } from '../interfaces';

/**
 * A virtual/mock filesystem for the web browser environment.
 */
export class WebFileSystemTool implements Tool {
  public readonly name = 'filesystem';
  public readonly description = 'Read and write files in a virtual browser-based sandbox.';

  private virtualFS: Map<string, string> = new Map();

  public execute(args: { action: 'read' | 'write' | 'list'; path: string; content?: string }): Observable<ToolResult> {
    switch (args.action) {
      case 'read':
        const content = this.virtualFS.get(args.path);
        return content !== undefined
          ? of({ success: true, output: content })
          : of({ success: false, error: `File not found: ${args.path}` });
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
