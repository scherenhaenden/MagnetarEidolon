import { beforeEach, describe, expect, it } from 'vitest';

import { describeProviderRole, sortProvidersByPriority } from '../src/app/core/models/provider-config.js';
import { ProviderConfigService } from '../src/app/core/services/provider-config.service.js';

function findProviderByPreset(service: ProviderConfigService, presetKind: string) {
  return service.providers().find((provider) => provider.presetKind === presetKind && provider.origin === 'system');
}

describe('provider-config model helpers', () => {
  it('describes provider roles for the UI', () => {
    expect(describeProviderRole('primary')).toBe('Primary');
    expect(describeProviderRole('backup')).toBe('Backup');
    expect(describeProviderRole('disabled')).toBe('Disabled');
    expect(describeProviderRole('unexpected' as never)).toBe('Unknown');
  });

  it('sorts providers by ascending priority', () => {
    const providers = sortProvidersByPriority([
      {
        id: 'b',
        origin: 'user',
        runtimeProviderId: null,
        name: 'Backup',
        kind: 'openai',
        baseUrl: 'https://example.com',
        model: 'gpt',
        role: 'backup',
        priority: 2,
        health: 'unknown',
        apiStyle: 'openai-compatible',
        apiKey: '',
        description: 'Backup preset',
        template: { requestTemplate: '{}', placeholders: [] },
        supportsApiKey: true,
        ownership: 'backend',
        presetKind: 'openai',
        modelSuggestions: ['gpt'],
        apiSurface: { endpointComparison: [], endpoints: [] },
      },
      {
        id: 'a',
        origin: 'system',
        runtimeProviderId: 'provider-lmstudio',
        name: 'Primary',
        kind: 'lm_studio',
        baseUrl: 'http://localhost:1234/v1',
        model: 'llama',
        role: 'primary',
        priority: 1,
        health: 'healthy',
        apiStyle: 'openai-compatible',
        apiKey: '',
        description: 'Primary preset',
        template: { requestTemplate: '{}', placeholders: [] },
        supportsApiKey: false,
        ownership: 'backend',
        presetKind: 'lm_studio',
        modelSuggestions: ['llama'],
        apiSurface: { endpointComparison: [], endpoints: [] },
      },
    ]);

    expect(providers.map((provider) => provider.id)).toEqual(['a', 'b']);
  });
});

