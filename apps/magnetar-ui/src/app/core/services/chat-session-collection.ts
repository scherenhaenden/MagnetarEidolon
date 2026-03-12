import { ChatConversationSession, ChatMessage } from '../models/chat.js';

export class ChatSessionCollection {
  public sortByUpdatedAt(sessions: ChatConversationSession[]): ChatConversationSession[] {
    return [...sessions].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
  }

  public createSession(welcomeMessage: ChatMessage): ChatConversationSession {
    const timestamp = new Date().toISOString();
    return {
      id: `chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: 'New Chat',
      preview: welcomeMessage.rawText,
      messages: [welcomeMessage],
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  }

  public resolveInitialSessionId(sessions: ChatConversationSession[]): string {
    return sessions[0]?.id ?? '';
  }

  public normalizeSessions(sessions: ChatConversationSession[]): ChatConversationSession[] {
    return this.sortByUpdatedAt(
      sessions.map((session) => ({
        ...session,
        title: session.title || this.deriveTitle(session.messages),
        preview: session.preview || this.derivePreview(session.messages),
      })),
    );
  }

  public updateSessionMessages(
    sessions: ChatConversationSession[],
    sessionId: string,
    updater: (messages: ChatMessage[]) => ChatMessage[],
  ): ChatConversationSession[] {
    const nextUpdatedAt = new Date().toISOString();

    return this.sortByUpdatedAt(
      sessions.map((session) => {
        if (session.id !== sessionId) {
          return session;
        }

        const nextMessages = updater(session.messages);
        return {
          ...session,
          messages: nextMessages,
          title: this.deriveTitle(nextMessages),
          preview: this.derivePreview(nextMessages),
          updatedAt: nextUpdatedAt,
        };
      }),
    );
  }

  private deriveTitle(messages: ChatMessage[]): string {
    const firstUserMessage = messages.find((message) => message.role === 'user');
    if (!firstUserMessage) {
      return 'New Chat';
    }

    const compact = firstUserMessage.rawText.replace(/\s+/g, ' ').trim();
    return compact.slice(0, 36) || 'New Chat';
  }

  private derivePreview(messages: ChatMessage[]): string {
    const previewSource =
      messages.find((message) => message.role === 'user') ??
      [...messages].reverse().find((message) => message.role === 'assistant' || message.role === 'user');

    if (!previewSource) {
      return '';
    }

    return previewSource.rawText.replace(/\s+/g, ' ').trim().slice(0, 88);
  }
}
