import assert from 'node:assert/strict';
import test from 'node:test';

import { validateProjectDocument } from './validate-project-schema.mjs';

const validProject = {
  metadata: {
    project_name: 'Valid Project',
    description: 'A valid project definition.',
    version: '1.2.3',
    start_date: '2026-03-20',
    repository: 'https://github.com/example/repo',
  },
  stakeholders: [
    {
      name: 'Core Team',
      role: 'Maintainers',
    },
  ],
  milestones: [
    {
      id: 'ms-01',
      name: 'Baseline',
      target_date: '2026-04-01',
      status: 'planned',
    },
  ],
  tasks: [
    {
      id: 'task-01',
      milestone_id: 'ms-01',
      title: 'Ship baseline',
      owner: 'Core Team',
      status: 'in_progress',
    },
  ],
  risks: [
    {
      id: 'risk-01',
      description: 'Schema drift',
      impact: 'high',
      mitigation: 'Automated validation',
    },
  ],
  reporting: {
    frequency: 'Weekly',
    format: 'Markdown via STATUS.md',
  },
};

test('validateProjectDocument accepts a valid project shape', () => {
  const errors = validateProjectDocument(validProject, '/tmp/valid.project.yml');
  assert.deepEqual(errors, []);
});

test('validateProjectDocument reports missing keys and invalid workflow states', () => {
  const invalidProject = {
    ...validProject,
    metadata: {
      ...validProject.metadata,
      version: 'v1',
    },
    tasks: [
      {
        id: 'task-01',
        title: '',
        owner: 'Core Team',
        status: 'active',
      },
    ],
  };

  delete invalidProject.reporting;

  const errors = validateProjectDocument(invalidProject, '/tmp/invalid.project.yml');

  assert.match(errors.join('\n'), /Missing required top-level key: reporting/);
  assert.match(errors.join('\n'), /metadata\.version must look like a semantic version/);
  assert.match(errors.join('\n'), /tasks\[0\]\.title must be a non-empty string/);
  assert.match(errors.join('\n'), /tasks\[0\]\.status must be one of/);
});
