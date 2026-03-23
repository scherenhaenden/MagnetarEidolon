import { describe, expect, it } from 'vitest';

import { ICONS } from '../src/app/ui/icons.js';
import { MOCK_AGENTS, MOCK_RUNS, MOCK_TOOLS, MOCK_POLICIES } from '../src/app/ui/mock-data.js';

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

  it('exposes policies covering all risk levels, actions, and statuses', () => {
    expect(MOCK_POLICIES).toHaveLength(6);
    expect(new Set(MOCK_POLICIES.map((p) => p.riskLevel))).toEqual(
      new Set(['Low', 'High', 'Critical']),
    );
    expect(new Set(MOCK_POLICIES.map((p) => p.action))).toEqual(
      new Set(['Auto-Approve', 'Require Review', 'Block', 'Simulate']),
    );
    expect(new Set(MOCK_POLICIES.map((p) => p.status))).toEqual(
      new Set(['active', 'disabled']),
    );
  });

  it('ensures every policy has a unique id, a non-empty name, and at least one tag', () => {
    const ids = MOCK_POLICIES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const policy of MOCK_POLICIES) {
      expect(policy.name.length).toBeGreaterThan(0);
      expect(policy.tags.length).toBeGreaterThan(0);
    }
  });

  it('maps every mock policy icon to a registered icon glyph', () => {
    for (const policy of MOCK_POLICIES) {
      expect(ICONS[policy.icon]).toBeTypeOf('string');
      expect(ICONS[policy.icon].length).toBeGreaterThan(0);
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
    expect(ICONS['file-minus']).toBeTypeOf('string');
    expect(ICONS.layers).toBeTypeOf('string');
  });
});
