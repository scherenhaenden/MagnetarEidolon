import { Component, ViewEncapsulation, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UiBadgeComponent, BadgeStatus } from './ui/badge.component';
import { UiIconComponent } from './ui/icon.component';
import { MOCK_AGENTS, MOCK_RUNS, MOCK_TOOLS, Agent, Run, Tool } from './ui/mock-data';

@Component({
  selector: 'screen-dashboard',
  standalone: true,
  imports: [CommonModule, UiIconComponent, UiBadgeComponent],
  template: `
    <div class="space-y-8 animate-fade-in pb-12">
      <!-- ... (keeping existing template as is) ... -->
      <div class="relative group">
        <div class="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-violet-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
        <div class="relative bg-[#0d0d12]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
          <div class="flex items-center gap-3 text-cyan-400 font-medium tracking-wide text-sm">
            <ui-icon name="command" [size]="16"></ui-icon>
            AEGIS COMMAND
          </div>
          <input
            type="text"
            placeholder="What do you want to automate today?"
            class="bg-transparent border-none text-3xl font-light text-white placeholder-zinc-600 focus:outline-none focus:ring-0 w-full" />
          <div class="flex justify-between items-center pt-4 border-t border-white/5">
            <div class="flex gap-2">
              <button class="px-3 py-1.5 text-xs font-medium bg-white/5 hover:bg-white/10 text-zinc-300 rounded-md border border-white/5 transition-colors flex items-center gap-2">
                <ui-icon name="git-branch" [size]="14"></ui-icon> Load Template
              </button>
              <button class="px-3 py-1.5 text-xs font-medium bg-white/5 hover:bg-white/10 text-zinc-300 rounded-md border border-white/5 transition-colors flex items-center gap-2">
                <ui-icon name="wrench" [size]="14"></ui-icon> Attach Tools
              </button>
            </div>
            <button class="px-6 py-2 text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-900 rounded-lg shadow-[0_0_15px_rgba(56,189,248,0.4)] transition-all">
              Initialize Agent
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 rounded-xl p-5 flex flex-col justify-between h-32">
          <div class="text-zinc-400 text-sm font-medium">Active Agents</div>
          <div class="text-4xl font-light text-white">
            24 <span class="text-emerald-400 text-sm font-medium ml-2">+3 today</span>
          </div>
        </div>
        <div class="bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 rounded-xl p-5 flex flex-col justify-between h-32 relative overflow-hidden">
          <div class="absolute right-0 bottom-0 w-32 h-32 bg-violet-500/10 blur-2xl rounded-full"></div>
          <div class="text-zinc-400 text-sm font-medium relative z-10">Total Operations (24h)</div>
          <div class="text-4xl font-light text-white relative z-10">
            1.2M <span class="text-cyan-400 text-sm font-medium ml-2">99.9% SR</span>
          </div>
        </div>
        <div class="bg-gradient-to-b from-amber-500/[0.05] to-transparent border border-amber-500/20 rounded-xl p-5 flex flex-col justify-between h-32 shadow-[0_0_30px_rgba(245,158,11,0.05)]">
          <div class="text-amber-400/80 text-sm font-medium flex items-center gap-2">
            <ui-icon name="alert" [size]="16"></ui-icon> Pending Approvals
          </div>
          <div class="text-4xl font-light text-amber-400">
            3
            <button class="ml-4 text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-3 py-1 rounded border border-amber-500/30 transition-colors uppercase tracking-wider font-bold">
              Review
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-4">
          <h3 class="text-lg font-medium text-zinc-200">Recent Telemetry</h3>
          <div class="bg-[#0f0f13] border border-white/5 rounded-xl overflow-hidden">
            <table class="w-full text-left text-sm">
              <thead class="bg-black/40 border-b border-white/5 text-zinc-500">
                <tr>
                  <th class="px-4 py-3 font-medium">Run ID</th>
                  <th class="px-4 py-3 font-medium">Agent</th>
                  <th class="px-4 py-3 font-medium">Status</th>
                  <th class="px-4 py-3 font-medium">Metrics</th>
                  <th class="px-4 py-3 font-medium text-right">Time</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5 text-zinc-300">
                <tr *ngFor="let run of runs" class="hover:bg-white/[0.02] transition-colors cursor-pointer">
                  <td class="px-4 py-3 font-mono text-xs text-zinc-500">{{ run.id }}</td>
                  <td class="px-4 py-3 font-medium">{{ run.agent }}</td>
                  <td class="px-4 py-3"><ui-badge [status]="getRunStatus(run)">{{ run.status }}</ui-badge></td>
                  <td class="px-4 py-3 font-mono text-xs text-zinc-400">{{ run.tokens }} tok / {{ run.cost }}</td>
                  <td class="px-4 py-3 text-right text-zinc-500">{{ run.time }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="space-y-4">
          <h3 class="text-lg font-medium text-zinc-200">Active Fleet</h3>
          <div class="flex flex-col gap-3">
            <div *ngFor="let agent of agents" class="bg-[#0f0f13] border border-white/5 rounded-xl p-4 flex items-center justify-between hover:border-cyan-500/30 transition-colors group">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/10 transition-colors">
                  <ui-icon name="cpu" [size]="20"></ui-icon>
                </div>
                <div>
                  <div class="font-medium text-zinc-200">{{ agent.name }}</div>
                  <div class="text-xs text-zinc-500 flex items-center gap-2 mt-1">
                    <span class="w-1.5 h-1.5 rounded-full" [ngClass]="{ 'bg-emerald-500': agent.status === 'active', 'bg-zinc-600': agent.status !== 'active' }"></span>
                    {{ agent.type }}
                  </div>
                </div>
              </div>
              <ui-icon name="play" [size]="16" cssClass="text-zinc-600 group-hover:text-cyan-400 cursor-pointer"></ui-icon>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
class DashboardScreen {
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
        return 'default';
    }
  }
}

@Component({
  selector: 'screen-live-run',
  standalone: true,
  imports: [CommonModule, UiIconComponent, UiBadgeComponent],
  template: `
    <div class="h-[calc(100vh-6rem)] grid grid-cols-12 gap-6 animate-fade-in pb-6">
      <div class="col-span-3 bg-[#0a0a0d] border border-white/5 rounded-xl flex flex-col overflow-hidden relative">
        <div class="p-4 border-b border-white/5 bg-black/20 flex justify-between items-center backdrop-blur-md">
          <h3 class="font-medium text-sm text-zinc-300 flex items-center gap-2">
            <ui-icon name="git-branch" [size]="16" cssClass="text-violet-400"></ui-icon> Execution Plan
          </h3>
          <ui-badge status="active">Running</ui-badge>
        </div>
        <!-- ... (keeping existing template as is) ... -->
        <div class="flex-1 overflow-y-auto p-4 space-y-6 relative">
          <div class="absolute left-[27px] top-6 bottom-6 w-px bg-white/10 z-0"></div>
          <div class="relative z-10 flex gap-4">
            <div class="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center flex-shrink-0 mt-0.5">
              <ui-icon name="check" [size]="12" cssClass="text-emerald-400"></ui-icon>
            </div>
            <div>
              <div class="text-sm font-medium text-zinc-200">Analyze Request</div>
              <div class="text-xs text-zinc-500 mt-1">Parsed intent: Database migration prep.</div>
            </div>
          </div>
          <div class="relative z-10 flex gap-4">
            <div class="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center flex-shrink-0 mt-0.5">
              <ui-icon name="check" [size]="12" cssClass="text-emerald-400"></ui-icon>
            </div>
            <div>
              <div class="text-sm font-medium text-zinc-200">Check Schema</div>
              <div class="text-xs text-zinc-500 mt-1">Invoked Postgres tool. Retrieved 4 tables.</div>
            </div>
          </div>
          <div class="relative z-10 flex gap-4">
            <div class="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center flex-shrink-0 mt-0.5 animate-pulse shadow-[0_0_10px_rgba(56,189,248,0.5)]">
              <div class="w-2 h-2 rounded-full bg-cyan-400"></div>
            </div>
            <div>
              <div class="text-sm font-medium text-cyan-400">Generate Migration Script</div>
              <div class="text-xs text-zinc-500 mt-1">Synthesizing SQL dialect...</div>
            </div>
          </div>
          <div class="relative z-10 flex gap-4 opacity-40">
            <div class="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0 mt-0.5"></div>
            <div>
              <div class="text-sm font-medium text-zinc-400">Human Approval</div>
              <div class="text-xs text-zinc-500 mt-1">Awaiting policy gate.</div>
            </div>
          </div>
        </div>
      </div>
      <!-- ... (keeping rest of template as is) ... -->
      <div class="col-span-6 bg-[#0a0a0d] border border-white/5 rounded-xl flex flex-col relative overflow-hidden shadow-2xl">
        <div class="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
        <div class="p-4 border-b border-white/5 flex justify-between items-center bg-black/40">
          <div class="flex items-center gap-3">
            <div class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
            <span class="font-mono text-xs text-cyan-400 tracking-wider">LIVE STREAM</span>
          </div>
          <div class="text-xs font-mono text-zinc-500">RUN-ID: 992a-44f1</div>
        </div>
        <div class="flex-1 overflow-y-auto p-6 space-y-6 font-mono text-sm leading-relaxed">
          <div class="bg-white/5 border border-white/10 rounded-lg p-4 text-zinc-300">
            <div class="text-xs text-zinc-500 mb-2 font-sans uppercase tracking-wider">User Input</div>
            "Prepare a migration script to add a 'last_login' timestamp to the users table, and create an index on it."
          </div>
          <div class="pl-4 border-l-2 border-emerald-500/30 text-zinc-400">
            [System]: Evaluating required tools...
            <br />[System]: Selected tool <span class="text-emerald-400">Postgres Prod (RO)</span>
          </div>
          <div class="bg-[#050508] border border-zinc-800 rounded-lg p-4 font-mono text-xs text-emerald-300 shadow-inner">
            <div class="text-zinc-600 mb-2 border-b border-zinc-800 pb-2">Tool Output: schema_users</div>
            CREATE TABLE users (<br />
            &nbsp;&nbsp;id uuid PRIMARY KEY,<br />
            &nbsp;&nbsp;email text UNIQUE NOT NULL,<br />
            &nbsp;&nbsp;created_at timestamptz DEFAULT now()<br />
            );
          </div>
          <div class="pl-4 border-l-2 border-cyan-500/50 text-zinc-200">
            Based on the current schema, here is the requested migration script. I will use PostgreSQL syntax.
            <div class="mt-4 bg-[#050508] border border-cyan-500/20 rounded-lg p-4 text-cyan-100 font-mono text-sm relative group cursor-text">
              <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button class="bg-white/10 hover:bg-white/20 px-2 py-1 rounded text-xs text-white">Copy</button>
              </div>
              <span class="text-violet-400">ALTER TABLE</span> users<br />
              <span class="text-violet-400">ADD COLUMN</span> last_login <span class="text-emerald-400">timestamptz</span>;<br /><br />
              <span class="text-violet-400">CREATE INDEX</span> idx_users_last_login <br />
              <span class="text-violet-400">ON</span> users(last_login);
            </div>
            <span class="inline-block w-2 h-4 bg-cyan-400 animate-pulse mt-2 align-middle"></span>
          </div>
        </div>
      </div>

      <div class="col-span-3 flex flex-col gap-6">
        <div class="bg-[#0a0a0d] border border-white/5 rounded-xl flex-1 flex flex-col overflow-hidden">
          <div class="p-3 border-b border-white/5 bg-black/20 text-xs font-medium text-zinc-400 uppercase tracking-wider">Context & Memory</div>
          <div class="p-4 space-y-4">
            <div class="bg-white/5 rounded-lg p-3 border border-white/5">
              <div class="flex items-center gap-2 text-xs text-violet-400 font-medium mb-1">
                <ui-icon name="database" [size]="14"></ui-icon> Session Memory
              </div>
              <div class="text-xs text-zinc-400 leading-snug">
                Remembered user preference: "Always use PostgreSQL syntax unless specified otherwise." (Confidence: 0.98)
              </div>
            </div>
            <div class="bg-white/5 rounded-lg p-3 border border-white/5">
              <div class="flex items-center gap-2 text-xs text-cyan-400 font-medium mb-1">
                <ui-icon name="wrench" [size]="14"></ui-icon> Active Tools
              </div>
              <div class="flex flex-wrap gap-2 mt-2">
                <span class="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-zinc-300">Postgres (RO)</span>
                <span class="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-zinc-300">File Writer</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 relative overflow-hidden shadow-[0_0_20px_rgba(245,158,11,0.15)]">
          <div class="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 blur-3xl rounded-full"></div>
          <div class="relative z-10">
            <div class="flex items-center gap-2 text-amber-400 font-medium text-sm mb-2">
              <ui-icon name="shield" [size]="16"></ui-icon> Action Requires Approval
            </div>
            <p class="text-xs text-amber-200/80 mb-4 leading-relaxed">
              Agent is attempting to execute
              <span class="font-mono text-amber-300 bg-black/30 px-1 rounded">fs.writeFile</span>
              outside of the temporary workspace. Policy "SecureFS" requires human review.
            </p>
            <div class="flex flex-col gap-2">
              <button class="w-full py-2 bg-amber-500 hover:bg-amber-400 text-amber-950 text-xs font-bold rounded shadow-lg transition-colors">Approve Once</button>
              <div class="grid grid-cols-2 gap-2">
                <button class="py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-xs font-medium rounded transition-colors">Deny</button>
                <button class="py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-xs font-medium rounded transition-colors">Simulate</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
class LiveRunScreen {}

@Component({
  selector: 'screen-builder',
  standalone: true,
  imports: [CommonModule, UiIconComponent],
  template: `
    <div class="h-[calc(100vh-6rem)] grid grid-cols-4 gap-0 border border-white/5 rounded-xl overflow-hidden animate-fade-in shadow-2xl bg-[#08080a]">
      <!-- ... (keeping existing template as is) ... -->
      <div class="col-span-3 relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/[0.03] to-transparent">
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')]"></div>
        <div class="absolute top-4 left-4 bg-[#121216] border border-white/10 rounded-lg p-1.5 flex gap-1 z-20 shadow-lg backdrop-blur-md">
          <button class="px-3 py-1.5 bg-white/10 rounded text-xs font-medium text-white shadow-sm">Visual</button>
          <button class="px-3 py-1.5 hover:bg-white/5 rounded text-xs font-medium text-zinc-400 transition-colors">YAML</button>
        </div>
        <div class="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"></div>
      </div>
      <div class="col-span-1 border-l border-white/5 bg-[#0a0a0d] flex flex-col h-full">
        <div class="p-4 border-b border-white/5 flex items-center gap-3 bg-white/[0.02]">
          <div class="w-8 h-8 rounded bg-white/10 flex items-center justify-center">
            <ui-icon name="cpu" [size]="16" cssClass="text-white"></ui-icon>
          </div>
          <div>
            <div class="text-sm font-medium text-zinc-200">System Prompt Node</div>
            <div class="text-xs text-zinc-500">ID: node_a7x9</div>
          </div>
        </div>
      </div>
    </div>
  `,
})
class BuilderScreen {}

@Component({
  selector: 'screen-tools',
  standalone: true,
  imports: [CommonModule, UiIconComponent, UiBadgeComponent],
  template: `
    <div class="space-y-6 animate-fade-in pb-12">
      <div class="flex justify-between items-end">
        <div>
          <h2 class="text-2xl font-light text-white tracking-tight">Tool Catalog</h2>
          <p class="text-sm text-zinc-400 mt-1">Discover, configure, and govern capabilities for your agents.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div *ngFor="let tool of tools" class="bg-[#0f0f13] border border-white/5 rounded-xl p-5 hover:border-white/20 transition-all hover:shadow-xl group relative overflow-hidden flex flex-col h-48">
          <div class="flex justify-between items-start mb-4 relative z-10">
            <div class="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-300">
              <ui-icon [name]="tool.icon" [size]="20"></ui-icon>
            </div>
            <ui-badge [status]="getToolStatusBadge(tool)">{{ tool.status }}</ui-badge>
          </div>
          <div class="relative z-10 flex-1">
            <h3 class="font-medium text-zinc-200 text-base group-hover:text-white transition-colors">{{ tool.name }}</h3>
            <p class="text-xs text-zinc-500 mt-1">{{ tool.category }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
})
class ToolsScreen {
  public readonly tools: Tool[] = MOCK_TOOLS;

  public getToolStatusBadge(tool: Tool): BadgeStatus {
    return tool.status === 'connected' ? 'active' : 'idle';
  }
}

@Component({
  selector: 'screen-policy',
  standalone: true,
  imports: [CommonModule, UiIconComponent],
  template: `
    <div class="space-y-6 animate-fade-in max-w-5xl mx-auto pb-12">
      <div class="flex justify-between items-center bg-gradient-to-r from-violet-500/10 to-transparent p-6 rounded-2xl border border-violet-500/20">
        <div>
          <h2 class="text-2xl font-light text-white tracking-tight flex items-center gap-3">
            <ui-icon name="shield" cssClass="text-violet-400" [size]="28"></ui-icon> Governance & Policy
          </h2>
        </div>
      </div>
    </div>
  `,
})
class PolicyScreen {}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    UiIconComponent,
    DashboardScreen,
    LiveRunScreen,
    BuilderScreen,
    ToolsScreen,
    PolicyScreen,
  ],
  template: `
    <div class="min-h-screen bg-[#050505] text-zinc-300 font-sans flex flex-col selection:bg-cyan-500/30 selection:text-cyan-100 relative overflow-hidden">
      <header class="h-14 border-b border-white/5 bg-[#0a0a0d]/80 backdrop-blur-md flex items-center justify-between px-4 z-50 sticky top-0">
        <div class="flex items-center gap-8">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.3)]">
              <div class="w-3 h-3 bg-[#050505] rounded-full"></div>
            </div>
            <span class="font-bold text-lg tracking-tight text-white shadow-sm">MAGNETAR<span class="font-light text-zinc-400 ml-1">AEGIS</span></span>
          </div>
          <nav class="hidden md:flex gap-1 bg-white/[0.03] p-1 rounded-lg border border-white/5">
            <ng-container *ngFor="let tab of tabs">
              <button
                (click)="activeTab.set(tab.id)"
                [ngClass]="activeTab() === tab.id ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'"
                class="px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2">
                <ui-icon [name]="tab.icon" [size]="14"></ui-icon>
                {{ tab.label }}
              </button>
            </ng-container>
          </nav>
        </div>
      </header>

      <main class="flex-1 overflow-auto p-6 relative z-10 custom-scrollbar">
        @if (activeTab() === 'dashboard') {
          <screen-dashboard></screen-dashboard>
        } @else if (activeTab() === 'liverun') {
          <screen-live-run></screen-live-run>
        } @else if (activeTab() === 'builder') {
          <screen-builder></screen-builder>
        } @else if (activeTab() === 'tools') {
          <screen-tools></screen-tools>
        } @else if (activeTab() === 'policy') {
          <screen-policy></screen-policy>
        }
      </main>
    </div>
  `,
  styles: [
    `
      .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.2);
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .animate-fade-in {
        animation: fadeIn 0.4s ease-out forwards;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  public readonly tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'home' },
    { id: 'liverun', label: 'Live Run', icon: 'activity' },
    { id: 'builder', label: 'Builder', icon: 'git-branch' },
    { id: 'tools', label: 'Catalog', icon: 'wrench' },
    { id: 'memory', label: 'Memory', icon: 'database' },
    { id: 'policy', label: 'Policies', icon: 'shield' },
  ];

  public readonly activeTab = signal('dashboard');

  public readonly activeTabLabel = computed(
    () => this.tabs.find((tab) => tab.id === this.activeTab())?.label || '',
  );

  public readonly activeTabIcon = computed(
    () => this.tabs.find((tab) => tab.id === this.activeTab())?.icon || 'activity',
  );
}
