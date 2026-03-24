import { Inject, Injectable, Logger } from '@nestjs/common';

import { ProviderRegistryService } from '../provider-registry.service.js';

export interface HeartbeatCheck {
  status: 'ok' | 'error';
  detail: string;
}

export interface HeartbeatSnapshot {
  status: 'ok' | 'degraded';
  service: string;
  version: string;
  timestamp: string;
  uptimeSeconds: number;
  checks: {
    api: HeartbeatCheck;
    providerRegistry: HeartbeatCheck;
  };
}

@Injectable()
export class HeartbeatService {
  private readonly logger = new Logger(HeartbeatService.name);
  private readonly providerRegistryCheckTtlMs = 5_000;
  private cachedProviderRegistryCheck: { value: HeartbeatCheck; expiresAt: number } | null = null;

  public constructor(
    @Inject(ProviderRegistryService)
    private readonly providerRegistryService: ProviderRegistryService,
  ) {}

  public getSnapshot(): HeartbeatSnapshot {
    const providerRegistryCheck = this.buildProviderRegistryCheck();

    return {
      status: providerRegistryCheck.status === 'ok' ? 'ok' : 'degraded',
      service: '@magnetar/magnetar-api',
      version: process.env.npm_package_version ?? 'unknown',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.max(0, Math.round(process.uptime())),
      checks: {
        api: {
          status: 'ok',
          detail: 'NestJS backend is accepting requests.',
        },
        providerRegistry: providerRegistryCheck,
      },
    };
  }

  private buildProviderRegistryCheck(): HeartbeatCheck {
    const now = Date.now();
    if (this.cachedProviderRegistryCheck && this.cachedProviderRegistryCheck.expiresAt > now) {
      return this.cachedProviderRegistryCheck.value;
    }

    try {
      const providers = this.providerRegistryService.getProviders();
      const check: HeartbeatCheck = {
        status: 'ok',
        detail: `Provider catalog loaded successfully (${providers.length} provider${providers.length === 1 ? '' : 's'} available).`,
      };
      this.cachedProviderRegistryCheck = {
        value: check,
        expiresAt: now + this.providerRegistryCheckTtlMs,
      };
      return check;
    } catch (error: unknown) {
      this.logger.warn(
        error instanceof Error
          ? `Provider catalog unavailable during heartbeat: ${error.message}`
          : 'Provider catalog unavailable during heartbeat due to an unknown error.',
      );

      const check: HeartbeatCheck = {
        status: 'error',
        detail: 'Provider catalog unavailable.',
      };
      this.cachedProviderRegistryCheck = {
        value: check,
        expiresAt: now + this.providerRegistryCheckTtlMs,
      };
      return check;
    }
  }
}
