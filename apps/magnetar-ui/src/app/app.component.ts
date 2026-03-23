import {
  AfterViewChecked,
  Component,
  computed,
  ElementRef,
  signal,
  ViewChild,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { UiBadgeComponent, BadgeStatus } from './ui/badge.component.js';
import { UiIconComponent } from './ui/icon.component.js';
import { MOCK_AGENTS, MOCK_RUNS, MOCK_TOOLS, MOCK_POLICIES, Agent, Run, Tool, Policy } from './ui/mock-data.js';
import { ChatBlock, ChatMessage } from './core/models/chat.js';
import { PolicyScreenState } from './core/models/policy-screen-state.js';
import { ProviderConfig, ProviderPreset } from './core/models/provider-config.js';
import { ChatSessionService } from './core/services/chat-session.service.js';
import { ProviderConfigService } from './core/services/provider-config.service.js';

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
            MAGNETAR EIDOLON COMMAND
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
export class DashboardScreen {
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
        console.warn(`Unexpected run status encountered: ${run.status}`);
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
export class LiveRunScreen {}

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
export class BuilderScreen {}

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

@Component({
  selector: 'screen-chat',
  standalone: true,
  imports: [CommonModule, UiIconComponent, UiBadgeComponent],
  template: `
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 animate-fade-in pb-12 xl:h-[calc(100vh-8rem)] xl:min-h-0">
      <aside class="xl:col-span-3 bg-[#0a0a0d] border border-white/5 rounded-2xl overflow-hidden flex flex-col min-h-0 xl:max-h-[calc(100vh-8rem)]">
        <div class="px-4 py-4 border-b border-white/5 bg-black/20 space-y-3">
          <div class="flex items-center justify-between gap-3">
            <div>
              <div class="text-sm font-medium text-zinc-200 flex items-center gap-2">
                <ui-icon name="message-square" [size]="16" cssClass="text-cyan-400"></ui-icon>
                Conversations
              </div>
              <p class="text-xs text-zinc-500 mt-2">
                Chat is the main UI path for provider validation and execution-oriented prompting.
              </p>
            </div>
            <button
              (click)="createNewSession()"
              class="px-3 py-2 rounded-lg border border-cyan-500/20 bg-cyan-500/10 text-xs text-cyan-100 hover:bg-cyan-500/20">
              New Chat
            </button>
          </div>
        </div>
        <div class="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          <div class="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-3 py-3">
            <div class="text-xs uppercase tracking-wider text-cyan-300">Active provider</div>
            <div class="text-sm font-medium text-cyan-100 mt-1">{{ providerConfigService.primaryProvider()?.name ?? 'Unassigned' }}</div>
          </div>
          <div
            *ngFor="let conversation of chatSessionService.conversationHistory()"
            (click)="switchToSession(conversation.id)"
            class="rounded-xl border px-3 py-3 cursor-pointer transition-colors"
            [ngClass]="isActiveSession(conversation.id)
              ? 'border-cyan-500/20 bg-cyan-500/10'
              : 'border-white/5 bg-white/[0.03] hover:bg-white/[0.05]'">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <div class="text-sm text-zinc-200 truncate">{{ conversation.title }}</div>
                <div class="text-xs text-zinc-500 mt-1 line-clamp-2">{{ conversation.preview || 'No messages yet.' }}</div>
              </div>
              <div class="flex flex-col items-end gap-2">
                <div *ngIf="isActiveSession(conversation.id)" class="text-[11px] uppercase tracking-wider text-cyan-300">
                  Active
                </div>
                <div class="flex items-center gap-1">
                  <button
                    (click)="renameSession(conversation.id, $event)"
                    class="px-2 py-1 rounded border border-white/10 bg-white/5 text-[11px] text-zinc-300 hover:bg-white/10">
                    Rename
                  </button>
                  <button
                    (click)="deleteSession(conversation.id, $event)"
                    [disabled]="chatSessionService.sessions().length <= 1"
                    class="px-2 py-1 rounded border border-white/10 bg-white/5 text-[11px] text-zinc-300 enabled:hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div *ngIf="chatSessionService.conversationHistory().length === 0" class="rounded-xl border border-dashed border-white/10 px-3 py-4 text-xs text-zinc-500">
            The first prompt you send will appear here as the initial conversation record.
          </div>
        </div>
      </aside>

      <section class="xl:col-span-6 bg-[#0a0a0d] border border-white/5 rounded-2xl overflow-hidden flex flex-col min-h-[36rem] max-h-[calc(100vh-8rem)]">
        <div class="px-5 py-4 border-b border-white/5 bg-black/20 flex items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-light text-white tracking-tight">Chat</h2>
            <p class="text-xs text-zinc-500 mt-1">
              Structured conversation with provider visibility, streaming responses, and artifact handoff.
            </p>
          </div>
          <ui-badge [status]="chatSessionService.isStreaming() ? 'active' : 'idle'">
            {{ chatSessionService.isStreaming() ? 'streaming' : 'idle' }}
          </ui-badge>
        </div>

        <div
          #messageViewport
          (scroll)="handleMessageViewportScroll()"
          class="flex-1 min-h-0 overflow-y-auto p-5 space-y-4 custom-scrollbar">
          <div
            *ngFor="let message of chatSessionService.messages()"
            class="rounded-2xl border p-4"
            [ngClass]="message.role === 'user'
              ? 'border-cyan-500/20 bg-cyan-500/10 ml-8'
              : 'border-white/5 bg-[#0f0f13] mr-8'">
            <div class="flex items-center justify-between gap-4">
              <div>
                <div class="text-xs uppercase tracking-wider text-zinc-500">
                  {{ message.role }} <span *ngIf="message.providerLabel">· {{ message.providerLabel }}</span>
                </div>
                <div class="text-[11px] text-zinc-600 mt-1">message {{ message.id }}</div>
              </div>
              <div class="flex items-center gap-2">
                <ui-badge [status]="getMessageBadge(message)">{{ message.phase }}</ui-badge>
                <button
                  (click)="copyMessage(message)"
                  class="px-2 py-1 rounded border border-white/10 bg-white/5 text-xs text-zinc-300 hover:bg-white/10">
                  Copy
                </button>
                <button
                  *ngIf="hasCanvasCandidate(message)"
                  (click)="openCanvas(message.id)"
                  class="px-2 py-1 rounded border border-cyan-500/20 bg-cyan-500/10 text-xs text-cyan-100 hover:bg-cyan-500/20">
                  Canvas
                </button>
              </div>
            </div>

            <div class="mt-4 space-y-3">
              <ng-container *ngFor="let block of message.blocks">
                <h3 *ngIf="block.type === 'heading' && block.level === 1" class="text-xl font-light text-white">{{ block.text }}</h3>
                <h4 *ngIf="block.type === 'heading' && block.level === 2" class="text-lg font-medium text-zinc-100">{{ block.text }}</h4>
                <h5 *ngIf="block.type === 'heading' && block.level === 3" class="text-base font-medium text-zinc-200">{{ block.text }}</h5>
                <p *ngIf="block.type === 'paragraph'" class="text-sm leading-7 text-zinc-200">{{ block.text }}</p>
                <blockquote *ngIf="block.type === 'quote'" class="border-l-2 border-cyan-500/40 pl-4 text-sm leading-7 text-zinc-300">
                  {{ block.text }}
                </blockquote>
                <ul *ngIf="block.type === 'list' && !block.ordered" class="list-disc pl-6 text-sm leading-7 text-zinc-200 space-y-1">
                  <li *ngFor="let item of block.items">{{ item }}</li>
                </ul>
                <ol *ngIf="block.type === 'list' && block.ordered" class="list-decimal pl-6 text-sm leading-7 text-zinc-200 space-y-1">
                  <li *ngFor="let item of block.items">{{ item }}</li>
                </ol>
                <div *ngIf="block.type === 'code'" class="rounded-xl border border-cyan-500/20 bg-[#050508] overflow-hidden">
                  <div class="px-3 py-2 border-b border-white/5 flex items-center justify-between text-xs text-zinc-400">
                    <span>{{ block.language }}</span>
                    <button
                      (click)="copyCode(block)"
                      class="px-2 py-1 rounded border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10">
                      Copy
                    </button>
                  </div>
                  <pre class="p-4 overflow-x-auto text-sm text-cyan-100 font-mono whitespace-pre-wrap">{{ block.code }}</pre>
                </div>
              </ng-container>
              <div *ngIf="message.phase === 'streaming'" class="inline-flex items-center gap-2 text-xs text-cyan-300">
                <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                Response still streaming
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 border-t border-white/5 bg-black/20 space-y-3">
          <textarea
            [value]="chatSessionService.draft()"
            (input)="updateDraft($event)"
            (keydown)="handlePromptKeydown($event)"
            rows="4"
            placeholder="Ask MagnetarEidolon to plan, explain, generate code, or validate a provider path..."
            class="w-full rounded-2xl border border-white/10 bg-[#050508] px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-cyan-500/40"></textarea>
          <div class="flex items-center justify-between gap-4">
            <div class="text-xs text-zinc-500">
              Streaming through {{ chatSessionService.activeProviderLabel() }}
            </div>
            <div class="flex items-center gap-2">
              <button
                (click)="chatSessionService.completeStreaming()"
                *ngIf="chatSessionService.isStreaming()"
                class="px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm text-zinc-200 hover:bg-white/10">
                Complete Stream
              </button>
              <button
                (click)="submitPrompt()"
                class="px-4 py-2 rounded-lg bg-cyan-500 text-slate-900 text-sm font-semibold hover:bg-cyan-400">
                Send
              </button>
            </div>
          </div>
        </div>
      </section>

      <aside class="xl:col-span-3 space-y-4 min-h-0 xl:max-h-[calc(100vh-8rem)]">
        <div class="bg-[#0a0a0d] border border-white/5 rounded-2xl p-5 flex flex-col min-h-0 xl:max-h-[calc(100vh-8rem-8.5rem)]">
          <div class="text-sm font-medium text-zinc-200 flex items-center gap-2">
            <ui-icon name="git-branch" [size]="16" cssClass="text-violet-400"></ui-icon>
            Canvas Panel
          </div>
          <div *ngIf="chatSessionService.canvasDocument() as canvas; else emptyCanvas" class="mt-4 space-y-3 min-h-0 overflow-y-auto custom-scrollbar">
            <div>
              <div class="text-sm text-zinc-100">{{ canvas.title }}</div>
              <div class="text-xs uppercase tracking-wider text-zinc-500 mt-1">
                {{ canvas.language }} <span *ngIf="canvas.renderKind === 'html'">· rendered preview</span>
              </div>
            </div>
            <div *ngIf="canvas.renderKind === 'html'" class="space-y-3">
              <div class="rounded-xl border border-emerald-500/20 bg-white overflow-hidden">
                <div class="px-3 py-2 border-b border-black/10 text-xs uppercase tracking-wider text-slate-600 bg-slate-100">
                  {{ canvas.renderTitle || 'Rendered HTML' }}
                </div>
                <iframe
                  title="Canvas HTML preview"
                  sandbox=""
                  [attr.srcdoc]="canvas.content"
                  class="block w-full h-72 bg-white"></iframe>
              </div>
              <div class="rounded-xl border border-white/5 bg-[#050508] overflow-hidden">
                <div class="px-3 py-2 border-b border-white/5 text-xs uppercase tracking-wider text-zinc-500">
                  Source
                </div>
                <pre class="p-4 overflow-x-auto text-xs font-mono text-cyan-100 whitespace-pre-wrap">{{ canvas.content }}</pre>
              </div>
            </div>
            <pre *ngIf="canvas.renderKind !== 'html'" class="rounded-xl border border-white/5 bg-[#050508] p-4 overflow-x-auto text-xs font-mono text-cyan-100 whitespace-pre-wrap">{{ canvas.content }}</pre>
            <button
              (click)="chatSessionService.closeCanvas()"
              class="px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm text-zinc-200 hover:bg-white/10">
              Close Canvas
            </button>
          </div>
          <ng-template #emptyCanvas>
            <p class="mt-4 text-sm leading-7 text-zinc-500">
              Code-oriented assistant responses can be lifted into this side panel as the first step toward document or canvas mode.
            </p>
          </ng-template>
        </div>

        <div class="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-5">
          <div class="text-sm font-medium text-cyan-300 flex items-center gap-2">
            <ui-icon name="shield" [size]="16"></ui-icon>
            Rendering Baseline
          </div>
          <ul class="mt-3 space-y-2 text-xs leading-6 text-cyan-100/80">
            <li>Semantic block rendering for headings, paragraphs, lists, quotes, and code.</li>
            <li>Provider identity visible in the response header.</li>
            <li>Streaming behavior backed by explicit chat-session state.</li>
          </ul>
        </div>
      </aside>
    </div>
  `,
})
export class ChatScreen implements AfterViewChecked {
  public readonly providerConfigService = inject(ProviderConfigService);
  public readonly chatSessionService = inject(ChatSessionService);
  @ViewChild('messageViewport') private messageViewport?: ElementRef<HTMLDivElement>;

  private lastScrollSignature = '';
  private shouldAutoScroll = true;

  public updateDraft(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.chatSessionService.setDraft(target.value);
  }

  public async submitPrompt(): Promise<void> {
    const didStart = await this.chatSessionService.submitDraft();
    if (!didStart) {
      return;
    }

    this.shouldAutoScroll = true;
    this.scrollMessageViewportToBottom();
  }

  public handlePromptKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' || event.shiftKey) {
      return;
    }

    event.preventDefault();
    void this.submitPrompt();
  }

  public handleMessageViewportScroll(): void {
    const viewport = this.messageViewport?.nativeElement;
    if (!viewport) {
      return;
    }

    this.shouldAutoScroll = this.isNearBottom(viewport);
  }

  public copyMessage(message: ChatMessage): void {
    void navigator.clipboard?.writeText(message.rawText);
  }

  public copyCode(block: ChatBlock): void {
    if (block.type !== 'code') {
      return;
    }

    void navigator.clipboard?.writeText(block.code);
  }

  public hasCanvasCandidate(message: ChatMessage): boolean {
    return message.blocks.some((block) => block.type === 'code');
  }

  public openCanvas(messageId: string): void {
    this.chatSessionService.openCanvasFromMessage(messageId);
  }

  public createNewSession(): void {
    this.chatSessionService.createNewSession();
    this.shouldAutoScroll = true;
  }

  public switchToSession(sessionId: string): void {
    this.chatSessionService.switchToSession(sessionId);
    this.shouldAutoScroll = true;
  }

  public renameSession(sessionId: string, event: Event): void {
    event.stopPropagation();
    const currentTitle =
      this.chatSessionService.conversationHistory().find((conversation) => conversation.id === sessionId)?.title ??
      'New Chat';
    const nextTitle = globalThis.prompt?.('Rename chat', currentTitle);
    if (!nextTitle) {
      return;
    }

    this.chatSessionService.renameSession(sessionId, nextTitle);
  }

  public deleteSession(sessionId: string, event: Event): void {
    event.stopPropagation();
    const confirmed = globalThis.confirm?.('Delete this chat?') ?? false;
    if (!confirmed) {
      return;
    }

    this.chatSessionService.deleteSession(sessionId);
  }

  public isActiveSession(sessionId: string): boolean {
    return this.chatSessionService.currentSession()?.id === sessionId;
  }

  public getMessageBadge(message: ChatMessage): BadgeStatus {
    switch (message.phase) {
      case 'complete':
        return 'success';
      case 'streaming':
        return 'active';
      case 'error':
        return 'failed';
      case 'idle':
      default:
        return 'idle';
    }
  }

  public ngAfterViewChecked(): void {
    const viewport = this.messageViewport?.nativeElement;
    if (!viewport) {
      return;
    }

    const messages = this.chatSessionService.messages();
    const lastMessage = messages.at(-1);
    const nextSignature = `${messages.length}:${lastMessage?.id ?? ''}:${lastMessage?.phase ?? ''}:${lastMessage?.rawText.length ?? 0}`;
    if (nextSignature === this.lastScrollSignature) {
      return;
    }

    this.lastScrollSignature = nextSignature;
    if (!this.shouldAutoScroll) {
      return;
    }

    this.scrollMessageViewportToBottom();
  }

  private scrollMessageViewportToBottom(): void {
    const viewport = this.messageViewport?.nativeElement;
    if (!viewport) {
      return;
    }

    const scheduleFrame =
      globalThis.requestAnimationFrame ??
      ((callback: FrameRequestCallback) => setTimeout(() => callback(0), 0));
    scheduleFrame(() => {
      viewport.scrollTop = viewport.scrollHeight;
    });
  }

  private isNearBottom(viewport: HTMLDivElement): boolean {
    const remainingDistance = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
    return remainingDistance <= 96;
  }
}

