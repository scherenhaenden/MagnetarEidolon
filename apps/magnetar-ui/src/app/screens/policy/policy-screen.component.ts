import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiBadgeComponent, BadgeStatus } from '../../ui/badge.component.js';
import { UiIconComponent } from '../../ui/icon.component.js';
import { MOCK_POLICIES, Policy } from '../../ui/mock-data.js';
import { PolicyPresentation } from '../../ui/policy-helpers.js';
import { PolicyScreenState } from '../../core/models/policy-screen-state.js';

@Component({
  selector: 'screen-policy',
  standalone: true,
  imports: [CommonModule, UiIconComponent, UiBadgeComponent],
  templateUrl: './policy-screen.component.html',
})
export class PolicyScreen {
  private readonly state = new PolicyScreenState(MOCK_POLICIES);
  private readonly presentation = new PolicyPresentation();
  public readonly policies = this.state.policies;
  public readonly selectedPolicyId = this.state.selectedPolicyId;
  public readonly draftPolicy = this.state.draftPolicy;
  public readonly selectedPolicy = this.state.selectedPolicy;
  public readonly hasUnsavedChanges = this.state.hasUnsavedChanges;

  public selectPolicy(policyId: string): void {
    this.state.selectPolicy(policyId);
  }

  public closeDetails(): void {
    this.state.closeDetails();
  }

  public updateDraftName(name: string): void {
    this.state.updateDraftName(name);
  }

  public handleNameInput(event: Event): void {
    this.updateDraftName(this.readInputValue(event));
  }

  public updateDraftDescription(description: string): void {
    this.state.updateDraftDescription(description);
  }

  public handleDescriptionInput(event: Event): void {
    this.updateDraftDescription(this.readInputValue(event));
  }

  public updateDraftRiskLevel(riskLevel: Policy['riskLevel']): void {
    this.state.updateDraftRiskLevel(riskLevel);
  }

  public handleRiskLevelChange(event: Event): void {
    this.updateDraftRiskLevel(this.readSelectValue(event) as Policy['riskLevel']);
  }

  public updateDraftAction(action: Policy['action']): void {
    this.state.updateDraftAction(action);
  }

  public handleActionChange(event: Event): void {
    this.updateDraftAction(this.readSelectValue(event) as Policy['action']);
  }

  public saveChanges(): void {
    this.state.saveChanges();
  }

  public cancelChanges(): void {
    this.state.cancelChanges();
  }

  public getPolicyStatusBadge(status: Policy['status']): BadgeStatus {
    return this.presentation.getPolicyStatusBadge(status);
  }

  public getRiskColor(riskLevel: Policy['riskLevel']): string {
    return this.presentation.getRiskColor(riskLevel);
  }

  private readInputValue(event: Event): string {
    return (event.target as HTMLInputElement | HTMLTextAreaElement).value;
  }

  private readSelectValue(event: Event): string {
    return (event.target as HTMLSelectElement).value;
  }
}
