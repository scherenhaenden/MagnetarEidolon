import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { validateRequiredDocs } from './validate-required-docs.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function withTempRepo(files, callback) {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'magnetar-required-docs-'));

  try {
    await Promise.all(
      Object.entries(files).map(async ([relativePath, contents]) => {
        const absolutePath = path.join(tempDir, relativePath);
        await fs.mkdir(path.dirname(absolutePath), { recursive: true });
        await fs.writeFile(absolutePath, contents, 'utf8');
      }),
    );

    await callback(tempDir);
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}

test('validateRequiredDocs accepts the expected documentation baseline', async () => {
  await withTempRepo(
    {
      'README.md': '[badge]\n\n# MagnetarEidolon\n',
      'RULES.md': '<!-- generated -->\n\n# MagnetarEidolon Project Rules\n',
    },
    async (repoRoot) => {
      const errors = await validateRequiredDocs([
        { path: 'README.md', header: '# MagnetarEidolon' },
        { path: 'RULES.md', header: '# MagnetarEidolon Project Rules' },
      ], repoRoot);

      assert.deepEqual(errors, []);
    },
  );
});

test('validateRequiredDocs reports missing files and header mismatches', async () => {
  await withTempRepo(
    {
      'README.md': 'preface\n\n# MagnetarEidolon\n',
      'empty.md': '   \n\n',
    },
    async (repoRoot) => {
      const errors = await validateRequiredDocs([
        { path: 'README.md', header: '# Wrong Header' },
        { path: 'missing.md', header: '# Missing' },
        { path: 'empty.md', header: '# Empty' },
      ], repoRoot);

      assert.match(
        errors.join('\n'),
        /README\.md: expected first non-empty header line to start with/,
      );
      assert.match(errors.join('\n'), /missing\.md: required file is missing/);
      assert.match(errors.join('\n'), /empty\.md: no markdown-style header line found/);
    },
  );
});
