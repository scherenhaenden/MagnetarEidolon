import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiBadgeComponent } from '../../ui/badge.component.js';
import { UiIconComponent } from '../../ui/icon.component.js';

@Component({
  selector: 'screen-live-run',
  standalone: true,
  imports: [CommonModule, UiIconComponent, UiBadgeComponent],
  templateUrl: './live-run-screen.component.html',
})
export class LiveRunScreen {}
