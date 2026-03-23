import type { BadgeStatus } from './badge.component.js';
import type { Policy, PolicyRiskLevel } from './mock-data.js';

export class PolicyPresentation {
  public getPolicyStatusBadge(status: Policy['status']): BadgeStatus {
    return status === 'active' ? 'active' : 'idle';
  }

  public getRiskColor(riskLevel: PolicyRiskLevel): string {
    switch (riskLevel) {
      case 'Critical':
        return 'text-red-400';
      case 'High':
        return 'text-amber-400';
      case 'Medium':
        return 'text-blue-400';
      case 'Low':
        return 'text-emerald-400';
      default:
        return 'text-zinc-400';
    }
  }
}
