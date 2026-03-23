import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiIconComponent } from '../../ui/icon.component.js';

@Component({
  selector: 'screen-builder',
  standalone: true,
  imports: [CommonModule, UiIconComponent],
  templateUrl: './builder-screen.component.html',
})
export class BuilderScreen {}
