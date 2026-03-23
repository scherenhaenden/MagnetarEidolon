import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiBadgeComponent, BadgeStatus } from '../../ui/badge.component.js';
import { UiIconComponent } from '../../ui/icon.component.js';
import { MOCK_AGENTS, MOCK_RUNS, Agent, Run } from '../../ui/mock-data.js';

@Component({
  selector: 'screen-dashboard',
  standalone: true,
  imports: [CommonModule, UiIconComponent, UiBadgeComponent],
  templateUrl: './dashboard-screen.component.html',
})
export class DashboardScreen {
  public readonly agents: Agent[] = MOCK_AGENTS;
  public readonly runs: Run[] = MOCK_RUNS;

  public getRunStatus(run: Run): BadgeStatus {
    switch (run.status) {
      case 'success':
        return 'success';
      case 'failed':
        return 'failed';
      case 'pending_approval':
        return 'pending_approval';
      default:
        console.warn(`Unexpected run status encountered: ${run.status}`);
        return 'default';
    }
  }
}
