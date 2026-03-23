import { TraceEvent, TraceStore } from '../interfaces.js';

export class InMemoryTraceStore implements TraceStore {
  private events: TraceEvent[] = [];

  public addEvent(event: Omit<TraceEvent, 'id' | 'timestamp'>): void {
    const newEvent: TraceEvent = {
      ...event,
      id: crypto.randomUUID(),
      timestamp: new Date()
    };
    this.events.push(newEvent);
  }

  public getTrace(): TraceEvent[] {
    return [...this.events];
  }

  public clear(): void {
    this.events = [];
  }
}
