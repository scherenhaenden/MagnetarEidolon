import * as fs from 'fs/promises';
import * as path from 'path';
import { Observable, from, map, catchError, of } from 'rxjs';
import { Tool, ToolResult } from '../interfaces.js';

export class NodeFileSystemTool implements Tool {
  public readonly name = 'filesystem';
  public readonly description = 'Read and write files on the local filesystem using Node.js.';

  private readonly workspaceRoot: string = process.cwd();

  public execute(args: { action: 'read' | 'write' | 'list'; path: string; content?: string }): Observable<ToolResult> {
    const safePath = this.resolveSafePath(args.path);
    if (!safePath) {
      return of({ success: false, error: `Access denied: Path ${args.path} is outside the allowed workspace.` });
    }

    switch (args.action) {
      case 'read':
        return from(fs.readFile(safePath, 'utf-8')).pipe(
          map(content => ({ success: true, output: content })),
          catchError(err => of({ success: false, error: err.message }))
        );
      case 'write':
        if (args.content === undefined) {
           return of({ success: false, error: 'Content is required for write action.' });
        }
        return from(fs.writeFile(safePath, args.content)).pipe(
          map(() => ({ success: true, output: `File ${args.path} written successfully.` })),
          catchError(err => of({ success: false, error: err.message }))
        );
      case 'list':
        return from(fs.readdir(safePath)).pipe(
          map(files => ({ success: true, output: files.join(', ') })),
          catchError(err => of({ success: false, error: err.message }))
        );
      default:
        return of({ success: false, error: `Unknown action: ${(args as any).action}` });
    }
  }

  /**
   * Resolves a path and ensures it is within the workspace root.
   */
  private resolveSafePath(requestedPath: string): string | null {
    const resolved = path.resolve(this.workspaceRoot, requestedPath);
    const relative = path.relative(this.workspaceRoot, resolved);
    
    // If the path is outside the root, 'relative' will start with '..'
    const isOutside = relative.startsWith('..') || path.isAbsolute(relative);
    
    return isOutside ? null : resolved;
  }
}