@Component({
  selector: 'screen-memory',
  standalone: true,
  imports: [CommonModule, UiIconComponent, UiBadgeComponent],
  template: `
    <div class="space-y-6 animate-fade-in pb-12">
      <div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 class="text-2xl font-light text-white tracking-tight">Memory Inspector</h2>
          <p class="text-sm text-zinc-400 mt-1">
            Review session memory, durable notes, and the context fragments currently shaping execution.
          </p>
        </div>
        <div class="flex flex-wrap gap-2 text-xs text-zinc-400">
          <span class="px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            Session Items: {{ sessionMemory.length }}
          </span>
          <span class="px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            Durable Notes: {{ durableMemory.length }}
          </span>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 bg-[#0f0f13] border border-white/5 rounded-2xl overflow-hidden">
          <div class="px-5 py-4 border-b border-white/5 flex items-center justify-between bg-black/20">
            <div class="text-sm font-medium text-zinc-200 flex items-center gap-2">
              <ui-icon name="database" [size]="16" cssClass="text-cyan-400"></ui-icon>
              Active Context Stack
            </div>
            <ui-badge status="active">Inspectable</ui-badge>
          </div>
          <div class="divide-y divide-white/5">
            <div *ngFor="let item of sessionMemory" class="px-5 py-4 flex items-start justify-between gap-4">
              <div>
                <div class="text-sm font-medium text-zinc-100">{{ item.title }}</div>
                <div class="text-xs text-zinc-500 mt-1">{{ item.scope }}</div>
                <p class="text-sm text-zinc-300 mt-3 leading-relaxed">{{ item.summary }}</p>
              </div>
              <ui-badge [status]="item.status">{{ item.badge }}</ui-badge>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <div class="bg-[#0a0a0d] border border-white/5 rounded-2xl p-5">
            <div class="text-sm font-medium text-zinc-200 flex items-center gap-2">
              <ui-icon name="book-open" [size]="16" cssClass="text-violet-400"></ui-icon>
              Durable Notes
            </div>
            <div class="mt-4 space-y-3">
              <div *ngFor="let note of durableMemory" class="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                <div class="text-sm text-zinc-200">{{ note.title }}</div>
                <div class="text-[11px] uppercase tracking-wider text-zinc-500 mt-1">{{ note.tag }}</div>
              </div>
            </div>
          </div>

          <div class="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-5">
            <div class="text-sm font-medium text-cyan-300 flex items-center gap-2">
              <ui-icon name="shield" [size]="16"></ui-icon>
              Memory Rule
            </div>
            <p class="mt-3 text-xs leading-relaxed text-cyan-100/80">
              Memory must remain visible, governable, and separable from runtime orchestration. Hidden memory is not
              acceptable product behavior.
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class MemoryScreen {
  public readonly sessionMemory = [
    {
      title: 'Current execution objective',
      scope: 'session / goal',
      summary: 'Prepare a migration script with explicit approval before any write-capable execution path is enabled.',
      badge: 'Pinned',
      status: 'active' as BadgeStatus,
    },
    {
      title: 'Recent schema evidence',
      scope: 'session / tool output',
      summary: 'Users table inspected successfully. Runtime should preserve the evidence trail before proposing changes.',
      badge: 'Fresh',
      status: 'pending_approval' as BadgeStatus,
    },
    {
      title: 'Policy reminder',
      scope: 'session / governance',
      summary: 'Write operations remain approval-gated by default, even when a provider returns a valid migration plan.',
      badge: 'Guarded',
      status: 'idle' as BadgeStatus,
    },
  ];

  public readonly durableMemory = [
    { title: 'Default provider path starts local-first with LM Studio', tag: 'provider' },
    { title: 'Traceability required for every sensitive action', tag: 'policy' },
    { title: 'SDK contract remains shared between UI and CLI', tag: 'architecture' },
  ];
}

@Component({
  selector: 'screen-providers',
  standalone: true,
  imports: [CommonModule, UiIconComponent, UiBadgeComponent],
  styles: [`
    .accordion-grid {
        display: grid;
        grid-template-rows: 0fr;
        transition: grid-template-rows 0.3s ease-in-out;
    }
    .accordion-grid.is-open {
        grid-template-rows: 1fr;
    }
    .accordion-inner {
        overflow: hidden;
    }
  `],
  template: `
    <div class="space-y-6 animate-fade-in pb-12">
      <div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 class="text-2xl font-light text-white tracking-tight">AI Providers</h2>
          <p class="text-sm text-zinc-400 mt-1">
            Configure multiple providers, define the primary runtime, and keep backups ready for failover without
            hiding endpoints, models, keys, or request templates.
          </p>
        </div>
        <div class="flex flex-wrap items-center justify-end gap-2">
          <span class="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-400">
            Primary: {{ primaryProvider()?.name || 'Unassigned' }}
          </span>
          <span class="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-400">
            Backups Ready: {{ healthyFailoverCount() }}
          </span>
          <span class="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-400">
            Configured: {{ providers().length }}
          </span>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-[18rem_minmax(0,1fr)_24rem] gap-6 items-start">
        <aside class="bg-[#090a0f] border border-cyan-500/10 rounded-3xl p-5 space-y-4 shadow-[0_20px_80px_rgba(6,182,212,0.08)] lg:sticky lg:top-20">

          <!-- Accordion 1: Quick Add Presets -->
          <section class="bg-white/[0.02] rounded-2xl border border-white/5 overflow-hidden transition-all duration-300"
                   [ngClass]="accordions().quickAdd ? 'border-cyan-500/30 shadow-[0_12px_40px_rgba(34,211,238,0.1)]' : 'hover:bg-white/[0.04]'">
            <button (click)="toggleAccordion('quickAdd')" class="w-full flex items-center justify-between p-4 bg-transparent hover:bg-white/[0.02] transition-colors relative z-10 cursor-pointer group">
                <h2 class="text-xs uppercase tracking-widest text-zinc-400 font-bold flex items-center gap-2 group-hover:text-zinc-200 transition-colors">
                    <ui-icon name="plus-circle" [size]="16" cssClass="text-cyan-400"></ui-icon>
                    Quick Add
                </h2>
                <ui-icon [name]="accordions().quickAdd ? 'chevron-up' : 'chevron-down'" [size]="16" cssClass="text-zinc-500"></ui-icon>
            </button>

            <div *ngIf="accordions().quickAdd" class="p-4 pt-0 space-y-2 animate-fade-in">
              <div class="pb-2 text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                Choose a preset to create a new provider configuration
              </div>
              <button *ngFor="let preset of presets()"
                (click)="addPreset(preset.kind)"
                class="w-full flex items-center justify-between p-3 border rounded-xl transition-all group shadow-sm text-left"
                [ngClass]="isPresetSelected(preset.kind)
                  ? 'bg-cyan-500/10 border-cyan-500/40 shadow-[0_12px_30px_rgba(34,211,238,0.12)]'
                  : 'bg-black/20 border-white/5 hover:bg-white/[0.05] hover:border-cyan-500/30'">
                  <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded flex items-center justify-center border group-hover:bg-white/5"
                           [ngClass]="getPresetColorClasses(preset.kind)">
                          <ui-icon name="layers" [size]="14"></ui-icon>
                      </div>
                      <div>
                          <div class="text-sm font-medium"
                               [ngClass]="isPresetSelected(preset.kind) ? 'text-white' : 'text-zinc-200 group-hover:text-white'">
                            {{ preset.label }}
                          </div>
                          <div class="text-[10px] mt-0.5"
                               [ngClass]="isPresetSelected(preset.kind) ? 'text-cyan-200/80' : 'text-zinc-500'">
                            {{ preset.description }}
                          </div>
                      </div>
                  </div>
                  <span *ngIf="isPresetSelected(preset.kind)"
                        class="px-2 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-[10px] font-bold uppercase tracking-wider text-cyan-200">
                    Selected
                  </span>
                  <ui-icon *ngIf="!isPresetSelected(preset.kind)" name="plus" [size]="14" cssClass="text-zinc-600 group-hover:text-cyan-400"></ui-icon>
              </button>
            </div>
          </section>

          <!-- Accordion 2: Configured Providers -->
          <section class="bg-white/[0.02] rounded-2xl border border-white/5 overflow-hidden transition-all duration-300"
                   [ngClass]="accordions().configured ? 'border-cyan-500/30 shadow-[0_12px_40px_rgba(34,211,238,0.1)]' : 'hover:bg-white/[0.04]'">
            <button (click)="toggleConfiguredAccordion()" class="w-full flex items-center justify-between p-4 bg-transparent hover:bg-white/[0.02] transition-colors relative z-10 cursor-pointer group">
                <h2 class="text-xs uppercase tracking-widest text-zinc-400 font-bold flex items-center gap-2 group-hover:text-zinc-200 transition-colors">
                    <ui-icon name="server" [size]="16" cssClass="text-emerald-400"></ui-icon>
                    View Current
                </h2>
                <div class="flex items-center gap-3">
                    <span class="px-2 py-0.5 text-[10px] uppercase tracking-wider rounded bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20">{{ providers().length }} Configured</span>
                    <ui-icon [name]="accordions().configured ? 'chevron-up' : 'chevron-down'" [size]="16" cssClass="text-zinc-500"></ui-icon>
                </div>
            </button>

            <div *ngIf="accordions().configured" class="p-4 pt-0 space-y-2 animate-fade-in">
              <div *ngFor="let provider of providers()"
                   (click)="selectProvider(provider.id)"
                   class="flex items-center justify-between p-2 rounded-xl bg-black/20 border border-white/5 hover:border-white/10 cursor-pointer transition-colors"
                   [ngClass]="{'border-cyan-500/30 bg-cyan-500/5': selectedProvider()?.id === provider.id}">
                  <div class="flex items-center gap-2">
                      <span class="w-1.5 h-1.5 rounded-full" [ngClass]="getRoleBgClass(provider.role)"></span>
                      <span class="text-sm font-medium text-zinc-300 truncate max-w-[120px]">{{ provider.name }}</span>
                  </div>
                  <span class="text-[10px] font-bold uppercase" [ngClass]="getRoleTextClass(provider.role)">{{ provider.role }}</span>
              </div>

              <div class="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-3">
                <div class="text-xs uppercase tracking-[0.18em] text-zinc-500">Layout</div>
                <div class="inline-flex rounded-xl border border-white/10 bg-black/20 p-1 text-xs">
                  <button
                    (click)="setViewMode('grid')"
                    class="px-3 py-1.5 rounded-lg transition-colors"
                    [ngClass]="viewMode() === 'grid' ? 'bg-cyan-500 text-slate-900 font-medium' : 'text-zinc-300 hover:bg-white/5'">
                    Cards
                  </button>
                  <button
                    (click)="setViewMode('list')"
                    class="px-3 py-1.5 rounded-lg transition-colors"
                    [ngClass]="viewMode() === 'list' ? 'bg-cyan-500 text-slate-900 font-medium' : 'text-zinc-300 hover:bg-white/5'">
                    List
                  </button>
                </div>
              </div>
            </div>
          </section>

          <!-- Accordion 3: Add Custom Configuration -->
          <section class="bg-white/[0.02] rounded-2xl border border-white/5 overflow-hidden transition-all duration-300"
                   [ngClass]="accordions().custom ? 'border-violet-500/30 shadow-[0_12px_40px_rgba(139,92,246,0.1)]' : 'hover:bg-white/[0.04]'">
            <button (click)="toggleAccordion('custom')" class="w-full flex items-center justify-between p-4 bg-transparent hover:bg-white/[0.02] transition-colors relative z-10 cursor-pointer group">
                <h2 class="text-xs uppercase tracking-widest text-zinc-400 font-bold flex items-center gap-2 group-hover:text-zinc-200 transition-colors">
                    <ui-icon name="wrench" [size]="16" cssClass="text-violet-400"></ui-icon>
                    Add Custom Config
                </h2>
                <ui-icon [name]="accordions().custom ? 'chevron-up' : 'chevron-down'" [size]="16" cssClass="text-zinc-500"></ui-icon>
            </button>

            <div *ngIf="accordions().custom" class="p-4 pt-0 space-y-3 animate-fade-in">
              <p class="text-xs text-zinc-400 mb-3">Start from a generic provider definition and adapt endpoint, model, keys, and templates by hand.</p>
              <button
                (click)="addCustomProvider()"
                class="w-full py-3 border-2 rounded-xl transition-all flex items-center justify-center gap-2 text-sm font-medium group cursor-pointer"
                [ngClass]="isCustomProviderSelected()
                  ? 'border-violet-500/50 bg-violet-500/10 text-violet-200'
                  : 'border-dashed border-white/10 text-zinc-400 hover:border-violet-500/50 hover:text-violet-300 hover:bg-violet-500/10'">
                  <ui-icon name="plus" [size]="16" cssClass="group-hover:scale-110 transition-transform"></ui-icon>
                  {{ isCustomProviderSelected() ? 'Custom Provider Selected' : 'Configure Custom Provider' }}
              </button>
            </div>
          </section>
        </aside>

        <div class="space-y-6">
          <div *ngIf="showProviderEditor() && selectedProvider() as provider" class="bg-[#0a0a0d] border border-white/5 rounded-2xl p-5 space-y-4">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div class="flex items-center gap-2 text-sm font-medium text-zinc-200">
                <ui-icon name="wrench" [size]="16" cssClass="text-violet-400"></ui-icon>
                {{ isConfiguringNewProvider() ? 'New Provider Configuration' : 'Provider Editor' }}
              </div>
              <button
                *ngIf="isConfiguringNewProvider()"
                (click)="finishProviderConfiguration()"
                class="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-zinc-300 transition-colors hover:bg-white/[0.06] hover:text-white">
                Back To Configured Providers
              </button>
            </div>
            <div class="rounded-xl border border-white/5 bg-white/[0.03] p-4">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <div class="text-sm text-zinc-100">{{ provider.name }}</div>
                  <div class="text-xs uppercase tracking-wider text-zinc-500 mt-1">
                    {{ provider.kind }} · {{ provider.apiStyle }} · {{ describeRole(provider) }}
                  </div>
                </div>
                <ui-badge [status]="getHealthBadge(provider)">{{ provider.health }}</ui-badge>
              </div>
            </div>
            <div *ngIf="isConfiguringNewProvider()" class="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-3 text-xs leading-6 text-cyan-100/80">
              You are configuring a newly added provider. The left rail stays focused on the add flow until you return to the configured-provider view.
            </div>
            <div class="space-y-4">
              <div>
                <div class="text-xs uppercase tracking-wider text-zinc-500 mb-2">Identity</div>
                <div class="grid grid-cols-1 gap-3 text-xs">
                  <label class="space-y-1">
                    <span class="text-zinc-500 uppercase tracking-wider">Name</span>
                    <input
                      [value]="provider.name"
                      (input)="updateProviderField(provider.id, 'name', readInputValue($event))"
                      class="w-full rounded-lg border border-white/10 bg-[#050508] px-3 py-2 text-zinc-100" />
                  </label>
                  <label class="space-y-1">
                    <span class="text-zinc-500 uppercase tracking-wider">Description</span>
                    <textarea
                      rows="3"
                      [value]="provider.description"
                      (input)="updateProviderField(provider.id, 'description', readInputValue($event))"
                      class="w-full rounded-lg border border-white/10 bg-[#050508] px-3 py-2 text-zinc-100"></textarea>
                  </label>
                </div>
              </div>
              <div>
                <div class="text-xs uppercase tracking-wider text-zinc-500 mb-2">Runtime</div>
                <div class="grid grid-cols-1 gap-3 text-xs">
                  <label class="space-y-1">
                    <span class="text-zinc-500 uppercase tracking-wider">Endpoint</span>
                    <input
                      [value]="provider.baseUrl"
                      (input)="updateProviderField(provider.id, 'baseUrl', readInputValue($event))"
                      class="w-full rounded-lg border border-white/10 bg-[#050508] px-3 py-2 text-zinc-100 font-mono" />
                  </label>
                  <label class="space-y-1">
                    <span class="text-zinc-500 uppercase tracking-wider">Model</span>
                    <input
                      [value]="provider.model"
                      (input)="updateProviderField(provider.id, 'model', readInputValue($event))"
                      class="w-full rounded-lg border border-white/10 bg-[#050508] px-3 py-2 text-zinc-100 font-mono" />
                  </label>
                  <label *ngIf="provider.supportsApiKey" class="space-y-1">
                    <span class="text-zinc-500 uppercase tracking-wider">API Key</span>
                    <input
                      type="password"
                      [value]="provider.apiKey"
                      (input)="updateProviderField(provider.id, 'apiKey', readInputValue($event))"
                      class="w-full rounded-lg border border-white/10 bg-[#050508] px-3 py-2 text-zinc-100 font-mono" />
                  </label>
                  <label class="space-y-1">
                    <span class="text-zinc-500 uppercase tracking-wider">API Style</span>
                    <input
                      [value]="provider.apiStyle"
                      readonly
                      class="w-full rounded-lg border border-white/10 bg-[#111116] px-3 py-2 text-zinc-400" />
                  </label>
                  <div class="space-y-2">
                    <span class="text-zinc-500 uppercase tracking-wider">Suggested Models</span>
                    <div class="flex flex-wrap gap-2">
                      <button
                        *ngFor="let suggestion of provider.modelSuggestions"
                        (click)="applyModelSuggestion(provider.id, suggestion)"
                        class="px-2 py-1 rounded-full border border-white/10 bg-white/5 text-[11px] text-zinc-300 hover:bg-white/10">
                        {{ suggestion }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="rounded-xl border border-white/5 bg-[#050508] p-4">
              <div class="text-xs uppercase tracking-wider text-zinc-500 mb-2">Primary Inference Template</div>
              <textarea
                rows="7"
                [value]="provider.template.requestTemplate"
                (input)="updateProviderTemplate(provider.id, readInputValue($event))"
                class="w-full rounded-lg border border-white/10 bg-[#020305] px-3 py-3 text-xs font-mono text-cyan-100"></textarea>
              <div class="mt-4 space-y-2">
                <label class="space-y-1 text-xs">
                  <span class="text-zinc-500 uppercase tracking-wider">Placeholders</span>
                  <input
                    [value]="placeholderEditorValue(provider)"
                    (input)="updateProviderPlaceholders(provider.id, readInputValue($event))"
                    class="w-full rounded-lg border border-white/10 bg-[#020305] px-3 py-2 text-zinc-100 font-mono"
                    placeholder="$model, $messages, $stream" />
                </label>
                <p class="text-[11px] leading-5 text-zinc-500">
                  Separate with comma, space, or line breaks. Example:
                  <span class="font-mono">$model</span>, <span class="font-mono">$messages</span>,
                  <span class="font-mono">$stream</span>.
                </p>
              </div>
              <div class="mt-3 flex flex-wrap gap-2">
                <span *ngFor="let placeholder of provider.template.placeholders" class="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-zinc-300">
                  {{ placeholder }}
                </span>
              </div>
            </div>
            <div class="rounded-xl border border-white/5 bg-[#050508] p-4 space-y-4">
              <div class="flex items-center gap-2 text-sm font-medium text-zinc-200">
                <ui-icon name="server" [size]="16" cssClass="text-cyan-400"></ui-icon>
                API Surface
              </div>
              <div class="space-y-2">
                <div class="text-xs uppercase tracking-wider text-zinc-500">Comparison Notes</div>
                <ul class="space-y-2 text-xs leading-6 text-zinc-400">
                  <li *ngFor="let note of provider.apiSurface.endpointComparison" class="rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2">
                    {{ note }}
                  </li>
                </ul>
              </div>
              <div class="space-y-3">
                <div class="text-xs uppercase tracking-wider text-zinc-500">Endpoints</div>

                <ng-container *ngIf="activeEndpoint() as activeEndpoint">
                <div class="rounded-xl border border-white/5 bg-white/[0.03] overflow-hidden flex flex-col">
                  <!-- Tab Bar -->
                  <div class="flex overflow-x-auto border-b border-white/5 bg-[#0a0a0d] custom-scrollbar">
                    <button
                      *ngFor="let endpoint of provider.apiSurface.endpoints"
                      (click)="selectEndpoint(endpoint.id)"
                      class="px-4 py-3 text-xs font-medium whitespace-nowrap transition-colors border-b-2"
                      [ngClass]="activeEndpoint.id === endpoint.id
                        ? 'border-cyan-400 text-cyan-300 bg-white/[0.04]'
                        : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]'">
                      {{ endpoint.label }}
                    </button>
                  </div>

                  <!-- Active Endpoint Details -->
                  <div class="p-4 space-y-4">
                    <div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div class="flex items-center gap-2">
                          <span class="inline-flex rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                                [ngClass]="getHttpMethodClasses(activeEndpoint.method)">
                            {{ activeEndpoint.method }}
                          </span>
                          <span class="text-sm font-medium text-zinc-100">{{ activeEndpoint.label }}</span>
                        </div>
                        <div class="mt-1 font-mono text-xs text-cyan-300">{{ provider.baseUrl }}{{ activeEndpoint.path }}</div>
                        <div class="mt-2 text-xs leading-6 text-zinc-400">{{ activeEndpoint.description }}</div>
                      </div>
                    </div>
                    <div *ngIf="activeEndpoint.requestTemplate; else noRequestBody" class="space-y-2">
                      <div class="text-[11px] uppercase tracking-wider text-zinc-500">Request Body</div>
                      <textarea
                        rows="6"
                        [value]="activeEndpoint.requestTemplate"
                        (input)="updateProviderApiEndpointTemplate(provider.id, activeEndpoint.id, readInputValue($event))"
                        class="w-full rounded-lg border border-white/10 bg-[#020305] px-3 py-3 text-xs font-mono text-cyan-100"></textarea>
                    </div>
                    <ng-template #noRequestBody>
                      <div class="rounded-lg border border-dashed border-white/10 bg-black/20 px-3 py-2 text-xs text-zinc-500">
                        No request body template for this endpoint.
                      </div>
                    </ng-template>
                    <div class="space-y-2">
                      <div class="text-[11px] uppercase tracking-wider text-zinc-500">Endpoint Placeholders</div>
                      <input
                        [value]="endpointPlaceholdersValue(activeEndpoint.placeholders)"
                        (input)="updateProviderApiEndpointPlaceholders(provider.id, activeEndpoint.id, readInputValue($event))"
                        class="w-full rounded-lg border border-white/10 bg-[#020305] px-3 py-2 text-zinc-100 font-mono text-xs"
                        placeholder="$model, $messages, $stream" />
                      <div class="flex flex-wrap gap-2">
                        <span *ngFor="let placeholder of activeEndpoint.placeholders" class="px-2 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-zinc-300">
                          {{ placeholder }}
                        </span>
                      </div>
                    </div>
                    <div *ngIf="activeEndpoint.requestExample || activeEndpoint.requestTemplate" class="space-y-2">
                      <div class="text-[11px] uppercase tracking-wider text-zinc-500">Full JSON Example</div>
                      <textarea
                        rows="8"
                        [value]="activeEndpoint.requestExample"
                        (input)="updateProviderApiEndpointExample(provider.id, activeEndpoint.id, readInputValue($event))"
                        class="w-full rounded-lg border border-white/10 bg-[#020305] px-3 py-3 text-xs font-mono text-emerald-100"></textarea>
                    </div>
                    <div *ngIf="activeEndpoint.notes.length" class="space-y-2">
                      <div class="text-[11px] uppercase tracking-wider text-zinc-500">Behavior Notes</div>
                      <ul class="space-y-2 text-xs leading-6 text-zinc-400">
                        <li *ngFor="let note of activeEndpoint.notes" class="rounded-lg border border-white/5 bg-black/20 px-3 py-2">
                          {{ note }}
                        </li>
                      </ul>
                    </div>
                    <div *ngIf="activeEndpoint.responseExample" class="space-y-2">
                      <div class="text-[11px] uppercase tracking-wider text-zinc-500">Example Response</div>
                      <textarea
                        rows="8"
                        [value]="activeEndpoint.responseExample"
                        readonly
                        class="w-full rounded-lg border border-white/10 bg-[#020305] px-3 py-3 text-xs font-mono text-violet-100"></textarea>
                    </div>
                  </div>
                </div>
                </ng-container>
              </div>
            </div>
            <div class="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs leading-6 text-amber-100/80">
              Ownership: {{ provider.ownership }}. Secrets should ultimately live on the backend; this UI slice
              currently persists provider configuration locally until backend sync is completed.
            </div>
            <div *ngIf="!isConfiguringNewProvider()" class="rounded-xl border border-white/5 bg-[#050508] p-4 space-y-3">
              <div class="flex items-center justify-between gap-3">
                <div class="text-xs uppercase tracking-wider text-zinc-500">Raw Config</div>
                <button
                  (click)="toggleConfiguredJson(provider.id)"
                  class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-zinc-300 transition-colors hover:bg-white/[0.06] hover:text-white">
                  <ui-icon [name]="isConfiguredJsonVisible(provider.id) ? 'chevron-up' : 'chevron-down'" [size]="12"></ui-icon>
                  {{ isConfiguredJsonVisible(provider.id) ? 'Hide Raw Config' : 'View Raw Config' }}
                </button>
              </div>
              <div *ngIf="isConfiguredJsonVisible(provider.id)" class="space-y-2">
                <p class="text-[11px] leading-5 text-zinc-500">
                  Final resolved raw configuration for this configured provider instance.
                </p>
                <textarea
                  rows="18"
                  [value]="configuredProviderJson(provider.id)"
                  readonly
                  class="w-full rounded-lg border border-white/10 bg-[#020305] px-3 py-3 text-xs font-mono text-emerald-100"></textarea>
              </div>
            </div>
            <div *ngIf="isConfiguringNewProvider(); else existingProviderActions" class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                (click)="finishProviderConfiguration()"
                class="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-sm font-medium text-cyan-100 hover:bg-cyan-500/20">
                Add {{ provider.name }} Configuration
              </button>
              <button
                (click)="addCustomProvider()"
                class="w-full px-3 py-2 rounded-lg border border-violet-500/20 bg-violet-500/10 text-sm text-violet-100 hover:bg-violet-500/20">
                Add Custom Configuration
              </button>
            </div>
            <ng-template #existingProviderActions>
              <button
                *ngIf="canRemoveProvider(provider.id); else resetProviderAction"
                (click)="removeProvider(provider.id)"
                class="w-full px-3 py-2 rounded-lg border border-red-500/20 bg-red-500/10 text-sm text-red-100 hover:bg-red-500/20">
                Delete Configuration
              </button>
              <ng-template #resetProviderAction>
                <button
                  (click)="resetProvider(provider.id)"
                  class="w-full px-3 py-2 rounded-lg border border-amber-500/20 bg-amber-500/10 text-sm text-amber-100 hover:bg-amber-500/20">
                  Reset Configuration Values
                </button>
              </ng-template>
            </ng-template>
          </div>

          <div
          *ngIf="!isConfiguringNewProvider()"
          [ngClass]="viewMode() === 'grid' ? 'grid grid-cols-1 xl:grid-cols-2 gap-4' : 'space-y-3'">
            <div
              *ngFor="let provider of providers()"
              (click)="selectProvider(provider.id)"
              class="bg-[#0f0f13] border rounded-2xl p-5 shadow-xl cursor-pointer transition-colors"
              [ngClass]="[
                viewMode() === 'grid' ? 'flex flex-col gap-4' : 'flex flex-col md:flex-row md:items-start md:justify-between gap-4',
                selectedProvider()?.id === provider.id ? 'border-cyan-500/30' : 'border-white/5 hover:border-white/10'
              ]">
              <div class="flex-1 space-y-4">
                <div class="flex items-start justify-between gap-4">
                  <div class="flex items-start gap-3">
                    <div class="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-cyan-300">
                      <ui-icon name="server" [size]="20"></ui-icon>
                    </div>
                    <div>
                      <div class="text-base font-medium text-zinc-100">{{ provider.name }}</div>
                      <div class="text-xs text-zinc-500 mt-1">{{ provider.kind }} · {{ provider.apiStyle }}</div>
                    </div>
                  </div>
                  <div class="flex flex-col items-end gap-2">
                    <ui-badge [status]="getHealthBadge(provider)">{{ provider.health }}</ui-badge>
                    <span class="text-[11px] uppercase tracking-wider text-zinc-500">
                      {{ describeRole(provider) }}
                    </span>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div class="bg-white/5 border border-white/5 rounded-xl p-3">
                    <div class="text-zinc-500 uppercase tracking-wider mb-1">Base URL</div>
                    <div class="font-mono text-zinc-300 break-all">{{ provider.baseUrl }}</div>
                  </div>
                  <div class="bg-white/5 border border-white/5 rounded-xl p-3">
                    <div class="text-zinc-500 uppercase tracking-wider mb-1">Model</div>
                    <div class="font-mono text-zinc-300">{{ provider.model }}</div>
                  </div>
                </div>

                <div class="flex items-center justify-between text-xs text-zinc-500">
                  <span>Failover priority {{ provider.priority }}</span>
                  <span *ngIf="provider.role === 'backup'">Eligible backup</span>
                  <span *ngIf="provider.role === 'primary'">Current default route</span>
                  <span *ngIf="provider.role === 'disabled'">Not used by runtime</span>
                </div>
              </div>

              <div class="grid grid-cols-3 gap-2 md:w-60 md:shrink-0">
                <button
                  (click)="setPrimary(provider.id)"
                  class="py-2 rounded-lg text-xs font-medium border transition-colors"
                  [ngClass]="provider.role === 'primary'
                    ? 'bg-cyan-500 text-slate-900 border-cyan-400'
                    : 'bg-white/5 border-white/10 text-zinc-200 hover:bg-white/10'">
                  Primary
                </button>
                <button
                  (click)="setBackup(provider.id)"
                  class="py-2 rounded-lg text-xs font-medium border transition-colors"
                  [ngClass]="provider.role === 'backup'
                    ? 'bg-amber-400 text-amber-950 border-amber-300'
                    : 'bg-white/5 border-white/10 text-zinc-200 hover:bg-white/10'">
                  Backup
                </button>
                <button
                  (click)="disable(provider.id)"
                  class="py-2 rounded-lg text-xs font-medium border transition-colors"
                  [ngClass]="provider.role === 'disabled'
                    ? 'bg-zinc-700 text-zinc-100 border-zinc-600'
                    : 'bg-white/5 border-white/10 text-zinc-200 hover:bg-white/10'">
                  Disable
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <div *ngIf="!isConfiguringNewProvider()" class="bg-[#0a0a0d] border border-white/5 rounded-2xl p-5">
            <div class="flex items-center gap-2 text-sm font-medium text-zinc-200">
              <ui-icon name="activity" [size]="16" cssClass="text-cyan-400"></ui-icon>
              Failover Chain
            </div>
            <div class="mt-4 space-y-3">
              <div
                *ngFor="let provider of providers()"
                class="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2">
                <div>
                  <div class="text-sm text-zinc-200">{{ provider.name }}</div>
                  <div class="text-[11px] uppercase tracking-wider text-zinc-500">{{ describeRole(provider) }}</div>
                </div>
                <div class="text-xs font-mono text-zinc-400">#{{ provider.priority }}</div>
              </div>
            </div>
          </div>

          <div class="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-5">
            <div class="flex items-center gap-2 text-sm font-medium text-cyan-300">
              <ui-icon name="shield" [size]="16"></ui-icon>
              Runtime Intent
            </div>
            <p class="mt-3 text-xs leading-relaxed text-cyan-100/80">
              Provider configuration should live independently from chat and runtime execution. The UI can reorder,
              add, edit, and disable providers, while the backend later decides how to consume that chain.
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ProvidersScreen {
  public readonly accordions = signal({
    quickAdd: true,
    configured: false,
    custom: false
  });
  public readonly providerWorkflowMode = signal<'browse' | 'quickAdd' | 'custom'>('browse');

  public toggleAccordion(section: 'quickAdd' | 'configured' | 'custom'): void {
    this.accordions.update(acc => ({ ...acc, [section]: !acc[section] }));
  }

  public toggleConfiguredAccordion(): void {
    this.providerWorkflowMode.set('browse');
    this.selectedProviderId.set(null);
    this.selectedEndpointId.set(null);
    this.accordions.update((acc) => ({ ...acc, configured: !acc.configured }));
  }

  public isConfiguringNewProvider(): boolean {
    return this.providerWorkflowMode() !== 'browse';
  }

  public isPresetSelected(kind: ProviderPreset['kind']): boolean {
    return this.providerWorkflowMode() === 'quickAdd' && this.selectedProvider()?.kind === kind;
  }

  public isCustomProviderSelected(): boolean {
    return this.providerWorkflowMode() === 'custom';
  }

  public showProviderEditor(): boolean {
    return this.isConfiguringNewProvider() || this.selectedProviderId() !== null;
  }

  public finishProviderConfiguration(): void {
    this.providerWorkflowMode.set('browse');
    this.selectedProviderId.set(null);
    this.configuredJsonProviderId.set(null);
    this.selectedEndpointId.set(null);
    this.accordions.update((accordions) => ({ ...accordions, configured: true }));
  }
  public getPresetColorClasses(kind: string): string {
    switch (kind) {
      case 'openai': return 'bg-emerald-900/30 border-emerald-800/50 group-hover:bg-emerald-900/50 text-emerald-400';
      case 'anthropic': return 'bg-amber-900/30 border-amber-800/50 group-hover:bg-amber-900/50 text-amber-500';
      case 'openrouter': return 'bg-blue-900/30 border-blue-800/50 group-hover:bg-blue-900/50 text-blue-400';
      case 'lm_studio': return 'bg-emerald-900/30 border-emerald-800/50 group-hover:bg-emerald-900/50 text-emerald-400';
      default: return 'bg-white/5 border-white/10 text-zinc-400';
    }
  }

  public getRoleBgClass(role: string): string {
    switch (role) {
      case 'primary': return 'bg-emerald-500';
      case 'backup': return 'bg-amber-500';
      default: return 'bg-zinc-600';
    }
  }

  public getRoleTextClass(role: string): string {
    switch (role) {
      case 'primary': return 'text-emerald-400';
      case 'backup': return 'text-amber-500';
      default: return 'text-zinc-500';
    }
  }

  public getHttpMethodClasses(method: string): string {
    switch (method) {
      case 'GET':
        return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300';
      case 'POST':
        return 'border-cyan-500/30 bg-cyan-500/10 text-cyan-200';
      default:
        return 'border-white/10 bg-white/5 text-zinc-300';
    }
  }

  public readonly providerConfigService = inject(ProviderConfigService);
  private readonly selectedProviderId = signal<string | null>(null);
  private readonly configuredJsonProviderId = signal<string | null>(null);
  public readonly selectedEndpointId = signal<string | null>(null);
  public readonly viewMode = signal<'grid' | 'list'>('grid');
  public readonly selectedProvider = computed(
    () => this.providers().find((provider) => provider.id === this.selectedProviderId()) ?? null,
  );

  public readonly activeEndpoint = computed(() => {
    const provider = this.selectedProvider();
    if (!provider || provider.apiSurface.endpoints.length === 0) return null;
    const id = this.selectedEndpointId();
    if (id) {
      const found = provider.apiSurface.endpoints.find(e => e.id === id);
      if (found) return found;
    }
    return provider.apiSurface.endpoints[0];
  });

  public providers(): ProviderConfig[] {
    return this.providerConfigService.providers();
  }

  public presets(): ProviderPreset[] {
    return this.providerConfigService.presets();
  }

  public primaryProvider(): ProviderConfig | null {
    return this.providerConfigService.primaryProvider();
  }

  public healthyFailoverCount(): number {
    return this.providerConfigService.healthyFailoverProviders().length;
  }

  public setPrimary(providerId: string): void {
    this.providerConfigService.setPrimary(providerId);
  }

  public setBackup(providerId: string): void {
    this.providerConfigService.setBackup(providerId);
  }

  public disable(providerId: string): void {
    this.providerConfigService.disable(providerId);
  }

  public setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode.set(mode);
  }

  public selectProvider(providerId: string): void {
    this.providerWorkflowMode.set('browse');
    this.selectedProviderId.set(providerId);
    this.configuredJsonProviderId.set(null);
    this.selectedEndpointId.set(null);
  }

  public addPreset(kind: ProviderPreset['kind']): void {
    const providerId = this.providerConfigService.addProviderFromPreset(kind);
    this.providerWorkflowMode.set('quickAdd');
    this.accordions.set({
      quickAdd: true,
      configured: false,
      custom: false,
    });
    this.selectedProviderId.set(providerId);
    this.configuredJsonProviderId.set(null);
    this.selectedEndpointId.set(null);
  }

  public addCustomProvider(): void {
    const providerId = this.providerConfigService.addCustomProvider();
    this.providerWorkflowMode.set('custom');
    this.accordions.set({
      quickAdd: false,
      configured: false,
      custom: true,
    });
    this.selectedProviderId.set(providerId);
    this.configuredJsonProviderId.set(null);
    this.selectedEndpointId.set(null);
  }

  public toggleConfiguredJson(providerId: string): void {
    this.configuredJsonProviderId.update((current) => (current === providerId ? null : providerId));
  }

  public isConfiguredJsonVisible(providerId: string): boolean {
    return this.configuredJsonProviderId() === providerId;
  }

  public configuredProviderJson(providerId: string): string {
    return this.providerConfigService.serializeConfiguredProvider(providerId) ?? '{}';
  }

  public updateProviderField(
    providerId: string,
    field: 'name' | 'baseUrl' | 'model' | 'apiKey' | 'description',
    value: string,
  ): void {
    this.providerConfigService.updateProvider(providerId, { [field]: value } as Partial<ProviderConfig>);
  }

  public updateProviderTemplate(providerId: string, requestTemplate: string): void {
    const provider = this.providers().find((candidate) => candidate.id === providerId);
    if (!provider) {
      return;
    }

    this.providerConfigService.updateProvider(providerId, {
      template: {
        ...provider.template,
        requestTemplate,
      },
    });
  }

  public updateProviderPlaceholders(providerId: string, rawValue: string): void {
    const provider = this.providers().find((candidate) => candidate.id === providerId);
    if (!provider) {
      return;
    }

    const placeholders = rawValue
      .split(/[\s,]+/)
      .map((value) => value.trim())
      .filter(Boolean);

    this.providerConfigService.updateProvider(providerId, {
      template: {
        ...provider.template,
        placeholders,
      },
    });
  }

  public updateProviderApiEndpointTemplate(providerId: string, endpointId: string, requestTemplate: string): void {
    const provider = this.providers().find((candidate) => candidate.id === providerId);
    if (!provider) {
      return;
    }

    this.providerConfigService.updateProvider(providerId, {
      apiSurface: {
        ...provider.apiSurface,
        endpoints: provider.apiSurface.endpoints.map((endpoint) =>
          endpoint.id === endpointId ? { ...endpoint, requestTemplate } : endpoint,
        ),
      },
    });
  }

  public updateProviderApiEndpointExample(providerId: string, endpointId: string, requestExample: string): void {
    const provider = this.providers().find((candidate) => candidate.id === providerId);
    if (!provider) {
      return;
    }

    this.providerConfigService.updateProvider(providerId, {
      apiSurface: {
        ...provider.apiSurface,
        endpoints: provider.apiSurface.endpoints.map((endpoint) =>
          endpoint.id === endpointId ? { ...endpoint, requestExample } : endpoint,
        ),
      },
    });
  }

  public updateProviderApiEndpointPlaceholders(providerId: string, endpointId: string, rawValue: string): void {
    const provider = this.providers().find((candidate) => candidate.id === providerId);
    if (!provider) {
      return;
    }

    const placeholders = rawValue
      .split(/[\s,]+/)
      .map((value) => value.trim())
      .filter(Boolean);

    this.providerConfigService.updateProvider(providerId, {
      apiSurface: {
        ...provider.apiSurface,
        endpoints: provider.apiSurface.endpoints.map((endpoint) =>
          endpoint.id === endpointId ? { ...endpoint, placeholders } : endpoint,
        ),
      },
    });
  }

  public applyModelSuggestion(providerId: string, model: string): void {
    this.providerConfigService.updateProvider(providerId, { model });
  }

  public canRemoveProvider(providerId: string): boolean {
    return this.providerConfigService.canRemoveProvider(providerId);
  }

  public resetProvider(providerId: string): void {
    this.providerConfigService.resetProviderConfiguration(providerId);
  }

  public removeProvider(providerId: string): void {
    const didRemove = this.providerConfigService.removeProvider(providerId);
    if (!didRemove) {
      return;
    }

    if (this.configuredJsonProviderId() === providerId) {
      this.configuredJsonProviderId.set(null);
    }
    this.selectedProviderId.set(this.providers()[0]?.id ?? null);
    this.selectedEndpointId.set(null);
    this.providerWorkflowMode.set('browse');
  }

  public readInputValue(event: Event): string {
    return (event.target as HTMLInputElement | HTMLTextAreaElement).value;
  }

  public placeholderEditorValue(provider: ProviderConfig): string {
    return provider.template.placeholders.join(', ');
  }

  public endpointPlaceholdersValue(placeholders: string[]): string {
    return placeholders.join(', ');
  }

  public selectEndpoint(endpointId: string): void {
    this.selectedEndpointId.set(endpointId);
  }

  public describeRole(provider: ProviderConfig): string {
    return this.providerConfigService.describeRole(provider.id);
  }

  public getHealthBadge(provider: ProviderConfig): BadgeStatus {
    return this.providerConfigService.getHealthTone(provider.health);
  }
}

