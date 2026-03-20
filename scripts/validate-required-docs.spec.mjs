import assert from 'node:assert/strict';
import test from 'node:test';

import { validateRequiredDocs } from './validate-required-docs.mjs';

test('validateRequiredDocs accepts the expected documentation baseline', async () => {
  const errors = await validateRequiredDocs([
    { path: 'README.md', header: '# MagnetarEidolon' },
    { path: 'RULES.md', header: '# MagnetarEidolon Project Rules' },
  ], '/home/edward/Development/MagnetarEidolon');

  assert.deepEqual(errors, []);
});

test('validateRequiredDocs reports missing files and header mismatches', async () => {
  const errors = await validateRequiredDocs([
    { path: 'README.md', header: '# Wrong Header' },
    { path: 'missing.md', header: '# Missing' },
  ], '/home/edward/Development/MagnetarEidolon');

  assert.match(errors.join('\n'), /README\.md: expected first non-empty line to start with/);
  assert.match(errors.join('\n'), /missing\.md: required file is missing/);
});
