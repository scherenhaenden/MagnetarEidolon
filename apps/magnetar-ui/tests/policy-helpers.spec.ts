import { describe, expect, it } from 'vitest';

import { PolicyPresentation } from '../src/app/ui/policy-helpers.js';
import type { PolicyRiskLevel } from '../src/app/ui/mock-data.js';

describe('PolicyPresentation', () => {
  const presentation = new PolicyPresentation();

  it('maps an active policy status to the active badge variant', () => {
    expect(presentation.getPolicyStatusBadge('active')).toBe('active');
  });

  it('maps a disabled policy status to the idle badge variant', () => {
    expect(presentation.getPolicyStatusBadge('disabled')).toBe('idle');
  });

  it.each<[PolicyRiskLevel, string]>([
    ['Critical', 'text-red-400'],
    ['High', 'text-amber-400'],
    ['Medium', 'text-blue-400'],
    ['Low', 'text-emerald-400'],
  ])('maps %s risk level to CSS class %s', (riskLevel, expected) => {
    expect(presentation.getRiskColor(riskLevel)).toBe(expected);
  });

  it('returns the zinc fallback class for an unrecognised risk level', () => {
    expect(presentation.getRiskColor('Unknown' as PolicyRiskLevel)).toBe('text-zinc-400');
  });
});
