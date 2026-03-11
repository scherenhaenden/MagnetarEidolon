import { computed, signal } from '@angular/core';

import {
  ProviderConfig,
  ProviderHealth,
  describeProviderRole,
  sortProvidersByPriority,
} from '../models/provider-config.js';

const INITIAL_PROVIDERS: ProviderConfig[] = [
  {
    id: 'provider-lmstudio',
    name: 'LM Studio Local',
    kind: 'lm_studio',
    baseUrl: 'http://127.0.0.1:1234/api/v1',
    model: 'llama-3.2-3b-instruct',
    role: 'primary',
    priority: 1,
    health: 'healthy',
    apiStyle: 'native',
  },
  {
    id: 'provider-openai',
    name: 'OpenAI Cloud',
    kind: 'openai',
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4.1-mini',
    role: 'backup',
    priority: 2,
    health: 'unknown',
    apiStyle: 'openai-compatible',
  },
  {
    id: 'provider-anthropic',
    name: 'Anthropic Fallback',
    kind: 'anthropic',
    baseUrl: 'https://api.anthropic.com',
    model: 'claude-3-7-sonnet-latest',
    role: 'disabled',
    priority: 3,
    health: 'offline',
    apiStyle: 'native',
  },
];

export class ProviderConfigService {
  private readonly providerState = signal<ProviderConfig[]>(INITIAL_PROVIDERS);

  public readonly providers = computed(() => sortProvidersByPriority(this.providerState()));
  public readonly primaryProvider = computed(
    () => this.providers().find((provider) => provider.role === 'primary') ?? null,
  );
  public readonly backupProviders = computed(() =>
    this.providers().filter((provider) => provider.role === 'backup'),
  );
  public readonly healthyFailoverProviders = computed(() =>
    this.backupProviders().filter((provider) => provider.health !== 'offline'),
  );

  public setPrimary(providerId: string): void {
    this.providerState.update((providers) =>
      providers.map((provider) => {
        if (provider.id === providerId) {
          return { ...provider, role: 'primary', priority: 1 };
        }

        if (provider.role === 'primary') {
          return { ...provider, role: 'backup', priority: 2 };
        }

        return provider.role === 'backup'
          ? { ...provider, priority: Math.max(provider.priority, 2) + 1 }
          : provider;
      }),
    );
    this.normalizePriorities();
  }

  public setBackup(providerId: string): void {
    const wasPrimary = this.providerState().some(
      (provider) => provider.id === providerId && provider.role === 'primary',
    );

    this.providerState.update((providers) =>
      providers.map((provider) =>
        provider.id === providerId
          ? {
              ...provider,
              role: 'backup',
              priority: provider.role === 'primary' ? 2 : provider.priority,
            }
          : provider,
      ),
    );
    this.ensurePrimaryExists(wasPrimary ? providerId : undefined);
    this.normalizePriorities();
  }

  public disable(providerId: string): void {
    this.providerState.update((providers) =>
      providers.map((provider) =>
        provider.id === providerId
          ? { ...provider, role: 'disabled', priority: 99 }
          : provider,
      ),
    );
    this.ensurePrimaryExists();
    this.normalizePriorities();
  }

  public describeRole(providerId: string): string {
    const provider = this.providerState().find((candidate) => candidate.id === providerId);
    return provider ? describeProviderRole(provider.role) : 'Unknown';
  }

  public getHealthTone(health: ProviderHealth): 'active' | 'idle' | 'pending_approval' | 'failed' {
    switch (health) {
      case 'healthy':
        return 'active';
      case 'degraded':
        return 'pending_approval';
      case 'offline':
        return 'failed';
      case 'unknown':
      default:
        return 'idle';
    }
  }

  private ensurePrimaryExists(preferredFallbackProviderId?: string): void {
    if (this.providerState().some((provider) => provider.role === 'primary')) {
      return;
    }

    const orderedProviders = sortProvidersByPriority(this.providerState());
    const firstBackup =
      orderedProviders.find(
        (provider) =>
          provider.role === 'backup' && provider.id !== preferredFallbackProviderId,
      ) ??
      orderedProviders.find((provider) => provider.role === 'backup');

    if (!firstBackup) {
      return;
    }

    this.providerState.update((providers) =>
      providers.map((provider) =>
        provider.id === firstBackup.id ? { ...provider, role: 'primary', priority: 1 } : provider,
      ),
    );
  }

  private normalizePriorities(): void {
    const ordered = sortProvidersByPriority(this.providerState());
    let nextBackupPriority = 2;

    this.providerState.set(
      ordered.map((provider) => {
        if (provider.role === 'primary') {
          return { ...provider, priority: 1 };
        }

        if (provider.role === 'backup') {
          const normalized = { ...provider, priority: nextBackupPriority };
          nextBackupPriority += 1;
          return normalized;
        }

        return { ...provider, priority: 99 };
      }),
    );
  }
}
