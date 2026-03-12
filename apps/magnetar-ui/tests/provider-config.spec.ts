import { describe, expect, it } from 'vitest';

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
      },
    ]);

    expect(providers.map((provider) => provider.id)).toEqual(['a', 'b']);
  });
});

describe('ProviderConfigService', () => {
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
});
