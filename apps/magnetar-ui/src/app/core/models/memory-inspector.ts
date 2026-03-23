export type MemoryRecordKind = 'session' | 'durable';
export type MemoryVisibilityFilter = 'all' | 'session' | 'durable' | 'pinned';

export interface MemoryRecord {
  id: string;
  kind: MemoryRecordKind;
  title: string;
  scope: string;
  summary: string;
  badge: string;
  status: 'active' | 'pending_approval' | 'idle';
  pinned: boolean;
  removable: boolean;
  tag: string;
  lastUpdated: string;
}

export function matchesMemoryFilter(record: MemoryRecord, filter: MemoryVisibilityFilter): boolean {
  switch (filter) {
    case 'session':
      return record.kind === 'session';
    case 'durable':
      return record.kind === 'durable';
    case 'pinned':
      return record.pinned;
    case 'all':
    default:
      return true;
  }
}

export function createMemoryRecords(): MemoryRecord[] {
  return [
    {
      id: 'memory-session-objective',
      kind: 'session',
      title: 'Current execution objective',
      scope: 'session / goal',
      summary: 'Prepare a migration script with explicit approval before any write-capable execution path is enabled.',
      badge: 'Pinned',
      status: 'active',
      pinned: true,
      removable: false,
      tag: 'goal',
      lastUpdated: 'just now',
    },
    {
      id: 'memory-session-schema',
      kind: 'session',
      title: 'Recent schema evidence',
      scope: 'session / tool output',
      summary: 'Users table inspected successfully. Runtime should preserve the evidence trail before proposing changes.',
      badge: 'Fresh',
      status: 'pending_approval',
      pinned: false,
      removable: true,
      tag: 'evidence',
      lastUpdated: '2 minutes ago',
    },
    {
      id: 'memory-session-policy',
      kind: 'session',
      title: 'Policy reminder',
      scope: 'session / governance',
      summary: 'Write operations remain approval-gated by default, even when a provider returns a valid migration plan.',
      badge: 'Guarded',
      status: 'idle',
      pinned: false,
      removable: true,
      tag: 'policy',
      lastUpdated: '5 minutes ago',
    },
    {
      id: 'memory-durable-provider',
      kind: 'durable',
      title: 'Default provider path starts local-first with LM Studio',
      scope: 'durable / provider',
      summary: 'Local-first provider defaults remain preferred so chat and execution validation stay observable and reproducible.',
      badge: 'Durable',
      status: 'active',
      pinned: true,
      removable: false,
      tag: 'provider',
      lastUpdated: 'today',
    },
    {
      id: 'memory-durable-policy',
      kind: 'durable',
      title: 'Traceability required for every sensitive action',
      scope: 'durable / policy',
      summary: 'Every sensitive step must retain auditable evidence that can be reviewed from the product surface.',
      badge: 'Rule',
      status: 'active',
      pinned: false,
      removable: false,
      tag: 'policy',
      lastUpdated: 'today',
    },
    {
      id: 'memory-durable-architecture',
      kind: 'durable',
      title: 'SDK contract remains shared between UI and CLI',
      scope: 'durable / architecture',
      summary: 'The runtime contract must stay consistent across surfaces so policy, trace, and execution semantics do not drift.',
      badge: 'Shared',
      status: 'idle',
      pinned: false,
      removable: true,
      tag: 'architecture',
      lastUpdated: 'yesterday',
    },
  ];
}