@Component({
  selector: 'screen-policy',
  standalone: true,
  imports: [CommonModule, UiIconComponent, UiBadgeComponent],
  template: `
    <div class="space-y-6 animate-fade-in max-w-7xl mx-auto pb-12">
      <div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 class="text-2xl font-light text-white tracking-tight flex items-center gap-3">
            <ui-icon name="shield" cssClass="text-violet-400" [size]="28"></ui-icon> Governance & Policy
          </h2>
          <p class="text-sm text-zinc-400 mt-1 pl-10">
            Define execution boundaries, approval requirements, and risk mitigation strategies for AI agents.
          </p>
        </div>
        <div class="flex items-center gap-3">
          <button
            type="button"
            aria-disabled="true"
            title="Planned follow-up: audit-log navigation is not implemented in this PoC."
            class="px-4 py-2 rounded-lg border border-white/5 bg-white/[0.03] text-sm font-medium text-zinc-500 cursor-not-allowed opacity-70">
            Audit Logs (Planned)
          </button>
          <button
            type="button"
            aria-disabled="true"
            title="Planned follow-up: policy creation flow is not implemented in this PoC."
            class="px-4 py-2 rounded-lg border border-violet-500/20 bg-violet-500/10 text-violet-200/70 text-sm font-medium cursor-not-allowed opacity-70 flex items-center gap-2">
            <ui-icon name="plus" [size]="16"></ui-icon> Create Policy (Planned)
          </button>
        </div>
      </div>

      <div class="rounded-2xl border border-violet-500/15 bg-violet-500/5 px-4 py-3 text-sm text-violet-100/80 flex items-start gap-3">
        <ui-icon name="shield" [size]="16" cssClass="text-violet-300 mt-0.5"></ui-icon>
        <div class="leading-6">
          This Policy Center slice is a local governance PoC. Policy inspection and local policy editing are active here;
          audit-log navigation and policy creation remain planned follow-up flows.
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 items-start mt-6">
        <div class="space-y-4">
          <div class="bg-[#0f0f13] border border-white/5 rounded-2xl p-5 shadow-lg">
            <h3 class="text-lg font-medium text-white mb-4">Active Policies</h3>
            <div class="space-y-3">
              <div *ngFor="let policy of policies()" class="group bg-[#0a0a0d] border border-white/5 hover:border-violet-500/30 rounded-xl p-4 transition-all cursor-pointer shadow-sm relative overflow-hidden" (click)="selectPolicy(policy.id)" [ngClass]="{'border-violet-500/50 bg-violet-500/5': selectedPolicyId() === policy.id}">
                <div *ngIf="selectedPolicyId() === policy.id" class="absolute left-0 top-0 bottom-0 w-1 bg-violet-500"></div>
                <div class="flex items-start justify-between gap-4">
                  <div class="flex items-start gap-4">
                    <div class="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mt-1 group-hover:bg-white/10 transition-colors" [ngClass]="{'text-red-400': policy.riskLevel === 'Critical', 'text-amber-400': policy.riskLevel === 'High', 'text-blue-400': policy.riskLevel === 'Medium', 'text-emerald-400': policy.riskLevel === 'Low'}">
                      <ui-icon [name]="policy.icon" [size]="20"></ui-icon>
                    </div>
                    <div>
                      <h4 class="text-base font-medium text-zinc-100 group-hover:text-white transition-colors">{{ policy.name }}</h4>
                      <p class="text-sm text-zinc-400 mt-1 line-clamp-2 leading-relaxed">{{ policy.description }}</p>
                      <div class="flex flex-wrap items-center gap-2 mt-3">
                        <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-zinc-300">
                          {{ policy.action }}
                        </span>
                        <span *ngFor="let tag of policy.tags" class="text-xs text-zinc-500 flex items-center gap-1 before:content-['#'] before:text-zinc-600">
                          {{ tag }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="flex flex-col items-end gap-2 shrink-0">
                    <ui-badge [status]="getPolicyStatusBadge(policy.status)">{{ policy.status }}</ui-badge>
                    <div class="text-[10px] uppercase tracking-wider font-bold mt-2" [ngClass]="getRiskColor(policy.riskLevel)">
                      {{ policy.riskLevel }} Risk
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside class="sticky top-24 space-y-6">
          <div *ngIf="draftPolicy() as draft; else emptySelection" class="bg-[#0a0a0d] border border-violet-500/20 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
             <div class="absolute -right-10 -top-10 w-40 h-40 bg-violet-500/10 blur-3xl rounded-full pointer-events-none"></div>

             <div class="flex items-center justify-between mb-6 relative z-10">
               <h3 class="text-lg font-medium text-white flex items-center gap-2">
                 <ui-icon name="settings" [size]="18" cssClass="text-violet-400"></ui-icon> Policy Details
               </h3>
               <button class="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white" (click)="closeDetails()" aria-label="Close details">
                 <ui-icon name="x" [size]="16"></ui-icon>
               </button>
             </div>

             <div class="space-y-6 relative z-10">
               <div>
                 <label class="block text-xs uppercase tracking-wider text-zinc-500 mb-2">Policy Name</label>
                 <input type="text" [value]="draft.name" (input)="handleNameInput($event)" class="w-full bg-[#050508] border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-violet-500/50 transition-colors">
               </div>

               <div>
                 <label class="block text-xs uppercase tracking-wider text-zinc-500 mb-2">Description</label>
                 <textarea rows="3" [value]="draft.description" (input)="handleDescriptionInput($event)" class="w-full bg-[#050508] border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-violet-500/50 transition-colors"></textarea>
               </div>

               <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs uppercase tracking-wider text-zinc-500 mb-2">Risk Level</label>
                    <select [value]="draft.riskLevel" (change)="handleRiskLevelChange($event)" class="w-full bg-[#050508] border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-violet-500/50 appearance-none">
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs uppercase tracking-wider text-zinc-500 mb-2">Action</label>
                    <select [value]="draft.action" (change)="handleActionChange($event)" class="w-full bg-[#050508] border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-violet-500/50 appearance-none">
                      <option value="Auto-Approve">Auto-Approve</option>
                      <option value="Require Review">Require Review</option>
                      <option value="Simulate">Simulate</option>
                      <option value="Block">Block</option>
                    </select>
                  </div>
               </div>

               <div class="pt-4 border-t border-white/5 flex gap-3">
                 <button
                   (click)="saveChanges()"
                   [disabled]="!hasUnsavedChanges()"
                   class="flex-1 py-2 rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                   [ngClass]="hasUnsavedChanges() ? 'bg-violet-600 hover:bg-violet-500 text-white' : 'bg-violet-600/40 text-white/70'">
                   Save Changes
                 </button>
                 <button
                   (click)="cancelChanges()"
                   [disabled]="!hasUnsavedChanges()"
                   class="px-4 py-2 border rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                   [ngClass]="hasUnsavedChanges() ? 'border-white/10 hover:bg-white/5 text-zinc-300' : 'border-white/5 text-zinc-500'">
                   Cancel
                 </button>
               </div>
             </div>
          </div>

          <ng-template #emptySelection>
            <div class="bg-violet-500/5 border border-violet-500/10 rounded-2xl p-6 text-center shadow-inner">
              <div class="w-12 h-12 bg-violet-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-violet-400">
                <ui-icon name="shield" [size]="24"></ui-icon>
              </div>
              <h3 class="text-zinc-200 font-medium mb-2">No Policy Selected</h3>
              <p class="text-sm text-zinc-400 leading-relaxed">Select a policy from the list to view or edit its rules, risk level, and required actions.</p>
            </div>
          </ng-template>
        </aside>
      </div>
    </div>
  `,
})
export class PolicyScreen {
  private readonly state = new PolicyScreenState(MOCK_POLICIES);
  public readonly policies = this.state.policies;
  public readonly selectedPolicyId = this.state.selectedPolicyId;
  public readonly draftPolicy = this.state.draftPolicy;
  public readonly selectedPolicy = this.state.selectedPolicy;
  public readonly hasUnsavedChanges = this.state.hasUnsavedChanges;

