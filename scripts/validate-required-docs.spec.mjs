import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { validateRequiredDocs } from './validate-required-docs.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

test('validateRequiredDocs accepts the expected documentation baseline', async () => {
  const errors = await validateRequiredDocs([
    { path: 'README.md', header: '# MagnetarEidolon' },
    { path: 'RULES.md', header: '# MagnetarEidolon Project Rules' },
  ], REPO_ROOT);

  assert.deepEqual(errors, []);
});

test('validateRequiredDocs reports missing files and header mismatches', async () => {
  const errors = await validateRequiredDocs([
    { path: 'README.md', header: '# Wrong Header' },
    { path: 'missing.md', header: '# Missing' },
  ], REPO_ROOT);

  assert.match(errors.join('\n'), /README\.md: expected first non-empty line to start with/);
  assert.match(errors.join('\n'), /missing\.md: required file is missing/);
});
