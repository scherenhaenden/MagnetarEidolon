import {
  AfterViewChecked,
  Component,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { UiBadgeComponent, BadgeStatus } from '../../ui/badge.component.js';
import { UiIconComponent } from '../../ui/icon.component.js';
import { ChatBlock, ChatMessage } from '../../core/models/chat.js';
import { ChatSessionService } from '../../core/services/chat-session.service.js';
import { ProviderConfigService } from '../../core/services/provider-config.service.js';

@Component({
  selector: 'screen-chat',
  standalone: true,
  imports: [CommonModule, UiIconComponent, UiBadgeComponent],
  templateUrl: './chat-screen.component.html',
})
export class ChatScreen implements AfterViewChecked {
  public readonly providerConfigService = inject(ProviderConfigService);
  public readonly chatSessionService = inject(ChatSessionService);
  @ViewChild('messageViewport') private messageViewport?: ElementRef<HTMLDivElement>;

  private lastScrollSignature = '';
  private shouldAutoScroll = true;

  public updateDraft(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.chatSessionService.setDraft(target.value);
  }

  public async submitPrompt(): Promise<void> {
    const didStart = await this.chatSessionService.submitDraft();
    if (!didStart) {
      return;
    }

    this.shouldAutoScroll = true;
    this.scrollMessageViewportToBottom();
  }

  public handlePromptKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' || event.shiftKey) {
      return;
    }

    event.preventDefault();
    void this.submitPrompt();
  }

  public handleMessageViewportScroll(): void {
    const viewport = this.messageViewport?.nativeElement;
    if (!viewport) {
      return;
    }

    this.shouldAutoScroll = this.isNearBottom(viewport);
  }

  public copyMessage(message: ChatMessage): void {
    void navigator.clipboard?.writeText(message.rawText);
  }

  public copyCode(block: ChatBlock): void {
    if (block.type !== 'code') {
      return;
    }

    void navigator.clipboard?.writeText(block.code);
  }

  public hasCanvasCandidate(message: ChatMessage): boolean {
    return message.blocks.some((block) => block.type === 'code');
  }

  public openCanvas(messageId: string): void {
    this.chatSessionService.openCanvasFromMessage(messageId);
  }

  public createNewSession(): void {
    this.chatSessionService.createNewSession();
    this.shouldAutoScroll = true;
  }

  public switchToSession(sessionId: string): void {
    this.chatSessionService.switchToSession(sessionId);
    this.shouldAutoScroll = true;
  }

  public renameSession(sessionId: string, event: Event): void {
    event.stopPropagation();
    const currentTitle =
      this.chatSessionService.conversationHistory().find((conversation) => conversation.id === sessionId)?.title ??
      'New Chat';
    const nextTitle = globalThis.prompt?.('Rename chat', currentTitle);
    if (!nextTitle) {
      return;
    }

    this.chatSessionService.renameSession(sessionId, nextTitle);
  }

  public deleteSession(sessionId: string, event: Event): void {
    event.stopPropagation();
    const confirmed = globalThis.confirm?.('Delete this chat?') ?? false;
    if (!confirmed) {
      return;
    }

    this.chatSessionService.deleteSession(sessionId);
  }

  public isActiveSession(sessionId: string): boolean {
    return this.chatSessionService.currentSession()?.id === sessionId;
  }

  public getMessageBadge(message: ChatMessage): BadgeStatus {
    switch (message.phase) {
      case 'complete':
        return 'success';
      case 'streaming':
        return 'active';
      case 'error':
        return 'failed';
      case 'idle':
      default:
        return 'idle';
    }
  }

  public ngAfterViewChecked(): void {
    const viewport = this.messageViewport?.nativeElement;
    if (!viewport) {
      return;
    }

    const messages = this.chatSessionService.messages();
    const lastMessage = messages.at(-1);
    const nextSignature = `${messages.length}:${lastMessage?.id ?? ''}:${lastMessage?.phase ?? ''}:${lastMessage?.rawText.length ?? 0}`;
    if (nextSignature === this.lastScrollSignature) {
      return;
    }

    this.lastScrollSignature = nextSignature;
    if (!this.shouldAutoScroll) {
      return;
    }

    this.scrollMessageViewportToBottom();
  }

  private scrollMessageViewportToBottom(): void {
    const viewport = this.messageViewport?.nativeElement;
    if (!viewport) {
      return;
    }

    const scheduleFrame =
      globalThis.requestAnimationFrame ??
      ((callback: FrameRequestCallback) => setTimeout(() => callback(0), 0));
    scheduleFrame(() => {
      viewport.scrollTop = viewport.scrollHeight;
    });
  }

  private isNearBottom(viewport: HTMLDivElement): boolean {
    const remainingDistance = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
    return remainingDistance <= 96;
  }
}
