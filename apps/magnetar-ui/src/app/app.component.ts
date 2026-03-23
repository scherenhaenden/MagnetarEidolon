import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { UiIconComponent } from './ui/icon.component.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    UiIconComponent,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  public readonly tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'home', route: '/dashboard' },
    { id: 'liverun', label: 'Live Run', icon: 'activity', route: '/liverun' },
    { id: 'chat', label: 'Chat', icon: 'message-square', route: '/chat' },
    { id: 'builder', label: 'Builder', icon: 'git-branch', route: '/builder' },
    { id: 'tools', label: 'Catalog', icon: 'wrench', route: '/tools' },
    { id: 'memory', label: 'Memory', icon: 'database', route: '/memory' },
    { id: 'providers', label: 'Providers', icon: 'server', route: '/providers' },
    { id: 'policy', label: 'Policies', icon: 'shield', route: '/policy' },
  ];
}
