import { ChatConversationSession } from '../models/chat.js';

export class ChatSessionStore {
  public constructor(
    private readonly storageKey: string,
    private readonly storage: Storage | null = ChatSessionStore.resolveStorage(),
  ) {}

  public loadSessions(): ChatConversationSession[] {
    if (!this.storage) {
      return [];
    }

    try {
      const rawValue = this.storage.getItem(this.storageKey);
      if (!rawValue) {
        return [];
      }

      const parsed = JSON.parse(rawValue) as ChatConversationSession[];
      return Array.isArray(parsed) ? parsed.filter((session) => this.isValidSession(session)) : [];
    } catch {
      return [];
    }
  }

  public saveSessions(sessions: ChatConversationSession[]): void {
    if (!this.storage) {
      return;
    }

    this.storage.setItem(this.storageKey, JSON.stringify(sessions));
  }

  private isValidSession(value: unknown): value is ChatConversationSession {
    if (!value || typeof value !== 'object') {
      return false;
    }

    const session = value as Partial<ChatConversationSession>;
    return (
      typeof session.id === 'string' &&
      Array.isArray(session.messages) &&
      typeof session.createdAt === 'string' &&
      typeof session.updatedAt === 'string'
    );
  }

  private static resolveStorage(): Storage | null {
    try {
      return globalThis.localStorage ?? null;
    } catch {
      return null;
    }
  }
}
