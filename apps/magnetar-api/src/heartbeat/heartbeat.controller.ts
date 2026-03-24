import { Controller, Get, Inject } from '@nestjs/common';

import { HeartbeatService, type HeartbeatSnapshot } from './heartbeat.service.js';

@Controller('heartbeat')
export class HeartbeatController {
  public constructor(
    @Inject(HeartbeatService)
    private readonly heartbeatService: HeartbeatService,
  ) {}

  @Get()
  public getHeartbeat(): HeartbeatSnapshot {
    return this.heartbeatService.getSnapshot();
  }
}
