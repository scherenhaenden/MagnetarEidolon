import { Routes } from '@angular/router';

import {
  BuilderScreen,
  ChatScreen,
  DashboardScreen,
  LiveRunScreen,
  MemoryScreen,
  PolicyScreen,
  ProvidersScreen,
  ToolsScreen,
} from './app.component.js';

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
