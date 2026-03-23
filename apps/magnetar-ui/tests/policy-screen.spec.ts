import { describe, expect, it } from 'vitest';

import { PolicyScreenState } from '../src/app/core/models/policy-screen-state.js';
import { MOCK_POLICIES } from '../src/app/ui/mock-data.js';

describe('PolicyScreen', () => {
  it('creates a draft copy when selecting a policy without mutating the source state', () => {
    const screen = new PolicyScreenState(MOCK_POLICIES);

    screen.selectPolicy('pol-01');

    expect(screen.selectedPolicy()?.id).toBe('pol-01');
    expect(screen.draftPolicy()).toMatchObject({
      id: 'pol-01',
      name: 'Prevent File Deletion',
    });

    screen.updateDraftName('Prevent Production File Deletion');

    expect(screen.draftPolicy()?.name).toBe('Prevent Production File Deletion');
    expect(screen.selectedPolicy()?.name).toBe('Prevent File Deletion');
    expect(screen.hasUnsavedChanges()).toBe(true);
  });

  it('commits draft updates back into the local policy collection on save', () => {
    const screen = new PolicyScreenState(MOCK_POLICIES);

    screen.selectPolicy('pol-02');
    screen.updateDraftDescription('SELECT-only queries remain auto-approved in the local PoC.');
    screen.updateDraftAction('Require Review');

    screen.saveChanges();

    expect(screen.selectedPolicy()).toMatchObject({
      id: 'pol-02',
      description: 'SELECT-only queries remain auto-approved in the local PoC.',
      action: 'Require Review',
    });
    expect(screen.draftPolicy()).toMatchObject({
      id: 'pol-02',
      description: 'SELECT-only queries remain auto-approved in the local PoC.',
      action: 'Require Review',
    });
    expect(screen.hasUnsavedChanges()).toBe(false);
  });

  it('restores the original selected policy values on cancel', () => {
    const screen = new PolicyScreenState(MOCK_POLICIES);

    screen.selectPolicy('pol-03');
    screen.updateDraftRiskLevel('Critical');
    screen.updateDraftAction('Simulate');

    expect(screen.hasUnsavedChanges()).toBe(true);

    screen.cancelChanges();

    expect(screen.draftPolicy()).toMatchObject({
      id: 'pol-03',
      riskLevel: 'High',
      action: 'Block',
    });
    expect(screen.selectedPolicy()).toMatchObject({
      id: 'pol-03',
      riskLevel: 'High',
      action: 'Block',
    });
    expect(screen.hasUnsavedChanges()).toBe(false);
  });

  it('clears the detail panel state when closed', () => {
    const screen = new PolicyScreenState(MOCK_POLICIES);

    screen.selectPolicy('pol-04');
    screen.closeDetails();

    expect(screen.selectedPolicy()).toBeNull();
    expect(screen.draftPolicy()).toBeNull();
    expect(screen.selectedPolicyId()).toBeNull();
  });

  it('keeps state unchanged when selection or edit actions are invoked without a valid selected policy', () => {
    const screen = new PolicyScreenState(MOCK_POLICIES);
    const originalPolicies = screen.policies();

    expect(screen.hasUnsavedChanges()).toBe(false);

    screen.selectPolicy('missing-policy');
    screen.updateDraftName('No-op name');
    screen.updateDraftDescription('No-op description');
    screen.updateDraftRiskLevel('Critical');
    screen.updateDraftAction('Block');
    screen.saveChanges();
    screen.cancelChanges();

    expect(screen.selectedPolicy()).toBeNull();
    expect(screen.draftPolicy()).toBeNull();
    expect(screen.selectedPolicyId()).toBeNull();
    expect(screen.hasUnsavedChanges()).toBe(false);
    expect(screen.policies()).toEqual(originalPolicies);
  });

  it('treats a stale selected policy id as no active selection', () => {
    const screen = new PolicyScreenState(MOCK_POLICIES);

    screen.selectedPolicyId.set('stale-policy-id');

    expect(screen.selectedPolicy()).toBeNull();
    expect(screen.hasUnsavedChanges()).toBe(false);
  });
});
