import { readFileSync } from 'node:fs';
import { globSync } from 'node:fs';
import path from 'node:path';

const workspaceRoot = path.resolve(import.meta.dirname, '..');

const rules = [
  {
    name: 'memory-domain literals',
    literals: ['session', 'durable', 'pinned', 'all'],
    files: ['src/**/*.ts', 'tests/**/*.ts'],
    allowlist: new Set([
      'src/app/core/models/memory-inspector.ts',
      'scripts/check-no-magic-strings.mjs',
    ]),
  },
];

const failures = [];

for (const rule of rules) {
  const files = new Set(
    rule.files.flatMap((pattern) =>
      globSync(pattern, {
        cwd: workspaceRoot,
        nodir: true,
      }),
    ),
  );

  for (const relativeFile of files) {
    if (rule.allowlist.has(relativeFile)) {
      continue;
    }

    const source = readFileSync(path.join(workspaceRoot, relativeFile), 'utf8');
    const lines = source.split('\n');

    lines.forEach((line, index) => {
      for (const literal of rule.literals) {
        const singleQuote = `'${literal}'`;
        const doubleQuote = `"${literal}"`;

        if (line.includes(singleQuote) || line.includes(doubleQuote)) {
          failures.push({
            rule: rule.name,
            file: relativeFile,
            line: index + 1,
            literal,
            source: line.trim(),
          });
        }
      }
    });
  }
}

if (failures.length > 0) {
  console.error('Magic string check failed.');
  for (const failure of failures) {
    console.error(
      `${failure.file}:${failure.line} [${failure.rule}] raw literal "${failure.literal}" found: ${failure.source}`,
    );
  }
  process.exit(1);
}

console.log('Magic string check passed.');
