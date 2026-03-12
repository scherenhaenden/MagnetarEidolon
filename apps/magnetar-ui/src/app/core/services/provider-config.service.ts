import { Injectable, computed, signal } from '@angular/core';

import {
  ProviderConfig,
  ProviderHealth,
  ProviderPreset,
  ProviderRole,
  describeProviderRole,
  sortProvidersByPriority,
} from '../models/provider-config.js';

const STORAGE_KEY = 'magnetar.provider-config.v1';

const PROVIDER_PRESETS: ProviderPreset[] = [
  {
    kind: 'lm_studio',
    label: 'LM Studio Local',
    description: 'Local OpenAI-compatible provider for development and smoke validation.',
    baseUrl: 'http://127.0.0.1:1234/v1',
    defaultModel: 'local-model',
    apiStyle: 'openai-compatible',
    supportsApiKey: false,
    ownership: 'backend',
    template: {
      requestTemplate: `{
  "model": "$model",
  "messages": "$messages",
  "stream": "$stream"
}`,
      placeholders: ['$model', '$messages', '$stream'],
    },
  },
  {
    kind: 'openrouter',
    label: 'OpenRouter',
    description: 'Cloud router with backend-owned key handling and OpenAI-compatible streaming.',
    baseUrl: 'https://openrouter.ai/api/v1',
    defaultModel: 'openai/gpt-4.1-mini',
    apiStyle: 'openai-compatible',
    supportsApiKey: true,
    ownership: 'backend',
    suggestedHeaders: ['HTTP-Referer', 'X-Title'],
    template: {
      requestTemplate: `{
  "model": "$model",
  "messages": "$messages",
  "stream": "$stream"
}`,
      placeholders: ['$model', '$messages', '$stream'],
    },
  },
  {
    kind: 'openai',
    label: 'OpenAI Cloud',
    description: 'Known hosted provider preset with OpenAI-compatible request semantics.',
    baseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4.1-mini',
    apiStyle: 'openai-compatible',
    supportsApiKey: true,
    ownership: 'backend',
    template: {
      requestTemplate: `{
  "model": "$model",
  "messages": "$messages",
  "stream": "$stream"
}`,
      placeholders: ['$model', '$messages', '$stream'],
    },
  },
  {
    kind: 'anthropic',
    label: 'Anthropic',
    description: 'Known hosted provider preset for future native request support.',
    baseUrl: 'https://api.anthropic.com',
    defaultModel: 'claude-3-7-sonnet-latest',
    apiStyle: 'native',
    supportsApiKey: true,
    ownership: 'backend',
    template: {
      requestTemplate: `{
  "model": "$model",
  "prompt": "$prompt",
  "stream": "$stream"
}`,
      placeholders: ['$model', '$prompt', '$stream'],
    },
  },
];

const DEFAULT_PROVIDERS: ProviderConfig[] = [
  createProviderFromPreset('provider-lmstudio', PROVIDER_PRESETS[0], 'primary', 1, 'healthy'),
  createProviderFromPreset('provider-openai', PROVIDER_PRESETS[2], 'backup', 2, 'unknown'),
  createProviderFromPreset('provider-openrouter', PROVIDER_PRESETS[1], 'disabled', 3, 'unknown'),
  createProviderFromPreset('provider-anthropic', PROVIDER_PRESETS[3], 'disabled', 4, 'offline'),
];

@Injectable({
  providedIn: 'root',
})
export class ProviderConfigService {
  private static readonly fallbackStorage = new Map<string, string>();
  private readonly providerState = signal<ProviderConfig[]>(this.loadProviders());

  public readonly providers = computed(() => sortProvidersByPriority(this.providerState()));
  public readonly presets = computed(() => PROVIDER_PRESETS);
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

  public addProviderFromPreset(kind: ProviderPreset['kind']): string {
    const preset = PROVIDER_PRESETS.find((candidate) => candidate.kind === kind);
    if (!preset) {
      throw new Error(`Unknown provider preset: ${kind}`);
    }

    const providerId = `provider-${kind}-${Date.now()}`;
    const nextPriority = this.nextAvailablePriority();

    this.providerState.update((providers) => [
      ...providers,
      createProviderFromPreset(providerId, preset, 'disabled', nextPriority, 'unknown'),
    ]);
    this.normalizePriorities();
    return providerId;
  }

  public updateProvider(providerId: string, patch: Partial<ProviderConfig>): void {
    this.providerState.update((providers) =>
      providers.map((provider) => {
        if (provider.id !== providerId) {
          return provider;
        }

        return {
          ...provider,
          ...patch,
          id: provider.id,
        };
      }),
    );
    this.persistProviders();
  }

  public removeProvider(providerId: string): boolean {
    const target = this.providerState().find((provider) => provider.id === providerId);
    if (!target) {
      return false;
    }

    this.providerState.update((providers) => providers.filter((provider) => provider.id !== providerId));
    this.ensurePrimaryExists();
    this.normalizePriorities();
    return true;
  }

  public getPreset(kind: ProviderPreset['kind']): ProviderPreset | null {
    return PROVIDER_PRESETS.find((preset) => preset.kind === kind) ?? null;
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

  public static resetTestStorage(): void {
    ProviderConfigService.fallbackStorage.delete(STORAGE_KEY);
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
      orderedProviders.find((provider) => provider.role !== 'disabled');

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
    this.persistProviders();
  }

  private nextAvailablePriority(): number {
    const providers = this.providerState();
    const activePriorities = providers
      .filter((provider) => provider.role !== 'disabled')
      .map((provider) => provider.priority);
    return Math.max(2, ...activePriorities, 1) + 1;
  }

  private loadProviders(): ProviderConfig[] {
    try {
      const rawValue = this.readStorageValue(STORAGE_KEY);
      if (!rawValue) {
        return DEFAULT_PROVIDERS;
      }

      const parsed = JSON.parse(rawValue) as ProviderConfig[];
      if (!Array.isArray(parsed) || parsed.length === 0) {
        return DEFAULT_PROVIDERS;
      }

      return parsed;
    } catch {
      return DEFAULT_PROVIDERS;
    }
  }

  private persistProviders(): void {
    this.writeStorageValue(STORAGE_KEY, JSON.stringify(this.providerState()));
  }

  private readStorageValue(key: string): string | null {
    try {
      return globalThis.localStorage?.getItem(key) ?? ProviderConfigService.fallbackStorage.get(key) ?? null;
    } catch {
      return ProviderConfigService.fallbackStorage.get(key) ?? null;
    }
  }

  private writeStorageValue(key: string, value: string): void {
    try {
      globalThis.localStorage?.setItem(key, value);
    } catch {
      ProviderConfigService.fallbackStorage.set(key, value);
      return;
    }

    ProviderConfigService.fallbackStorage.set(key, value);
  }
}

function createProviderFromPreset(
  id: string,
  preset: ProviderPreset,
  role: ProviderRole,
  priority: number,
  health: ProviderHealth,
): ProviderConfig {
  return {
    id,
    name: preset.label,
    kind: preset.kind,
    baseUrl: preset.baseUrl,
    model: preset.defaultModel,
    role,
    priority,
    health,
    apiStyle: preset.apiStyle,
    apiKey: '',
    description: preset.description,
    template: preset.template,
    supportsApiKey: preset.supportsApiKey,
    ownership: preset.ownership,
    presetKind: preset.kind,
  };
}
