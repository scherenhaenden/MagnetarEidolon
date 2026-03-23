import { Inject, Injectable } from '@nestjs/common';

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
  public constructor(
    @Inject(ProviderRegistryService)
    private readonly providerRegistryService: ProviderRegistryService,
  ) {}

  public getSnapshot(): HeartbeatSnapshot {
    const providerRegistryCheck = this.buildProviderRegistryCheck();

    return {
      status: providerRegistryCheck.status === 'ok' ? 'ok' : 'degraded',
      service: '@magnetar/magnetar-api',
      version: process.env.npm_package_version ?? '0.1.0',
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
    try {
      const providers = this.providerRegistryService.getProviders();
      return {
        status: 'ok',
        detail: `Provider catalog loaded successfully (${providers.length} provider${providers.length === 1 ? '' : 's'} available).`,
      };
    } catch (error: unknown) {
      return {
        status: 'error',
        detail:
          error instanceof Error
            ? `Provider catalog unavailable: ${error.message}`
            : 'Provider catalog unavailable due to an unknown error.',
      };
    }
  }
}