  public selectPolicy(policyId: string): void {
    this.state.selectPolicy(policyId);
  }

  public closeDetails(): void {
    this.state.closeDetails();
  }

  public updateDraftName(name: string): void {
    this.state.updateDraftName(name);
  }

  public handleNameInput(event: Event): void {
    this.updateDraftName(this.readInputValue(event));
  }

  public updateDraftDescription(description: string): void {
    this.state.updateDraftDescription(description);
  }

  public handleDescriptionInput(event: Event): void {
    this.updateDraftDescription(this.readInputValue(event));
  }

  public updateDraftRiskLevel(riskLevel: Policy['riskLevel']): void {
    this.state.updateDraftRiskLevel(riskLevel);
  }

  public handleRiskLevelChange(event: Event): void {
    this.updateDraftRiskLevel(this.readSelectValue(event) as Policy['riskLevel']);
  }

  public updateDraftAction(action: Policy['action']): void {
    this.state.updateDraftAction(action);
  }

  public handleActionChange(event: Event): void {
    this.updateDraftAction(this.readSelectValue(event) as Policy['action']);
  }

  public saveChanges(): void {
    this.state.saveChanges();
  }

  public cancelChanges(): void {
    this.state.cancelChanges();
  }

  public getPolicyStatusBadge(status: Policy['status']): BadgeStatus {
    return status === 'active' ? 'active' : 'idle';
  }

