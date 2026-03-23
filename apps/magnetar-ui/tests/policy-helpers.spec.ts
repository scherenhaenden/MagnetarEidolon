import { describe, expect, it } from 'vitest';

import { getPolicyStatusBadge, getRiskColor } from '../src/app/ui/policy-helpers.js';
import type { PolicyRiskLevel } from '../src/app/ui/mock-data.js';

describe('getPolicyStatusBadge', () => {
  it('maps an active policy status to the active badge variant', () => {
    expect(getPolicyStatusBadge('active')).toBe('active');
  });

  it('maps a disabled policy status to the idle badge variant', () => {
    expect(getPolicyStatusBadge('disabled')).toBe('idle');
  });
});

describe('getRiskColor', () => {
  it.each<[PolicyRiskLevel, string]>([
    ['Critical', 'text-red-400'],
    ['High', 'text-amber-400'],
    ['Medium', 'text-blue-400'],
    ['Low', 'text-emerald-400'],
  ])('maps %s risk level to CSS class %s', (riskLevel, expected) => {
    expect(getRiskColor(riskLevel)).toBe(expected);
  });

  it('returns the zinc fallback class for an unrecognised risk level', () => {
    expect(getRiskColor('Unknown' as PolicyRiskLevel)).toBe('text-zinc-400');
  });
});
