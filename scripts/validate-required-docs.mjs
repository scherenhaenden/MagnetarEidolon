import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

export const REQUIRED_DOCS = [
  { path: 'README.md', header: '# MagnetarEidolon' },
  { path: 'PLAN.md', header: '# MagnetarEidolon Operational Plan' },
  { path: 'BITACORA.md', header: '# Logbook of MagnetarEidolon' },
  { path: 'REQUIREMENTS.md', header: '# MagnetarEidolon Requirements' },
  { path: 'ARCHITECTURE.md', header: '# MagnetarEidolon Architecture' },
  { path: 'RULES.md', header: '# MagnetarEidolon Project Rules' },
  { path: 'STATUS.md', header: '# Current Status' },
  { path: 'TESTING.md', header: '# Testing Strategy for MagnetarEidolon' },
  { path: 'BLOCKERS.md', header: '# Blockers for MagnetarEidolon' },
  { path: 'BRANCHING_MODEL.md', header: '# Branching Model of MagnetarEidolon' },
  { path: 'WIP_GUIDELINES.md', header: '# Work-In-Progress (WIP) Guidelines for MagnetarEidolon' },
  { path: 'CONTRIBUTING.md', header: '# Contributing to MagnetarEidolon' },
  { path: 'projects/_template.project.yml', header: '# Project Schema for MagnetarEidolon' },
];

function formatError(relativePath, message) {
  return `${relativePath}: ${message}`;
}

export async function validateRequiredDocs(documents = REQUIRED_DOCS, repoRoot = REPO_ROOT) {
  const errors = [];

  for (const document of documents) {
    const absolutePath = path.join(repoRoot, document.path);

    try {
      const source = await fs.readFile(absolutePath, 'utf8');
      const firstNonEmptyLine = source
        .split(/\r?\n/u)
        .map((line) => line.trim())
        .find((line) => line.length > 0);

      if (!firstNonEmptyLine) {
        errors.push(formatError(document.path, 'file is empty.'));
        continue;
      }

      if (!firstNonEmptyLine.startsWith(document.header)) {
        errors.push(
          formatError(
            document.path,
            `expected first non-empty line to start with "${document.header}" but found "${firstNonEmptyLine}".`,
          ),
        );
      }
    } catch (error) {
      const message = error instanceof Error && 'code' in error && error.code === 'ENOENT'
        ? 'required file is missing.'
        : `unable to read file: ${error instanceof Error ? error.message : String(error)}.`;
      errors.push(formatError(document.path, message));
    }
  }

  return errors;
}

export async function run() {
  const errors = await validateRequiredDocs();

  if (errors.length > 0) {
    for (const error of errors) {
      console.error(`ERROR: ${error}`);
    }

    throw new Error(`Required documentation validation failed for ${errors.length} file(s).`);
  }

  console.log(`Validated ${REQUIRED_DOCS.length} required documentation files successfully.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  run().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
