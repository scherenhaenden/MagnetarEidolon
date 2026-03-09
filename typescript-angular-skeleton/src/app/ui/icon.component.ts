import { Component, Input } from '@angular/core';

import { ICONS } from './icons';

@Component({
  selector: 'ui-icon',
  standalone: true,
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      [class]="cssClass">
      <path [attr.d]="path"></path>
    </svg>
  `,
})
export class UiIconComponent {
  @Input() public name = '';
  @Input() public size = 20;
  @Input() public cssClass = '';

  public get path(): string {
    return ICONS[this.name] || ICONS.activity;
  }
}
