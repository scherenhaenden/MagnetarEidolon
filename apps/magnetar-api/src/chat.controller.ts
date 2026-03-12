import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import type { Response } from 'express';

import {
  ChatGatewayService,
  type BackendChatRequest,
} from './chat.gateway.service.js';

@Controller('chat')
export class ChatController {
  public constructor(
    @Inject(ChatGatewayService)
    private readonly chatGatewayService: ChatGatewayService,
  ) {}

  @Post('stream')
  public async stream(
    @Body() request: BackendChatRequest,
    @Res() response: Response,
  ): Promise<void> {
    await this.chatGatewayService.streamChat(request, response);
  }
}
