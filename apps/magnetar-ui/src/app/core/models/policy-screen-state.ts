import { computed, signal, type Signal, type WritableSignal } from '@angular/core';

import { Policy } from '../../ui/mock-data.js';

export class PolicyScreenState {
  public readonly policies: WritableSignal<Policy[]>;
  public readonly selectedPolicyId: WritableSignal<string | null> = signal<string | null>(null);
  public readonly draftPolicy: WritableSignal<Policy | null> = signal<Policy | null>(null);
  public readonly selectedPolicy: Signal<Policy | null>;
  public readonly hasUnsavedChanges: Signal<boolean>;

  public constructor(policies: Policy[]) {
    this.policies = signal<Policy[]>(policies.map((policy) => this.clonePolicy(policy)));
    this.selectedPolicy = computed(() => {
      const selectedPolicyId = this.selectedPolicyId();
      if (!selectedPolicyId) {
        return null;
      }

      return this.policies().find((policy) => policy.id === selectedPolicyId) ?? null;
    });
    this.hasUnsavedChanges = computed(() => {
      const selectedPolicy = this.selectedPolicy();
      const draftPolicy = this.draftPolicy();
      if (!selectedPolicy || !draftPolicy) {
        return false;
      }

      return (
        selectedPolicy.name !== draftPolicy.name ||
        selectedPolicy.description !== draftPolicy.description ||
        selectedPolicy.riskLevel !== draftPolicy.riskLevel ||
        selectedPolicy.action !== draftPolicy.action
      );
    });
  }

  public selectPolicy(policyId: string): void {
    if (this.selectedPolicyId() === policyId) {
      return;
    }

    const policy = this.policies().find((candidate) => candidate.id === policyId);
    if (!policy) {
      return;
    }

    this.selectedPolicyId.set(policy.id);
    this.draftPolicy.set(this.clonePolicy(policy));
  }

  public closeDetails(): void {
    this.selectedPolicyId.set(null);
    this.draftPolicy.set(null);
  }

  public updateDraftName(name: string): void {
    this.patchDraft({ name });
  }

  public updateDraftDescription(description: string): void {
    this.patchDraft({ description });
  }

  public updateDraftRiskLevel(riskLevel: Policy['riskLevel']): void {
    this.patchDraft({ riskLevel });
  }

  public updateDraftAction(action: Policy['action']): void {
    this.patchDraft({ action });
  }

  public saveChanges(): void {
    const selectedPolicy = this.selectedPolicy();
    const draftPolicy = this.draftPolicy();
    if (!selectedPolicy || !draftPolicy) {
      return;
    }

    this.policies.update((policies) =>
      policies.map((policy) => (policy.id === selectedPolicy.id ? this.clonePolicy(draftPolicy) : policy)),
    );
    this.draftPolicy.set(this.clonePolicy(draftPolicy));
  }

  public cancelChanges(): void {
    const selectedPolicy = this.selectedPolicy();
    if (!selectedPolicy) {
      return;
    }

    this.draftPolicy.set(this.clonePolicy(selectedPolicy));
  }

  private patchDraft(patch: Partial<Policy>): void {
    this.draftPolicy.update((draftPolicy) => (draftPolicy ? { ...draftPolicy, ...patch } : draftPolicy));
  }

  private clonePolicy(policy: Policy): Policy {
    return {
      ...policy,
      tags: [...policy.tags],
    };
  }
}
