import * as fs from 'fs/promises';
import { Observable, from, map, catchError, of } from 'rxjs';
import { Tool, ToolResult } from '../interfaces';

export class NodeFileSystemTool implements Tool {
  public readonly name = 'filesystem';
  public readonly description = 'Read and write files on the local filesystem using Node.js.';

  public execute(args: { action: 'read' | 'write' | 'list'; path: string; content?: string }): Observable<ToolResult> {
    switch (args.action) {
      case 'read':
        return from(fs.readFile(args.path, 'utf-8')).pipe(
          map(content => ({ success: true, output: content })),
          catchError(err => of({ success: false, error: err.message }))
        );
      case 'write':
        if (args.content === undefined) {
           return of({ success: false, error: 'Content is required for write action.' });
        }
        return from(fs.writeFile(args.path, args.content)).pipe(
          map(() => ({ success: true, output: `File ${args.path} written successfully.` })),
          catchError(err => of({ success: false, error: err.message }))
        );
      case 'list':
        return from(fs.readdir(args.path)).pipe(
          map(files => ({ success: true, output: files.join(', ') })),
          catchError(err => of({ success: false, error: err.message }))
        );
      default:
        return of({ success: false, error: `Unknown action: ${(args as any).action}` });
    }
  }
}