describe('ProviderConfigService', () => {
  beforeEach(() => {
    globalThis.localStorage?.removeItem('magnetar.provider-config.v1');
    ProviderConfigService.resetTestStorage();
  });

  it('exposes one primary provider and at least one backup by default', () => {
    const service = new ProviderConfigService();
    const openRouter = findProviderByPreset(service, 'openrouter');
    const lmStudio = findProviderByPreset(service, 'lm_studio');

    expect(service.primaryProvider()?.name).toBe('LM Studio Local');
    expect(service.primaryProvider()?.baseUrl).toBe('http://127.0.0.1:1234/v1');
    expect(service.primaryProvider()?.model).toBe('local-model');
    expect(service.primaryProvider()?.apiStyle).toBe('openai-compatible');
    expect(service.backupProviders().map((provider) => provider.name)).toContain('OpenAI Cloud');
    expect(service.healthyFailoverProviders().map((provider) => provider.name)).toEqual([
      'OpenAI Cloud',
    ]);
    expect(openRouter?.id.startsWith('provider-config-openrouter-')).toBe(true);
    expect(openRouter?.runtimeProviderId).toBe('provider-openrouter');
    expect(openRouter?.kind).toBe('openrouter');
    expect(openRouter?.template.placeholders).toContain('$model');
    expect(openRouter?.modelSuggestions.length).toBeGreaterThan(0);
    expect(openRouter?.apiSurface.endpoints.map((endpoint) => endpoint.id)).toEqual([
      'models',
      'chat',
    ]);
    expect(lmStudio?.apiSurface.endpoints.length).toBeGreaterThan(2);
  });

  it('promotes a backup provider to primary and normalizes priorities', () => {
    const service = new ProviderConfigService();
    const openAiId = findProviderByPreset(service, 'openai')?.id;
    const lmStudioId = findProviderByPreset(service, 'lm_studio')?.id;
    const anthropicId = findProviderByPreset(service, 'anthropic')?.id;

    expect(openAiId).toBeTruthy();
    service.setPrimary(openAiId!);

    expect(service.primaryProvider()?.id).toBe(openAiId);
    expect(service.providers().find((provider) => provider.id === openAiId)?.priority).toBe(1);
    expect(service.providers().find((provider) => provider.id === lmStudioId)?.role).toBe('backup');
    expect(service.providers().find((provider) => provider.id === anthropicId)?.priority).toBe(99);
  });

  it('can promote OpenRouter into the active failover chain', () => {
    const service = new ProviderConfigService();
    const openRouterId = findProviderByPreset(service, 'openrouter')?.id;

    expect(openRouterId).toBeTruthy();
    service.setBackup(openRouterId!);

    expect(service.backupProviders().map((provider) => provider.id)).toContain(openRouterId);
    expect(service.providers().find((provider) => provider.id === openRouterId)?.apiStyle).toBe(
      'openai-compatible',
    );
  });

  it('restores a primary provider when the current primary is disabled', () => {
    const service = new ProviderConfigService();
    const lmStudioId = findProviderByPreset(service, 'lm_studio')?.id;
    const openAiId = findProviderByPreset(service, 'openai')?.id;

    expect(lmStudioId).toBeTruthy();
    service.disable(lmStudioId!);

    expect(service.primaryProvider()?.id).toBe(openAiId);
    expect(service.describeRole(lmStudioId!)).toBe('Disabled');
  });

  it('can convert a disabled provider into a backup provider', () => {
    const service = new ProviderConfigService();
    const anthropicId = findProviderByPreset(service, 'anthropic')?.id;

    expect(anthropicId).toBeTruthy();
    service.setBackup(anthropicId!);

    expect(service.backupProviders().map((provider) => provider.id)).toContain(anthropicId);
  });

  it('reorders non-target backup providers when a different provider becomes primary', () => {
    const service = new ProviderConfigService();
    const anthropicId = findProviderByPreset(service, 'anthropic')?.id;
    const openAiId = findProviderByPreset(service, 'openai')?.id;

    expect(anthropicId).toBeTruthy();
    expect(openAiId).toBeTruthy();
    service.setBackup(anthropicId!);
    service.setPrimary(openAiId!);

    expect(service.providers().find((provider) => provider.id === anthropicId)?.priority).toBe(3);
  });

  it('promotes the next backup when the primary is converted into a backup', () => {
    const service = new ProviderConfigService();
    const lmStudioId = findProviderByPreset(service, 'lm_studio')?.id;
    const openAiId = findProviderByPreset(service, 'openai')?.id;

    expect(lmStudioId).toBeTruthy();
    service.setBackup(lmStudioId!);

    expect(service.primaryProvider()?.id).toBe(openAiId);
    expect(service.backupProviders().map((provider) => provider.id)).toContain(lmStudioId);
  });

  it('re-promotes the same provider when no other backup exists', () => {
    const service = new ProviderConfigService();
    const openAiId = findProviderByPreset(service, 'openai')?.id;
    const anthropicId = findProviderByPreset(service, 'anthropic')?.id;
    const lmStudioId = findProviderByPreset(service, 'lm_studio')?.id;

    service.disable(openAiId!);
    service.disable(anthropicId!);
    service.setBackup(lmStudioId!);

    expect(service.primaryProvider()?.id).toBe(lmStudioId);
    expect(service.backupProviders()).toEqual([]);
  });

  it('returns Unknown when describing a missing provider id', () => {
    const service = new ProviderConfigService();

    expect(service.describeRole('provider-missing')).toBe('Unknown');
  });

  it('can end with no primary when every provider is disabled', () => {
    const service = new ProviderConfigService();
    const lmStudioId = findProviderByPreset(service, 'lm_studio')?.id;
    const openAiId = findProviderByPreset(service, 'openai')?.id;
    const anthropicId = findProviderByPreset(service, 'anthropic')?.id;

    service.disable(lmStudioId!);
    service.disable(openAiId!);
    service.disable(anthropicId!);

    expect(service.primaryProvider()).toBeNull();
    expect(service.backupProviders()).toEqual([]);
  });

  it('maps health values to badge tones', () => {
    const service = new ProviderConfigService();

    expect(service.getHealthTone('healthy')).toBe('active');
    expect(service.getHealthTone('degraded')).toBe('pending_approval');
    expect(service.getHealthTone('offline')).toBe('failed');
    expect(service.getHealthTone('unknown')).toBe('idle');
  });

  it('can add a configurable provider from a preset', () => {
    const service = new ProviderConfigService();

    const providerId = service.addProviderFromPreset('openrouter');

    expect(service.providers().some((provider) => provider.id === providerId)).toBe(true);
    expect(service.providers().find((provider) => provider.id === providerId)?.presetKind).toBe('openrouter');
  });

  it('falls back to a timestamp-based id when crypto.randomUUID is unavailable', () => {
    const service = new ProviderConfigService();
    const originalCrypto = globalThis.crypto;

    Object.defineProperty(globalThis, 'crypto', {
      configurable: true,
      value: {},
    });

    try {
      const providerId = service.addProviderFromPreset('custom');
      expect(providerId.startsWith('provider-config-custom-')).toBe(true);
    } finally {
      Object.defineProperty(globalThis, 'crypto', {
        configurable: true,
        value: originalCrypto,
      });
    }
  });

  it('falls back to an empty modelSuggestions list when a preset omits suggestions', () => {
    const service = new ProviderConfigService();
    const targetPreset = service.presets().find((preset) => preset.kind === 'custom');
    const originalSuggestions = targetPreset?.modelSuggestions;

    if (targetPreset) {
      targetPreset.modelSuggestions = undefined;
    }

    try {
      const providerId = service.addProviderFromPreset('custom');
      expect(service.providers().find((provider) => provider.id === providerId)?.modelSuggestions).toEqual([]);
    } finally {
      if (targetPreset) {
        targetPreset.modelSuggestions = originalSuggestions;
      }
    }
  });

  it('throws for an unknown provider preset id', () => {
    const service = new ProviderConfigService();
    expect(() => service.addProviderFromPreset('ollama')).toThrow('Unknown provider preset: ollama');
  });

  it('can update editable provider fields', () => {
    const service = new ProviderConfigService();
    const openRouterId = findProviderByPreset(service, 'openrouter')?.id;

    service.updateProvider(openRouterId!, {
      name: 'OpenRouter Custom',
      baseUrl: 'https://openrouter.example/api/v1',
      model: 'anthropic/claude-3.7-sonnet',
      apiKey: 'secret',
    });

    expect(service.providers().find((provider) => provider.id === openRouterId)).toMatchObject({
      name: 'OpenRouter Custom',
      baseUrl: 'https://openrouter.example/api/v1',
      model: 'anthropic/claude-3.7-sonnet',
      apiKey: 'secret',
      runtimeProviderId: 'provider-openrouter',
    });
  });

  it('can add a fully custom provider shell', () => {
    const service = new ProviderConfigService();

    const providerId = service.addCustomProvider();
    const provider = service.providers().find((candidate) => candidate.id === providerId);

    expect(provider?.kind).toBe('custom');
    expect(provider?.presetKind).toBe('custom');
    expect(provider?.template.placeholders).toContain('$model');
  });

  it('returns preset metadata when it exists and null when it does not', () => {
    const service = new ProviderConfigService();

    expect(service.getPreset('openrouter')?.label).toBe('OpenRouter');
    expect(service.getPreset('ollama')).toBeNull();
  });

  it('falls back to defaults when persisted provider state is malformed or empty', () => {
    globalThis.localStorage?.setItem('magnetar.provider-config.v1', '{"broken":');
    expect(new ProviderConfigService().providers()).toHaveLength(4);

    globalThis.localStorage?.setItem('magnetar.provider-config.v1', '[]');
    expect(new ProviderConfigService().providers()).toHaveLength(4);

    globalThis.localStorage?.setItem('magnetar.provider-config.v1', '{}');
    expect(new ProviderConfigService().providers()).toHaveLength(4);

    globalThis.localStorage?.setItem('magnetar.provider-config.v1', 'null');
    expect(new ProviderConfigService().providers()).toHaveLength(4);
  });

  it('falls back to defaults when a real storage read returns an empty provider array', () => {
    const originalLocalStorage = globalThis.localStorage;
    const entries = new Map<string, string>([['magnetar.provider-config.v1', '[]']]);

    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: {
        getItem(key: string) {
          return entries.get(key) ?? null;
        },
        setItem(key: string, value: string) {
          entries.set(key, value);
        },
        removeItem(key: string) {
          entries.delete(key);
        },
      },
    });

    try {
      expect(new ProviderConfigService().providers()).toHaveLength(4);
    } finally {
      Object.defineProperty(globalThis, 'localStorage', {
        configurable: true,
        value: originalLocalStorage,
      });
    }
  });

  it('uses fallback storage paths when localStorage access fails', () => {
    const originalLocalStorage = globalThis.localStorage;

    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      get() {
        throw new Error('localStorage unavailable');
      },
    });

    try {
      const firstService = new ProviderConfigService();
      const openRouterId = findProviderByPreset(firstService, 'openrouter')?.id;
      firstService.updateProvider(openRouterId!, { name: 'Fallback Router' });

      const secondService = new ProviderConfigService();
      expect(findProviderByPreset(secondService, 'openrouter')?.name).toBe(
        'Fallback Router',
      );
    } finally {
      Object.defineProperty(globalThis, 'localStorage', {
        configurable: true,
        value: originalLocalStorage,
      });
    }
  });

  it('falls back to defaults when fallback storage contains malformed provider JSON', () => {
    const originalLocalStorage = globalThis.localStorage;

    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      get() {
        throw new Error('localStorage unavailable');
      },
    });

    try {
      ProviderConfigService.resetTestStorage();
      const firstService = new ProviderConfigService();
      const openRouterId = findProviderByPreset(firstService, 'openrouter')?.id;
      firstService.updateProvider(openRouterId!, { name: 'Fallback Router' });
      ProviderConfigService.resetTestStorage();
      const brokenStorageService = new ProviderConfigService();
      (brokenStorageService as any).writeStorageValue('magnetar.provider-config.v1', '{broken');

      const secondService = new ProviderConfigService();
      expect(secondService.providers()).toHaveLength(4);
    } finally {
      Object.defineProperty(globalThis, 'localStorage', {
        configurable: true,
        value: originalLocalStorage,
      });
    }
  });

  it('can remove a provider entry', () => {
    const service = new ProviderConfigService();
    const providerId = service.addProviderFromPreset('anthropic');

    expect(service.canRemoveProvider(providerId)).toBe(true);
    expect(service.removeProvider(providerId)).toBe(true);
    expect(service.providers().some((provider) => provider.id === providerId)).toBe(false);
  });

  it('does not allow removing the built-in provider catalog entries', () => {
    const service = new ProviderConfigService();
    const openRouterId = findProviderByPreset(service, 'openrouter')?.id;

    expect(service.canRemoveProvider(openRouterId!)).toBe(false);
    expect(service.removeProvider(openRouterId!)).toBe(false);
    expect(service.providers().some((provider) => provider.id === openRouterId)).toBe(true);
  });

  it('returns false when removing a missing provider entry', () => {
    const service = new ProviderConfigService();
    expect(service.removeProvider('provider-missing')).toBe(false);
  });

  it('returns false when resetting a missing provider entry', () => {
    const service = new ProviderConfigService();
    expect(service.resetProviderConfiguration('provider-missing')).toBe(false);
  });

  it('serializes the final configured provider JSON for an existing provider instance', () => {
    const service = new ProviderConfigService();
    const openRouterId = findProviderByPreset(service, 'openrouter')?.id;

    const serialized = service.serializeConfiguredProvider(openRouterId!);

    expect(serialized).toBeTruthy();
    expect(JSON.parse(serialized!)).toMatchObject({
      id: openRouterId,
      origin: 'system',
      runtimeProviderId: 'provider-openrouter',
      kind: 'openrouter',
      baseUrl: 'https://openrouter.ai/api/v1',
      model: 'openai/gpt-4.1-mini',
      presetKind: 'openrouter',
    });
  });

  it('returns null when serializing a missing provider instance', () => {
    const service = new ProviderConfigService();
    expect(service.serializeConfiguredProvider('provider-missing')).toBeNull();
  });

  it('can reset a built-in provider configuration without deleting the provider entry', () => {
    const service = new ProviderConfigService();
    const openRouterId = findProviderByPreset(service, 'openrouter')?.id;

    service.updateProvider(openRouterId!, {
      name: 'Overridden Router',
      baseUrl: 'https://override.example/api/v1',
      model: 'override/model',
      apiKey: 'secret',
    });

    expect(service.resetProviderConfiguration(openRouterId!)).toBe(true);
    expect(service.providers().find((provider) => provider.id === openRouterId)).toMatchObject({
      name: 'OpenRouter',
      baseUrl: 'https://openrouter.ai/api/v1',
      model: 'openai/gpt-4.1-mini',
      apiKey: '',
      origin: 'system',
      runtimeProviderId: 'provider-openrouter',
    });
  });

  it('persists provider configuration locally', () => {
    const firstService = new ProviderConfigService();
    const openRouterId = findProviderByPreset(firstService, 'openrouter')?.id;
    firstService.updateProvider(openRouterId!, {
      name: 'Persisted Router',
      model: 'google/gemini-2.5-flash',
    });

    const secondService = new ProviderConfigService();
    expect(findProviderByPreset(secondService, 'openrouter')?.name).toBe('Persisted Router');
    expect(findProviderByPreset(secondService, 'openrouter')?.model).toBe('google/gemini-2.5-flash');
  });

  it('hydrates missing preset-backed template and API metadata from the preset definition', () => {
    const originalLocalStorage = globalThis.localStorage;
    const entries = new Map<string, string>([
      [
        'magnetar.provider-config.v1',
        JSON.stringify([
          {
            id: 'provider-openai-hydrated',
            origin: 'user',
            runtimeProviderId: null,
            name: 'Hydrated OpenAI',
            kind: 'openai',
            baseUrl: 'https://api.openai.com/v1',
            model: 'gpt-4.1-mini',
            role: 'primary',
            priority: 1,
            health: 'healthy',
            apiStyle: 'openai-compatible',
            apiKey: '',
            description: 'Preset-backed provider with stripped metadata',
            supportsApiKey: true,
            ownership: 'backend',
            presetKind: 'openai',
          },
        ]),
      ],
    ]);

    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: {
        getItem(key: string) {
          return entries.get(key) ?? null;
        },
        setItem(key: string, value: string) {
          entries.set(key, value);
        },
        removeItem(key: string) {
          entries.delete(key);
        },
      },
    });

    try {
      const service = new ProviderConfigService();
      const provider = service.providers()[0];
      const openAiPreset = service.getPreset('openai');

      expect(provider.template).toEqual(openAiPreset?.template);
      expect(provider.apiSurface).toEqual(openAiPreset?.apiSurface);
      expect(provider.modelSuggestions).toEqual(openAiPreset?.modelSuggestions);
      expect(provider.runtimeProviderId).toBeNull();
    } finally {
      Object.defineProperty(globalThis, 'localStorage', {
        configurable: true,
        value: originalLocalStorage,
      });
    }
  });

  it('hydrates missing metadata with generic defaults when no preset kind exists', () => {
    const originalLocalStorage = globalThis.localStorage;
    const entries = new Map<string, string>([
      [
        'magnetar.provider-config.v1',
        JSON.stringify([
          {
            id: 'provider-generic-hydrated',
            origin: 'user',
            runtimeProviderId: null,
            name: 'Hydrated Generic',
            kind: 'custom',
            baseUrl: 'https://provider.example/v1',
            model: 'custom-model',
            role: 'backup',
            priority: 2,
            health: 'unknown',
            apiStyle: 'openai-compatible',
            apiKey: '',
            description: 'Provider without preset metadata',
            supportsApiKey: true,
            ownership: 'user',
          },
        ]),
      ],
    ]);

    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: {
        getItem(key: string) {
          return entries.get(key) ?? null;
        },
        setItem(key: string, value: string) {
          entries.set(key, value);
        },
        removeItem(key: string) {
          entries.delete(key);
        },
      },
    });

    try {
      const service = new ProviderConfigService();
      const provider = service.providers()[0];

      expect(provider.template).toEqual({ requestTemplate: '', placeholders: [] });
      expect(provider.apiSurface.endpoints.map((endpoint) => endpoint.id)).toEqual(['models', 'chat']);
      expect(provider.modelSuggestions).toEqual([]);
      expect(provider.runtimeProviderId).toBeNull();
    } finally {
      Object.defineProperty(globalThis, 'localStorage', {
        configurable: true,
        value: originalLocalStorage,
      });
    }
  });

  it('infers system origin for legacy preset-backed provider ids without an explicit origin', () => {
    const originalLocalStorage = globalThis.localStorage;
    const entries = new Map<string, string>([
      [
        'magnetar.provider-config.v1',
        JSON.stringify([
          {
            id: 'provider-openrouter-legacy',
            name: 'Legacy OpenRouter',
            kind: 'openrouter',
            baseUrl: 'https://openrouter.ai/api/v1',
            model: 'openai/gpt-4.1-mini',
            role: 'primary',
            priority: 1,
            health: 'healthy',
            apiStyle: 'openai-compatible',
            apiKey: '',
            description: 'Legacy system provider',
            supportsApiKey: true,
            ownership: 'backend',
            presetKind: 'openrouter',
            template: { requestTemplate: '{}', placeholders: [] },
            apiSurface: { endpointComparison: [], endpoints: [] },
            modelSuggestions: [],
          },
        ]),
      ],
    ]);

    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: {
        getItem(key: string) {
          return entries.get(key) ?? null;
        },
        setItem(key: string, value: string) {
          entries.set(key, value);
        },
        removeItem(key: string) {
          entries.delete(key);
        },
      },
    });

    try {
      const service = new ProviderConfigService();
      const provider = service.providers()[0];
      expect(provider?.origin).toBe('system');
      expect(provider?.runtimeProviderId).toBe('provider-openrouter');
    } finally {
      Object.defineProperty(globalThis, 'localStorage', {
        configurable: true,
        value: originalLocalStorage,
      });
    }
  });

  it('infers user origin when a legacy provider id has no preset kind', () => {
    const originalLocalStorage = globalThis.localStorage;
    const entries = new Map<string, string>([
      [
        'magnetar.provider-config.v1',
        JSON.stringify([
          {
            id: 'provider-custom-legacy',
            name: 'Legacy Custom',
            kind: 'custom',
            baseUrl: 'https://provider.example/v1',
            model: 'custom-model',
            role: 'primary',
            priority: 1,
            health: 'healthy',
            apiStyle: 'openai-compatible',
            apiKey: '',
            description: 'Legacy user provider without preset kind',
            supportsApiKey: true,
            ownership: 'user',
            template: { requestTemplate: '{}', placeholders: [] },
            apiSurface: { endpointComparison: [], endpoints: [] },
            modelSuggestions: [],
          },
        ]),
      ],
    ]);

    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: {
        getItem(key: string) {
          return entries.get(key) ?? null;
        },
        setItem(key: string, value: string) {
          entries.set(key, value);
        },
        removeItem(key: string) {
          entries.delete(key);
        },
      },
    });

    try {
      const service = new ProviderConfigService();
      expect(service.providers()[0]?.origin).toBe('user');
    } finally {
      Object.defineProperty(globalThis, 'localStorage', {
        configurable: true,
        value: originalLocalStorage,
      });
    }
  });

  it('hydrates missing runtime provider ids from preset-backed metadata', () => {
    const originalLocalStorage = globalThis.localStorage;
    const entries = new Map<string, string>([
      [
        'magnetar.provider-config.v1',
        JSON.stringify([
          {
            id: 'provider-openrouter-hydrated',
            origin: 'user',
            name: 'Hydrated OpenRouter',
            kind: 'openrouter',
            baseUrl: 'https://openrouter.ai/api/v1',
            model: 'openai/gpt-4.1-mini',
            role: 'primary',
            priority: 1,
            health: 'healthy',
            apiStyle: 'openai-compatible',
            apiKey: '',
            description: 'Preset-backed provider with stripped runtime id',
            supportsApiKey: true,
            ownership: 'backend',
            presetKind: 'openrouter',
            template: { requestTemplate: '{}', placeholders: [] },
            apiSurface: { endpointComparison: [], endpoints: [] },
            modelSuggestions: [],
          },
        ]),
      ],
    ]);

    Object.defineProperty(globalThis, 'localStorage', {
      configurable: true,
      value: {
        getItem(key: string) {
          return entries.get(key) ?? null;
        },
        setItem(key: string, value: string) {
          entries.set(key, value);
        },
        removeItem(key: string) {
          entries.delete(key);
        },
      },
    });

    try {
      const service = new ProviderConfigService();
      expect(service.providers()[0]?.runtimeProviderId).toBe('provider-openrouter');
    } finally {
      Object.defineProperty(globalThis, 'localStorage', {
        configurable: true,
        value: originalLocalStorage,
      });
    }
  });

  it('keeps the current provider config when reset metadata is unavailable', () => {
    const service = new ProviderConfigService();
    const openRouterId = findProviderByPreset(service, 'openrouter')?.id;
    const presets = service.presets();
    const snapshot = [...presets];

    service.updateProvider(openRouterId!, {
      name: 'No Preset Reset Available',
      baseUrl: 'https://override.example/api/v1',
    });
    presets.splice(0, presets.length);

    try {
      expect(service.resetProviderConfiguration(openRouterId!)).toBe(true);
      expect(service.providers().find((provider) => provider.id === openRouterId)).toMatchObject({
        name: 'No Preset Reset Available',
        baseUrl: 'https://override.example/api/v1',
      });
    } finally {
      presets.push(...snapshot);
    }
  });

  it('resets through the custom fallback when preset kind is missing', () => {
    const service = new ProviderConfigService();
    const providerId = service.addCustomProvider();
    const customPreset = service.presets().find((preset) => preset.kind === 'custom');
    const originalSuggestions = customPreset?.modelSuggestions;

    service.updateProvider(providerId, {
      presetKind: null,
      name: 'Reset Me',
      baseUrl: 'https://override.example/v1',
      model: 'override-model',
    });

    if (customPreset) {
      customPreset.modelSuggestions = undefined;
    }

    try {
      expect(service.resetProviderConfiguration(providerId)).toBe(true);
      expect(service.providers().find((provider) => provider.id === providerId)).toMatchObject({
        name: 'Custom Provider',
        baseUrl: 'https://api.example.com/v1',
        model: 'example/model-name',
        modelSuggestions: [],
      });
    } finally {
      if (customPreset) {
        customPreset.modelSuggestions = originalSuggestions;
      }
    }
  });
});
