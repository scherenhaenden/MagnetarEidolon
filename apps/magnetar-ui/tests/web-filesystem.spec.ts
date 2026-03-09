import { firstValueFrom } from 'rxjs';
import { describe, expect, it } from 'vitest';

import { WebFileSystemTool } from '../src/app/core/tools/web-filesystem.js';

describe('WebFileSystemTool', () => {
  it('can write and read an empty file without treating it as missing', async () => {
    const tool = new WebFileSystemTool();

    const writeResult = await firstValueFrom(
      tool.execute({ action: 'write', path: '/notes/empty.txt', content: '' }),
    );
    expect(writeResult.success).toBe(true);

    const readResult = await firstValueFrom(
      tool.execute({ action: 'read', path: '/notes/empty.txt' }),
    );
    expect(readResult.success).toBe(true);
    expect(readResult.output).toBe('');
  });

  it('returns a not-found error for missing files', async () => {
    const tool = new WebFileSystemTool();

    const result = await firstValueFrom(
      tool.execute({ action: 'read', path: '/notes/missing.txt' }),
    );

    expect(result.success).toBe(false);
    expect(result.error).toContain('File not found');
  });
});
