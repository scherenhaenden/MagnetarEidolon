import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiBadgeComponent, BadgeStatus } from '../../ui/badge.component.js';
import { UiIconComponent } from '../../ui/icon.component.js';
import { MOCK_TOOLS, Tool } from '../../ui/mock-data.js';

@Component({
  selector: 'screen-tools',
  standalone: true,
  imports: [CommonModule, UiIconComponent, UiBadgeComponent],
  templateUrl: './tools-screen.component.html',
})
export class ToolsScreen {
  public readonly tools: Tool[] = MOCK_TOOLS;

  public getToolStatusBadge(tool: Tool): BadgeStatus {
    if (tool.status === 'connected') {
      return 'active';
    } else if (tool.status === 'requires_auth') {
      return 'pending_approval';
    } else if (tool.status === 'disconnected') {
      return 'idle';
    } else {
      console.warn(`Unexpected tool status encountered: ${tool.status}`);
      return 'default';
    }
  }
}
