import { Module } from '@nestjs/common';

import { ChatController } from './chat.controller.js';
import { ChatGatewayService } from './chat.gateway.service.js';
import { HeartbeatController } from './heartbeat/heartbeat.controller.js';
import { HeartbeatService } from './heartbeat/heartbeat.service.js';
import { ProviderRegistryService } from './provider-registry.service.js';

@Module({
  controllers: [ChatController, HeartbeatController],
  providers: [ChatGatewayService, HeartbeatService, ProviderRegistryService],
})
export class AppModule {}
