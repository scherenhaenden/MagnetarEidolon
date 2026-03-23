import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiBadgeComponent } from '../../ui/badge.component.js';
import { UiIconComponent } from '../../ui/icon.component.js';
import { MEMORY_FILTER_OPTIONS, MemoryVisibilityFilter } from '../../core/models/memory-inspector.js';
import { MemoryInspectorService } from '../../core/services/memory-inspector.service.js';

@Component({
  selector: 'screen-memory',
  standalone: true,
  imports: [CommonModule, UiIconComponent, UiBadgeComponent],
  templateUrl: './memory-screen.component.html',
})
export class MemoryScreen {
  protected readonly memoryInspector = inject(MemoryInspectorService);
  protected readonly filters: ReadonlyArray<{ id: MemoryVisibilityFilter; label: string }> = MEMORY_FILTER_OPTIONS;

  public setFilter(filter: MemoryVisibilityFilter): void {
    this.memoryInspector.setFilter(filter);
  }

  public selectRecord(recordId: string): void {
    this.memoryInspector.selectRecord(recordId);
  }

  public togglePinned(recordId: string): void {
    this.memoryInspector.togglePinned(recordId);
  }

  public removeRecord(recordId: string): void {
    this.memoryInspector.removeRecord(recordId);
  }

  public restoreDefaults(): void {
    this.memoryInspector.restoreDefaults();
  }
}