  public getRiskColor(riskLevel: Policy['riskLevel']): string {
    switch (riskLevel) {
      case 'Critical': return 'text-red-400';
      case 'High': return 'text-amber-400';
      case 'Medium': return 'text-blue-400';
      case 'Low': return 'text-emerald-400';
      default: return 'text-zinc-400';
    }
  }

  private readInputValue(event: Event): string {
    return (event.target as HTMLInputElement | HTMLTextAreaElement).value;
  }

  private readSelectValue(event: Event): string {
    return (event.target as HTMLSelectElement).value;
  }
}

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
  template: `
    <div class="min-h-screen bg-[#050505] text-zinc-300 font-sans flex flex-col selection:bg-cyan-500/30 selection:text-cyan-100 relative overflow-hidden">
      <header class="h-14 border-b border-white/5 bg-[#0a0a0d]/80 backdrop-blur-md flex items-center justify-between px-4 z-50 sticky top-0">
        <div class="flex items-center gap-8">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded bg-gradient-to-br from-cyan-400 to-violet-600 flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.3)]">
              <div class="w-3 h-3 bg-[#050505] rounded-full"></div>
            </div>
            <span class="font-bold text-lg tracking-tight text-white shadow-sm">MAGNETAR<span class="font-light text-zinc-400 ml-1">EIDOLON</span></span>
          </div>
          <nav class="hidden md:flex gap-1 bg-white/[0.03] p-1 rounded-lg border border-white/5">
            <ng-container *ngFor="let tab of tabs">
              <a
                [routerLink]="tab.route"
                routerLinkActive="bg-white/10 text-white shadow-sm"
                #activeLink="routerLinkActive"
                [routerLinkActiveOptions]="{ exact: true }"
                [ngClass]="activeLink.isActive ? 'bg-white/10 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'"
                class="px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2">
                <ui-icon [name]="tab.icon" [size]="14"></ui-icon>
                {{ tab.label }}
              </a>
            </ng-container>
          </nav>
        </div>
      </header>

      <main class="flex-1 overflow-auto p-6 relative z-10 custom-scrollbar">
        <router-outlet></router-outlet>
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
