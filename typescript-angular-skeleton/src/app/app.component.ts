import { Component } from '@angular/core';
import { ProjectContextService } from './core/services/project-context.service.js';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  public readonly title = 'Magnetar Angular Skeleton';
  public readonly descriptor: string;

  constructor(private readonly projectContextService: ProjectContextService) {
    this.descriptor = this.projectContextService.getDescriptor().describe();
  }
}
