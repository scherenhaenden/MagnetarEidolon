import { ChatConversationSession } from '../models/chat.js';

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

class InMemoryStorageAdapter implements StorageLike {
  private readonly entries = new Map<string, string>();

  public getItem(key: string): string | null {
    return this.entries.get(key) ?? null;
  }

  public setItem(key: string, value: string): void {
    this.entries.set(key, value);
  }
}

export class ChatSessionStore {
  private static readonly fallbackStorage = new InMemoryStorageAdapter();

  public constructor(
    private readonly sessionStorageKey: string,
    private readonly activeSessionStorageKey: string,
    private readonly storage: StorageLike = ChatSessionStore.resolveStorage(),
  ) {}

  public loadSessions(): ChatConversationSession[] {
    if (!this.storage) {
      return [];
    }

    try {
      const rawValue = this.storage.getItem(this.sessionStorageKey);
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

    this.storage.setItem(this.sessionStorageKey, JSON.stringify(sessions));
  }

  public loadActiveSessionId(): string | null {
    if (!this.storage) {
      return null;
    }

    const value = this.storage.getItem(this.activeSessionStorageKey);
    return value && value.length > 0 ? value : null;
  }

  public saveActiveSessionId(sessionId: string): void {
    if (!this.storage) {
      return;
    }

    this.storage.setItem(this.activeSessionStorageKey, sessionId);
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

  private static resolveStorage(): StorageLike {
    try {
      return globalThis.localStorage ?? ChatSessionStore.fallbackStorage;
    } catch {
      return ChatSessionStore.fallbackStorage;
    }
  }
}
