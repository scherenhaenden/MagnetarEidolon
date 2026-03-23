import { describe, expect, it } from 'vitest';

import {
  createMemoryRecords,
  matchesMemoryFilter,
} from '../src/app/core/models/memory-inspector.js';
import { MemoryInspectorService } from '../src/app/core/services/memory-inspector.service.js';

describe('memory-inspector model helpers', () => {
  it('creates session and durable records for the inspector', () => {
    const records = createMemoryRecords();

    expect(records.filter((record) => record.kind === 'session')).toHaveLength(3);
    expect(records.filter((record) => record.kind === 'durable')).toHaveLength(3);
    expect(records.some((record) => record.pinned)).toBe(true);
  });

  it('matches records against every supported filter', () => {
    const [pinnedSession] = createMemoryRecords();
    const durableRecord = createMemoryRecords().find((record) => record.kind === 'durable' && !record.pinned);

    expect(matchesMemoryFilter(pinnedSession, 'all')).toBe(true);
    expect(matchesMemoryFilter(pinnedSession, 'session')).toBe(true);
    expect(matchesMemoryFilter(pinnedSession, 'durable')).toBe(false);
    expect(matchesMemoryFilter(pinnedSession, 'pinned')).toBe(true);
    expect(matchesMemoryFilter(durableRecord!, 'session')).toBe(false);
    expect(matchesMemoryFilter(durableRecord!, 'durable')).toBe(true);
    expect(matchesMemoryFilter(durableRecord!, 'pinned')).toBe(false);
  });
});

describe('MemoryInspectorService', () => {
  it('starts with grouped records and a selected record', () => {
    const service = new MemoryInspectorService();

    expect(service.records()).toHaveLength(6);
    expect(service.sessionRecords()).toHaveLength(3);
    expect(service.durableRecords()).toHaveLength(3);
    expect(service.visibleRecords()).toHaveLength(6);
    expect(service.selectedRecord()?.id).toBe('memory-session-objective');
    expect(service.pinnedCount()).toBe(2);
  });

  it('filters the visible memory set and re-selects a matching record when needed', () => {
    const service = new MemoryInspectorService();

    service.selectRecord('memory-session-schema');
    service.setFilter('durable');

    expect(service.filter()).toBe('durable');
    expect(service.visibleSessionRecords()).toEqual([]);
    expect(service.visibleDurableRecords()).toHaveLength(3);
    expect(service.selectedRecord()?.kind).toBe('durable');
  });


  it('keeps the selected record when the new filter still includes it', () => {
    const service = new MemoryInspectorService();

    service.selectRecord('memory-session-objective');
    service.setFilter('session');

    expect(service.selectedRecord()?.id).toBe('memory-session-objective');
    expect(service.visibleSessionRecords()).toHaveLength(3);
  });

  it('returns false when selecting an unknown record id', () => {
    const service = new MemoryInspectorService();

    expect(service.selectRecord('missing-memory')).toBe(false);
    expect(service.selectedRecord()?.id).toBe('memory-session-objective');
  });

  it('toggles pinned state and updates the badge copy', () => {
    const service = new MemoryInspectorService();

    expect(service.togglePinned('memory-session-schema')).toBe(true);
    expect(service.records().find((record) => record.id === 'memory-session-schema')?.pinned).toBe(true);
    expect(service.records().find((record) => record.id === 'memory-session-schema')?.badge).toBe('Pinned');
    expect(service.pinnedCount()).toBe(3);

    expect(service.togglePinned('memory-durable-provider')).toBe(true);
    expect(service.records().find((record) => record.id === 'memory-durable-provider')?.pinned).toBe(false);
    expect(service.records().find((record) => record.id === 'memory-durable-provider')?.badge).toBe('Shared');

    expect(service.togglePinned('memory-session-objective')).toBe(true);
    expect(service.records().find((record) => record.id === 'memory-session-objective')?.pinned).toBe(false);
    expect(service.records().find((record) => record.id === 'memory-session-objective')?.badge).toBe('Fresh');

    expect(service.togglePinned('missing-memory')).toBe(false);
  });

  it('removes only removable records and updates selection', () => {
    const service = new MemoryInspectorService();

    service.selectRecord('memory-session-schema');

    expect(service.removeRecord('memory-session-schema')).toBe(true);
    expect(service.records().some((record) => record.id === 'memory-session-schema')).toBe(false);
    expect(service.selectedRecord()?.id).toBe('memory-session-objective');

    expect(service.removeRecord('memory-session-objective')).toBe(false);
    expect(service.records().some((record) => record.id === 'memory-session-objective')).toBe(true);
  });

  it('keeps selected record when the current filter still matches it', () => {
    const service = new MemoryInspectorService();

    service.selectRecord('memory-durable-provider');
    service.setFilter('pinned');

    expect(service.selectedRecord()?.id).toBe('memory-durable-provider');
    expect(service.visibleRecords().every((record) => record.pinned)).toBe(true);
  });


  it('returns false when removing an unknown record and preserves selection for non-selected removals', () => {
    const service = new MemoryInspectorService();

    service.selectRecord('memory-session-objective');

    expect(service.removeRecord('missing-memory')).toBe(false);
    expect(service.removeRecord('memory-session-schema')).toBe(true);
    expect(service.selectedRecord()?.id).toBe('memory-session-objective');
  });

  it('supports an empty state when no records remain visible', () => {
    const service = new MemoryInspectorService() as any;

    service.recordsState.set([]);
    service.selectedRecordIdState.set('');
    service.setFilter('pinned');

    expect(service.records()).toEqual([]);
    expect(service.visibleRecords()).toEqual([]);
    expect(service.selectedRecord()).toBeNull();
  });
  it('restores the default state after edits', () => {
    const service = new MemoryInspectorService();

    service.removeRecord('memory-session-schema');
    service.setFilter('pinned');
    service.togglePinned('memory-durable-policy');
    service.restoreDefaults();

    expect(service.filter()).toBe('all');
    expect(service.records()).toHaveLength(6);
    expect(service.selectedRecord()?.id).toBe('memory-session-objective');
    expect(service.pinnedCount()).toBe(2);
  });
});
