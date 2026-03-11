import { Module } from '@nestjs/common';

import { ChatController } from './chat.controller.js';
import { ChatGatewayService } from './chat.gateway.service.js';

@Module({
  controllers: [ChatController],
  providers: [ChatGatewayService],
})
export class AppModule {}
