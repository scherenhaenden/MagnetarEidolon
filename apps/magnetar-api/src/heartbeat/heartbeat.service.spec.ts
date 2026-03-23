import assert from 'node:assert/strict';
import test from 'node:test';

import { ProviderRegistryService, type BackendProviderDefinition } from '../provider-registry.service.js';
import { HeartbeatService } from './heartbeat.service.js';

class HealthyProviderRegistryService extends ProviderRegistryService {
  public callCount = 0;

  public override getProviders(): BackendProviderDefinition[] {
    this.callCount += 1;
    return [
      {
        id: 'provider-lmstudio',
        displayName: 'LM Studio',
        kind: 'lm_studio',
        baseUrl: 'http://127.0.0.1:1234/v1',
        chatPath: '/chat/completions',
        apiStyle: 'openai-compatible',
        authStrategy: 'none',
        defaultModel: 'local-model',
        supportsStreaming: true,
        requestFormat: 'chat-completions',
        responseNormalizer: 'openai-sse',
        apiKey: null,
        extraHeaders: {},
      },
    ];
  }
}

class BrokenProviderRegistryService extends ProviderRegistryService {
  public callCount = 0;

  public override getProviders(): BackendProviderDefinition[] {
    this.callCount += 1;
    throw new Error('provider catalog file missing');
  }
}

test('HeartbeatService reports ok when the provider catalog is available', () => {
  const originalVersion = process.env.npm_package_version;
  delete process.env.npm_package_version;

  const service = new HeartbeatService(new HealthyProviderRegistryService());
  const snapshot = service.getSnapshot();

  process.env.npm_package_version = originalVersion;

  assert.equal(snapshot.status, 'ok');
  assert.equal(snapshot.service, '@magnetar/magnetar-api');
  assert.equal(snapshot.version, 'unknown');
  assert.match(snapshot.timestamp, /^\d{4}-\d{2}-\d{2}T/);
  assert.equal(snapshot.checks.api.status, 'ok');
  assert.equal(snapshot.checks.providerRegistry.status, 'ok');
  assert.match(snapshot.checks.providerRegistry.detail, /1 provider available/);
  assert.ok(snapshot.uptimeSeconds >= 0);
});

test('HeartbeatService reports degraded when provider catalog loading fails', () => {
  const service = new HeartbeatService(new BrokenProviderRegistryService());

  const snapshot = service.getSnapshot();

  assert.equal(snapshot.status, 'degraded');
  assert.equal(snapshot.checks.api.status, 'ok');
  assert.equal(snapshot.checks.providerRegistry.status, 'error');
  assert.equal(snapshot.checks.providerRegistry.detail, 'Provider catalog unavailable.');
});

test('HeartbeatService caches healthy provider-registry checks within the TTL window', () => {
  const providerRegistry = new HealthyProviderRegistryService();
  const service = new HeartbeatService(providerRegistry);

  const firstSnapshot = service.getSnapshot();
  const secondSnapshot = service.getSnapshot();

  assert.equal(firstSnapshot.checks.providerRegistry.status, 'ok');
  assert.equal(secondSnapshot.checks.providerRegistry.status, 'ok');
  assert.equal(providerRegistry.callCount, 1);
});

test('HeartbeatService caches failed provider-registry checks within the TTL window', () => {
  const providerRegistry = new BrokenProviderRegistryService();
  const service = new HeartbeatService(providerRegistry);

  const firstSnapshot = service.getSnapshot();
  const secondSnapshot = service.getSnapshot();

  assert.equal(firstSnapshot.checks.providerRegistry.status, 'error');
  assert.equal(secondSnapshot.checks.providerRegistry.status, 'error');
  assert.equal(providerRegistry.callCount, 1);
});
