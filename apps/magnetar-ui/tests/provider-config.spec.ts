import { beforeEach, describe, expect, it } from 'vitest';

import { describeProviderRole, sortProvidersByPriority } from '../src/app/core/models/provider-config.js';
import { ProviderConfigService } from '../src/app/core/services/provider-config.service.js';

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

    expect(service.primaryProvider()?.name).toBe('LM Studio Local');
    expect(service.primaryProvider()?.baseUrl).toBe('http://127.0.0.1:1234/v1');
    expect(service.primaryProvider()?.model).toBe('local-model');
    expect(service.primaryProvider()?.apiStyle).toBe('openai-compatible');
    expect(service.backupProviders().map((provider) => provider.name)).toContain('OpenAI Cloud');
    expect(service.healthyFailoverProviders().map((provider) => provider.name)).toEqual([
      'OpenAI Cloud',
    ]);
    expect(service.providers().some((provider) => provider.id === 'provider-openrouter')).toBe(true);
    expect(service.providers().find((provider) => provider.id === 'provider-openrouter')?.kind).toBe(
      'openrouter',
    );
    expect(service.providers().find((provider) => provider.id === 'provider-openrouter')?.template.placeholders).toContain(
      '$model',
    );
    expect(service.providers().find((provider) => provider.id === 'provider-openrouter')?.modelSuggestions.length).toBeGreaterThan(0);
    expect(service.providers().find((provider) => provider.id === 'provider-openrouter')?.apiSurface.endpoints.map((endpoint) => endpoint.id)).toEqual([
      'models',
      'chat',
    ]);
    expect(service.providers().find((provider) => provider.id === 'provider-lmstudio')?.apiSurface.endpoints.length).toBeGreaterThan(2);
  });

  it('promotes a backup provider to primary and normalizes priorities', () => {
    const service = new ProviderConfigService();

    service.setPrimary('provider-openai');

    expect(service.primaryProvider()?.id).toBe('provider-openai');
    expect(service.providers().find((provider) => provider.id === 'provider-openai')?.priority).toBe(1);
    expect(service.providers().find((provider) => provider.id === 'provider-lmstudio')?.role).toBe(
      'backup',
    );
    expect(service.providers().find((provider) => provider.id === 'provider-anthropic')?.priority).toBe(
      99,
    );
  });

  it('can promote OpenRouter into the active failover chain', () => {
    const service = new ProviderConfigService();

    service.setBackup('provider-openrouter');

    expect(service.backupProviders().map((provider) => provider.id)).toContain('provider-openrouter');
    expect(service.providers().find((provider) => provider.id === 'provider-openrouter')?.apiStyle).toBe(
      'openai-compatible',
    );
  });

  it('restores a primary provider when the current primary is disabled', () => {
    const service = new ProviderConfigService();

    service.disable('provider-lmstudio');

    expect(service.primaryProvider()?.id).toBe('provider-openai');
    expect(service.describeRole('provider-lmstudio')).toBe('Disabled');
  });

  it('can convert a disabled provider into a backup provider', () => {
    const service = new ProviderConfigService();

    service.setBackup('provider-anthropic');

    expect(service.backupProviders().map((provider) => provider.id)).toContain('provider-anthropic');
  });

  it('reorders non-target backup providers when a different provider becomes primary', () => {
    const service = new ProviderConfigService();

    service.setBackup('provider-anthropic');
    service.setPrimary('provider-openai');

    expect(service.providers().find((provider) => provider.id === 'provider-anthropic')?.priority).toBe(3);
  });

  it('promotes the next backup when the primary is converted into a backup', () => {
    const service = new ProviderConfigService();

    service.setBackup('provider-lmstudio');

    expect(service.primaryProvider()?.id).toBe('provider-openai');
    expect(service.backupProviders().map((provider) => provider.id)).toContain('provider-lmstudio');
  });

  it('re-promotes the same provider when no other backup exists', () => {
    const service = new ProviderConfigService();

    service.disable('provider-openai');
    service.disable('provider-anthropic');
    service.setBackup('provider-lmstudio');

    expect(service.primaryProvider()?.id).toBe('provider-lmstudio');
    expect(service.backupProviders()).toEqual([]);
  });

  it('returns Unknown when describing a missing provider id', () => {
    const service = new ProviderConfigService();

    expect(service.describeRole('provider-missing')).toBe('Unknown');
  });

  it('can end with no primary when every provider is disabled', () => {
    const service = new ProviderConfigService();

    service.disable('provider-lmstudio');
    service.disable('provider-openai');
    service.disable('provider-anthropic');

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

    service.updateProvider('provider-openrouter', {
      name: 'OpenRouter Custom',
      baseUrl: 'https://openrouter.example/api/v1',
      model: 'anthropic/claude-3.7-sonnet',
      apiKey: 'secret',
    });

    expect(service.providers().find((provider) => provider.id === 'provider-openrouter')).toMatchObject({
      name: 'OpenRouter Custom',
      baseUrl: 'https://openrouter.example/api/v1',
      model: 'anthropic/claude-3.7-sonnet',
      apiKey: 'secret',
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
      firstService.updateProvider('provider-openrouter', { name: 'Fallback Router' });

      const secondService = new ProviderConfigService();
      expect(secondService.providers().find((provider) => provider.id === 'provider-openrouter')?.name).toBe(
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
      firstService.updateProvider('provider-openrouter', { name: 'Fallback Router' });
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

    expect(service.removeProvider(providerId)).toBe(true);
    expect(service.providers().some((provider) => provider.id === providerId)).toBe(false);
  });

  it('returns false when removing a missing provider entry', () => {
    const service = new ProviderConfigService();
    expect(service.removeProvider('provider-missing')).toBe(false);
  });

  it('persists provider configuration locally', () => {
    const firstService = new ProviderConfigService();
    firstService.updateProvider('provider-openrouter', {
      name: 'Persisted Router',
      model: 'google/gemini-2.5-flash',
    });

    const secondService = new ProviderConfigService();
    expect(secondService.providers().find((provider) => provider.id === 'provider-openrouter')?.name).toBe(
      'Persisted Router',
    );
    expect(secondService.providers().find((provider) => provider.id === 'provider-openrouter')?.model).toBe(
      'google/gemini-2.5-flash',
    );
  });

  it('hydrates missing preset-backed template and API metadata from the preset definition', () => {
    const originalLocalStorage = globalThis.localStorage;
    const entries = new Map<string, string>([
      [
        'magnetar.provider-config.v1',
        JSON.stringify([
          {
            id: 'provider-openai-hydrated',
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
    } finally {
      Object.defineProperty(globalThis, 'localStorage', {
        configurable: true,
        value: originalLocalStorage,
      });
    }
  });
});
