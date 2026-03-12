import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ProviderRegistryService,
} from './provider-registry.service.js';

test('ProviderRegistryService exposes LM Studio and OpenRouter definitions', (): void => {
  const registry = new ProviderRegistryService();
  const providers = registry.getProviders();

  assert.equal(providers.length, 2);
  assert.equal(providers[0]?.id, 'provider-lmstudio');
  assert.equal(providers[1]?.id, 'provider-openrouter');
});

test('ProviderRegistryService resolves OpenRouter runtime overrides from env', (): void => {
  process.env.OPENROUTER_BASE_URL = 'https://openrouter.example/api/v1';
  process.env.OPENROUTER_DEFAULT_MODEL = 'anthropic/claude-3.7-sonnet';
  process.env.OPENROUTER_API_KEY = 'secret-openrouter-key';

  const registry = new ProviderRegistryService();
  const provider = registry.getProvider('provider-openrouter');

  assert.deepEqual(provider, {
    id: 'provider-openrouter',
    displayName: 'OpenRouter',
    kind: 'openrouter',
    baseUrl: 'https://openrouter.example/api/v1',
    chatPath: '/chat/completions',
    apiStyle: 'openai-compatible',
    authStrategy: 'bearer',
    defaultModel: 'anthropic/claude-3.7-sonnet',
    supportsStreaming: true,
    requestFormat: 'chat-completions',
    responseNormalizer: 'openai-sse',
    apiKey: 'secret-openrouter-key',
  });

  delete process.env.OPENROUTER_BASE_URL;
  delete process.env.OPENROUTER_DEFAULT_MODEL;
  delete process.env.OPENROUTER_API_KEY;
});

test('ProviderRegistryService falls back to defaults and null for missing secrets', (): void => {
  delete process.env.OPENROUTER_BASE_URL;
  delete process.env.OPENROUTER_DEFAULT_MODEL;
  delete process.env.OPENROUTER_API_KEY;

  const registry = new ProviderRegistryService();
  const provider = registry.getProvider('provider-openrouter');

  assert.equal(provider?.baseUrl, 'https://openrouter.ai/api/v1');
  assert.equal(provider?.defaultModel, 'openai/gpt-4.1-mini');
  assert.equal(provider?.apiKey, null);
});

test('ProviderRegistryService returns null for unknown providers', (): void => {
  const registry = new ProviderRegistryService();
  assert.equal(registry.getProvider('missing-provider'), null);
});
