import { describe, expect, it } from 'vitest';

import { ICONS } from '../src/app/ui/icons.js';
import { MOCK_AGENTS, MOCK_RUNS, MOCK_TOOLS } from '../src/app/ui/mock-data.js';

describe('UI mock data', () => {
  it('exposes representative agents, runs, and tools for the shell screens', () => {
    expect(MOCK_AGENTS).toHaveLength(3);
    expect(MOCK_AGENTS.map((agent) => agent.status)).toEqual(['active', 'idle', 'active']);
    expect(MOCK_AGENTS.map((agent) => agent.type)).toEqual(['Orchestrator', 'Reviewer', 'Operations']);

    expect(MOCK_RUNS).toHaveLength(3);
    expect(MOCK_RUNS.map((run) => run.status)).toEqual(['success', 'pending_approval', 'failed']);

    expect(MOCK_TOOLS).toHaveLength(23);
    expect(new Set(MOCK_TOOLS.map((tool) => tool.category))).toEqual(
      new Set(['Databases', 'Infrastructure', 'VCS', 'APIs', 'Automation']),
    );
    expect(new Set(MOCK_TOOLS.map((tool) => tool.trust))).toEqual(
      new Set(['Low', 'Medium', 'High', 'Critical']),
    );
    expect(new Set(MOCK_TOOLS.map((tool) => tool.status))).toEqual(
      new Set(['connected', 'requires_auth', 'disconnected']),
    );
  });

  it('maps every mock tool icon to a registered icon glyph', () => {
    for (const tool of MOCK_TOOLS) {
      expect(ICONS[tool.icon]).toBeTypeOf('string');
      expect(ICONS[tool.icon].length).toBeGreaterThan(0);
    }
  });
});

describe('ICONS registry', () => {
  it('contains all recently added icon names used across the mock catalog and shell', () => {
    expect(ICONS['plus-circle']).toBeTypeOf('string');
    expect(ICONS.cloud).toBeTypeOf('string');
    expect(ICONS.mail).toBeTypeOf('string');
    expect(ICONS.lock).toBeTypeOf('string');
    expect(ICONS.box).toBeTypeOf('string');
    expect(ICONS.monitor).toBeTypeOf('string');
    expect(ICONS['file-text']).toBeTypeOf('string');
    expect(ICONS.zap).toBeTypeOf('string');
    expect(ICONS.bell).toBeTypeOf('string');
  });
});
