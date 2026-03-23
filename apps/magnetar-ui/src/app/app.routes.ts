import { Routes } from '@angular/router';

import { DashboardScreen } from './screens/dashboard/dashboard-screen.component.js';
import { LiveRunScreen } from './screens/live-run/live-run-screen.component.js';
import { ChatScreen } from './screens/chat/chat-screen.component.js';
import { BuilderScreen } from './screens/builder/builder-screen.component.js';
import { ToolsScreen } from './screens/tools/tools-screen.component.js';
import { MemoryScreen } from './screens/memory/memory-screen.component.js';
import { ProvidersScreen } from './screens/providers/providers-screen.component.js';
import { PolicyScreen } from './screens/policy/policy-screen.component.js';

export const APP_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardScreen, title: 'MagnetarEidolon · Dashboard' },
  { path: 'liverun', component: LiveRunScreen, title: 'MagnetarEidolon · Live Run' },
  { path: 'chat', component: ChatScreen, title: 'MagnetarEidolon · Chat' },
  { path: 'builder', component: BuilderScreen, title: 'MagnetarEidolon · Builder' },
  { path: 'tools', component: ToolsScreen, title: 'MagnetarEidolon · Catalog' },
  { path: 'memory', component: MemoryScreen, title: 'MagnetarEidolon · Memory' },
  { path: 'providers', component: ProvidersScreen, title: 'MagnetarEidolon · Providers' },
  { path: 'policy', component: PolicyScreen, title: 'MagnetarEidolon · Policies' },
  { path: '**', redirectTo: 'dashboard' },
];
