import { Observable } from 'rxjs';
import { MemoryItem } from './models.js';

export interface ToolResult {
  success: boolean;
  output?: string;
  error?: string;
}

export interface Tool {
  name: string;
  description: string;
  execute(args: Record<string, any>): Observable<ToolResult>;
}

export interface LLMResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface LLMProvider {
  generate(messages: { role: string; content: string }[]): Observable<LLMResponse>;
}

export interface MemoryStore {
  addMemory(content: string, metadata?: Record<string, any>): Observable<void>;
  query(text: string, limit?: number): Observable<MemoryItem[]>;
}

export type TraceEventType = 'observe' | 'think' | 'act' | 'reflect' | 'error' | 'finish';

export interface TraceEvent {
  id: string;
  timestamp: Date;
  type: TraceEventType;
  data: Record<string, any>;
}

export interface TraceStore {
  addEvent(event: Omit<TraceEvent, 'id' | 'timestamp'>): void;
  getTrace(): TraceEvent[];
  clear(): void;
}
