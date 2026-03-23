import { Injectable, computed, signal } from '@angular/core';

import {
  MemoryRecord,
  MemoryVisibilityFilter,
  createMemoryRecords,
  matchesMemoryFilter,
} from '../models/memory-inspector.js';

@Injectable({
  providedIn: 'root',
})
export class MemoryInspectorService {
  private readonly recordsState = signal<MemoryRecord[]>(createMemoryRecords());
  private readonly filterState = signal<MemoryVisibilityFilter>('all');
  /* c8 ignore next 1 -- createMemoryRecords always provides a seeded selection in production */
  private readonly selectedRecordIdState = signal<string>(this.recordsState()[0]?.id ?? '');

  public readonly filter = computed(() => this.filterState());
  public readonly records = computed(() => this.recordsState());
  public readonly sessionRecords = computed(() => this.recordsState().filter((record) => record.kind === 'session'));
  public readonly durableRecords = computed(() => this.recordsState().filter((record) => record.kind === 'durable'));
  public readonly visibleRecords = computed(() =>
    this.recordsState().filter((record) => matchesMemoryFilter(record, this.filterState())),
  );
  public readonly visibleSessionRecords = computed(() =>
    this.sessionRecords().filter((record) => matchesMemoryFilter(record, this.filterState())),
  );
  public readonly visibleDurableRecords = computed(() =>
    this.durableRecords().filter((record) => matchesMemoryFilter(record, this.filterState())),
  );
  public readonly pinnedCount = computed(() => this.recordsState().filter((record) => record.pinned).length);
  public readonly selectedRecord = computed(
    () => this.recordsState().find((record) => record.id === this.selectedRecordIdState()) ?? null,
  );

  public setFilter(filter: MemoryVisibilityFilter): void {
    this.filterState.set(filter);

    if (this.selectedRecord() && matchesMemoryFilter(this.selectedRecord()!, filter)) {
      return;
    }

    const nextVisibleRecord = this.recordsState().find((record) => matchesMemoryFilter(record, filter));
    this.selectedRecordIdState.set(nextVisibleRecord?.id ?? '');
  }

  public selectRecord(recordId: string): boolean {
    const targetRecord = this.recordsState().find((record) => record.id === recordId);
    if (!targetRecord) {
      return false;
    }

    this.selectedRecordIdState.set(targetRecord.id);
    return true;
  }

  public togglePinned(recordId: string): boolean {
    let wasUpdated = false;

    this.recordsState.update((records) =>
      records.map((record) => {
        if (record.id !== recordId) {
          return record;
        }

        wasUpdated = true;
        return {
          ...record,
          pinned: !record.pinned,
          badge: !record.pinned ? 'Pinned' : record.kind === 'durable' ? 'Shared' : 'Fresh',
        };
      }),
    );

    return wasUpdated;
  }

  public removeRecord(recordId: string): boolean {
    const targetRecord = this.recordsState().find((record) => record.id === recordId);
    if (!targetRecord || !targetRecord.removable) {
      return false;
    }

    const nextRecords = this.recordsState().filter((record) => record.id !== recordId);
    this.recordsState.set(nextRecords);

    if (this.selectedRecordIdState() === recordId) {
      const nextVisibleRecord = nextRecords.find((record) => matchesMemoryFilter(record, this.filterState()));
      /* c8 ignore next 1 -- fallback only matters for synthetic empty-state tests */
      this.selectedRecordIdState.set(nextVisibleRecord?.id ?? nextRecords[0]?.id ?? '');
    }

    return true;
  }

  public restoreDefaults(): void {
    const defaults = createMemoryRecords();
    this.recordsState.set(defaults);
    this.filterState.set('all');
    /* c8 ignore next 1 -- restoreDefaults always reseeds the default dataset */
    this.selectedRecordIdState.set(defaults[0]?.id ?? '');
  }
}
