import { describe, expect, it, vi } from 'vitest';

import {
  MEMORY_RECORD_KIND,
  MEMORY_VISIBILITY_FILTER,
  createMemoryRecords,
  matchesMemoryFilter,
  type MemoryRecord,
} from '../src/app/core/models/memory-inspector.js';
import * as memoryInspectorModel from '../src/app/core/models/memory-inspector.js';
import { MemoryInspectorService } from '../src/app/core/services/memory-inspector.service.js';

describe('memory-inspector model helpers', () => {
  it('creates session and durable records for the inspector', () => {
    const records = createMemoryRecords();

    expect(records.filter((record) => record.kind === MEMORY_RECORD_KIND.SESSION)).toHaveLength(3);
    expect(records.filter((record) => record.kind === MEMORY_RECORD_KIND.DURABLE)).toHaveLength(3);
    expect(records.some((record) => record.pinned)).toBe(true);
  });

  it('matches records against every supported filter', () => {
    const [pinnedSession] = createMemoryRecords();
    const durableRecord = createMemoryRecords().find(
      (record) => record.kind === MEMORY_RECORD_KIND.DURABLE && !record.pinned,
    );

    expect(matchesMemoryFilter(pinnedSession, MEMORY_VISIBILITY_FILTER.ALL)).toBe(true);
    expect(matchesMemoryFilter(pinnedSession, MEMORY_VISIBILITY_FILTER.SESSION)).toBe(true);
    expect(matchesMemoryFilter(pinnedSession, MEMORY_VISIBILITY_FILTER.DURABLE)).toBe(false);
    expect(matchesMemoryFilter(pinnedSession, MEMORY_VISIBILITY_FILTER.PINNED)).toBe(true);
    expect(matchesMemoryFilter(durableRecord!, MEMORY_VISIBILITY_FILTER.SESSION)).toBe(false);
    expect(matchesMemoryFilter(durableRecord!, MEMORY_VISIBILITY_FILTER.DURABLE)).toBe(true);
    expect(matchesMemoryFilter(durableRecord!, MEMORY_VISIBILITY_FILTER.PINNED)).toBe(false);
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
    service.setFilter(MEMORY_VISIBILITY_FILTER.DURABLE);

    expect(service.filter()).toBe(MEMORY_VISIBILITY_FILTER.DURABLE);
    expect(service.visibleSessionRecords()).toEqual([]);
    expect(service.visibleDurableRecords()).toHaveLength(3);
    expect(service.selectedRecord()?.kind).toBe(MEMORY_RECORD_KIND.DURABLE);
  });

  it('keeps the selected record when the new filter still includes it', () => {
    const service = new MemoryInspectorService();

    service.selectRecord('memory-session-objective');
    service.setFilter(MEMORY_VISIBILITY_FILTER.SESSION);

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
    expect(service.records().find((record) => record.id === 'memory-durable-provider')?.badge).toBe('Durable');

    expect(service.togglePinned('memory-session-objective')).toBe(true);
    expect(service.records().find((record) => record.id === 'memory-session-objective')?.pinned).toBe(false);
    expect(service.records().find((record) => record.id === 'memory-session-objective')?.badge).toBe('Goal');

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
    service.setFilter(MEMORY_VISIBILITY_FILTER.PINNED);

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
    service.setFilter(MEMORY_VISIBILITY_FILTER.PINNED);

    expect(service.records()).toEqual([]);
    expect(service.visibleRecords()).toEqual([]);
    expect(service.selectedRecord()).toBeNull();
  });

  it('falls back to the first remaining record when the selected removal leaves no visible match for the filter', () => {
    const service = new MemoryInspectorService() as any;
    const customRecords: MemoryRecord[] = [
      {
        id: 'memory-pinned-removable',
        kind: MEMORY_RECORD_KIND.SESSION,
        title: 'Pinned removable',
        scope: 'session / test',
        summary: 'Synthetic record used to cover pinned-filter removal fallback.',
        badge: 'Pinned',
        unpinnedBadge: 'Fresh',
        status: 'active',
        pinned: true,
        removable: true,
        tag: 'test',
        lastUpdated: 'now',
      },
      {
        id: 'memory-unpinned-fallback',
        kind: MEMORY_RECORD_KIND.DURABLE,
        title: 'Fallback record',
        scope: 'durable / test',
        summary: 'Synthetic record used as the next non-visible fallback selection.',
        badge: 'Rule',
        unpinnedBadge: 'Rule',
        status: 'idle',
        pinned: false,
        removable: true,
        tag: 'test',
        lastUpdated: 'now',
      },
    ];

    service.recordsState.set(customRecords);
    service.selectedRecordIdState.set('memory-pinned-removable');
    service.setFilter(MEMORY_VISIBILITY_FILTER.PINNED);

    expect(service.removeRecord('memory-pinned-removable')).toBe(true);
    expect(service.selectedRecord()?.id).toBe('memory-unpinned-fallback');
  });

  it('supports removing the final selected record under the active filter', () => {
    const service = new MemoryInspectorService() as any;
    const customRecords: MemoryRecord[] = [
      {
        id: 'memory-last-removable',
        kind: MEMORY_RECORD_KIND.SESSION,
        title: 'Last removable',
        scope: 'session / test',
        summary: 'Synthetic record used to cover empty removal fallback.',
        badge: 'Pinned',
        unpinnedBadge: 'Fresh',
        status: 'active',
        pinned: true,
        removable: true,
        tag: 'test',
        lastUpdated: 'now',
      },
    ];

    service.recordsState.set(customRecords);
    service.selectedRecordIdState.set('memory-last-removable');
    service.setFilter(MEMORY_VISIBILITY_FILTER.PINNED);

    expect(service.removeRecord('memory-last-removable')).toBe(true);
    expect(service.records()).toEqual([]);
    expect(service.selectedRecord()).toBeNull();
  });

  it('restores the default state after edits', () => {
    const service = new MemoryInspectorService();

    service.removeRecord('memory-session-schema');
    service.setFilter(MEMORY_VISIBILITY_FILTER.PINNED);
    service.togglePinned('memory-durable-policy');
    service.restoreDefaults();

    expect(service.filter()).toBe(MEMORY_VISIBILITY_FILTER.ALL);
    expect(service.records()).toHaveLength(6);
    expect(service.selectedRecord()?.id).toBe('memory-session-objective');
    expect(service.pinnedCount()).toBe(2);
  });

  it('clears the selection if restoring defaults yields an empty dataset', () => {
    const service = new MemoryInspectorService();
    const createMemoryRecordsSpy = vi.spyOn(memoryInspectorModel, 'createMemoryRecords').mockReturnValueOnce([]);

    service.restoreDefaults();

    expect(service.records()).toEqual([]);
    expect(service.filter()).toBe(MEMORY_VISIBILITY_FILTER.ALL);
    expect(service.selectedRecord()).toBeNull();

    createMemoryRecordsSpy.mockRestore();
  });
});
