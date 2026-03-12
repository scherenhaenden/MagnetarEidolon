import { Module } from '@nestjs/common';

import { ChatController } from './chat.controller.js';
import { ChatGatewayService } from './chat.gateway.service.js';
import { ProviderRegistryService } from './provider-registry.service.js';

@Module({
  controllers: [ChatController],
  providers: [ChatGatewayService, ProviderRegistryService],
})
export class AppModule {}
