import { firstValueFrom } from 'rxjs';
import { describe, expect, it } from 'vitest';

import type { ToolResult } from '@magnetar/magnetar-sdk/interfaces';
import { WebFileSystemTool } from '@magnetar/magnetar-sdk/tools/web-filesystem';

describe('WebFileSystemTool', () => {
  it('can write and read an empty file without treating it as missing', async () => {
    const tool = new WebFileSystemTool();

    const writeResult: ToolResult = await firstValueFrom(
      tool.execute({ action: 'write', path: '/notes/empty.txt', content: '' }),
    );
    expect(writeResult.success).toBe(true);

    const readResult: ToolResult = await firstValueFrom(
      tool.execute({ action: 'read', path: '/notes/empty.txt' }),
    );
    expect(readResult.success).toBe(true);
    expect(readResult.output).toBe('');
  });

  it('returns a not-found error for missing files', async () => {
    const tool = new WebFileSystemTool();

    const result: ToolResult = await firstValueFrom(
      tool.execute({ action: 'read', path: '/notes/missing.txt' }),
    );

    expect(result.success).toBe(false);
    expect(result.error).toContain('File not found');
  });
});
