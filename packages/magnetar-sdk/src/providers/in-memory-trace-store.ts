import { TraceEvent, TraceEventInput, TraceStore } from '../interfaces.js';

export class InMemoryTraceStore implements TraceStore {
  private events: TraceEvent[] = [];

  public addEvent(event: TraceEventInput): void {
    const newEvent = {
      ...event,
      id: crypto.randomUUID(),
      timestamp: new Date()
    } as TraceEvent;
    this.events.push(newEvent);
  }

  public getTrace(): TraceEvent[] {
    return [...this.events];
  }

  public clear(): void {
    this.events = [];
  }
}
