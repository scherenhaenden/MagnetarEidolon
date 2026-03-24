export const MEMORY_RECORD_KIND = {
  SESSION: 'session',
  DURABLE: 'durable',
} as const;

export type MemoryRecordKind = (typeof MEMORY_RECORD_KIND)[keyof typeof MEMORY_RECORD_KIND];

export const MEMORY_VISIBILITY_FILTER = {
  ALL: 'all',
  SESSION: MEMORY_RECORD_KIND.SESSION,
  DURABLE: MEMORY_RECORD_KIND.DURABLE,
  PINNED: 'pinned',
} as const;

export type MemoryVisibilityFilter = (typeof MEMORY_VISIBILITY_FILTER)[keyof typeof MEMORY_VISIBILITY_FILTER];

export const MEMORY_FILTER_OPTIONS: ReadonlyArray<{ id: MemoryVisibilityFilter; label: string }> = [
  { id: MEMORY_VISIBILITY_FILTER.ALL, label: 'All memory' },
  { id: MEMORY_VISIBILITY_FILTER.SESSION, label: 'Session' },
  { id: MEMORY_VISIBILITY_FILTER.DURABLE, label: 'Durable' },
  { id: MEMORY_VISIBILITY_FILTER.PINNED, label: 'Pinned' },
];

export interface MemoryRecord {
  id: string;
  kind: MemoryRecordKind;
  title: string;
  scope: string;
  summary: string;
  badge: string;
  unpinnedBadge: string;
  status: 'active' | 'pending_approval' | 'idle';
  pinned: boolean;
  removable: boolean;
  tag: string;
  lastUpdated: string;
}

export function matchesMemoryFilter(record: MemoryRecord, filter: MemoryVisibilityFilter): boolean {
  switch (filter) {
    case MEMORY_VISIBILITY_FILTER.SESSION:
      return record.kind === MEMORY_RECORD_KIND.SESSION;
    case MEMORY_VISIBILITY_FILTER.DURABLE:
      return record.kind === MEMORY_RECORD_KIND.DURABLE;
    case MEMORY_VISIBILITY_FILTER.PINNED:
      return record.pinned;
    case MEMORY_VISIBILITY_FILTER.ALL:
    default:
      return true;
  }
}

export function createMemoryRecords(): MemoryRecord[] {
  return [
    {
      id: 'memory-session-objective',
      kind: MEMORY_RECORD_KIND.SESSION,
      title: 'Current execution objective',
      scope: 'session / goal',
      summary: 'Prepare a migration script with explicit approval before any write-capable execution path is enabled.',
      badge: 'Pinned',
      unpinnedBadge: 'Goal',
      status: 'active',
      pinned: true,
      removable: false,
      tag: 'goal',
      lastUpdated: 'just now',
    },
    {
      id: 'memory-session-schema',
      kind: MEMORY_RECORD_KIND.SESSION,
      title: 'Recent schema evidence',
      scope: 'session / tool output',
      summary: 'Users table inspected successfully. Runtime should preserve the evidence trail before proposing changes.',
      badge: 'Fresh',
      unpinnedBadge: 'Fresh',
      status: 'pending_approval',
      pinned: false,
      removable: true,
      tag: 'evidence',
      lastUpdated: '2 minutes ago',
    },
    {
      id: 'memory-session-policy',
      kind: MEMORY_RECORD_KIND.SESSION,
      title: 'Policy reminder',
      scope: 'session / governance',
      summary: 'Write operations remain approval-gated by default, even when a provider returns a valid migration plan.',
      badge: 'Guarded',
      unpinnedBadge: 'Guarded',
      status: 'idle',
      pinned: false,
      removable: true,
      tag: 'policy',
      lastUpdated: '5 minutes ago',
    },
    {
      id: 'memory-durable-provider',
      kind: MEMORY_RECORD_KIND.DURABLE,
      title: 'Default provider path starts local-first with LM Studio',
      scope: 'durable / provider',
      summary: 'Local-first provider defaults remain preferred so chat and execution validation stay observable and reproducible.',
      badge: 'Durable',
      unpinnedBadge: 'Durable',
      status: 'active',
      pinned: true,
      removable: false,
      tag: 'provider',
      lastUpdated: 'today',
    },
    {
      id: 'memory-durable-policy',
      kind: MEMORY_RECORD_KIND.DURABLE,
      title: 'Traceability required for every sensitive action',
      scope: 'durable / policy',
      summary: 'Every sensitive step must retain auditable evidence that can be reviewed from the product surface.',
      badge: 'Rule',
      unpinnedBadge: 'Rule',
      status: 'active',
      pinned: false,
      removable: false,
      tag: 'policy',
      lastUpdated: 'today',
    },
    {
      id: 'memory-durable-architecture',
      kind: MEMORY_RECORD_KIND.DURABLE,
      title: 'SDK contract remains shared between UI and CLI',
      scope: 'durable / architecture',
      summary: 'The runtime contract must stay consistent across surfaces so policy, trace, and execution semantics do not drift.',
      badge: 'Shared',
      unpinnedBadge: 'Shared',
      status: 'idle',
      pinned: false,
      removable: true,
      tag: 'architecture',
      lastUpdated: 'yesterday',
    },
  ];
}
