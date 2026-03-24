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

export type TraceAction =
  | { type: 'tool'; name: string; args: Record<string, unknown> }
  | { type: 'finish'; message: string }
  | { type: 'error'; message: string };

export interface EnvironmentSnapshot {
  os?: string;
  currentDirectory?: string;
  timestamp?: Date;
}

export interface TraceEventBase<TType extends TraceEventType, TData> {
  id: string;
  timestamp: Date;
  type: TType;
  data: TData;
}

export type ObserveTraceEvent = TraceEventBase<'observe', {
  environment: EnvironmentSnapshot;
}>;

export type ThinkTraceEvent = TraceEventBase<'think', {
  promptPreview: string;
  promptLength: number;
  responsePreview: string;
  responseLength: number;
  parsedAction: TraceAction | null;
}>;

export type ActTraceEvent = TraceEventBase<'act', {
  action: TraceAction;
  result: ToolResult;
}>;

export type ReflectTraceEvent = TraceEventBase<'reflect', {
  memoryAdded: MemoryItem;
}>;

export type ErrorTraceEvent = TraceEventBase<'error', {
  error: string;
  action?: TraceAction;
}>;

export type FinishTraceEvent = TraceEventBase<'finish', {
  message: string;
}>;

export type TraceEvent =
  | ObserveTraceEvent
  | ThinkTraceEvent
  | ActTraceEvent
  | ReflectTraceEvent
  | ErrorTraceEvent
  | FinishTraceEvent;

export type TraceEventInput = Omit<TraceEvent, 'id' | 'timestamp'>;

export interface TraceStore {
  addEvent(event: TraceEventInput): void;
  getTrace(): TraceEvent[];
  clear(): void;
}
