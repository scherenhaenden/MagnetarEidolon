import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

export type BadgeStatus =
  | 'active'
  | 'success'
  | 'idle'
  | 'failed'
  | 'pending_approval'
  | 'default';

@Component({
  selector: 'ui-badge',
  standalone: true,
  imports: [NgClass],
  template: `
    <span
      class="px-2 py-0.5 text-xs font-medium rounded-full border flex items-center gap-1.5 w-fit"
      [ngClass]="colorClasses[status] || colorClasses.default">
      <ng-content></ng-content>
    </span>
  `,
})
export class UiBadgeComponent {
  @Input() public status: BadgeStatus = 'default';

  public readonly colorClasses: Record<BadgeStatus, string> = {
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    idle: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
    failed: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    pending_approval:
      'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.2)]',
    default: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  };
}
