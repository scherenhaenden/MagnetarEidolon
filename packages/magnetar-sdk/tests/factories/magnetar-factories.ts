import type { ToolResult } from '../../src/interfaces.js';
import type {
  EnvironmentSnapshot,
  Goal,
  MagnetarEidolon,
  MemoryItem,
  Task,
  ToolCall,
} from '../../src/models.js';
import { createTestFaker } from './faker.js';

type FactoryFaker = ReturnType<typeof createTestFaker>;

function withDefaults<T>(value: T, overrides?: Partial<T>): T {
  return {
    ...value,
    ...overrides,
  };
}

export function createGoal(overrides?: Partial<Goal>, faker = createTestFaker()): Goal {
  return withDefaults(
    {
      id: faker.string.uuid(),
      description: faker.company.catchPhrase(),
      createdAt: faker.date.recent(),
      status: faker.helpers.arrayElement(['pending', 'active', 'completed', 'failed'] as const),
    },
    overrides,
  );
}

export function createTask(overrides?: Partial<Task>, faker = createTestFaker()): Task {
  return withDefaults(
    {
      id: faker.string.uuid(),
      description: faker.hacker.phrase(),
      status: faker.helpers.arrayElement(['planned', 'in_progress', 'completed', 'failed'] as const),
      result: faker.lorem.sentence(),
    },
    overrides,
  );
}

export function createMemoryItem(overrides?: Partial<MemoryItem>, faker = createTestFaker()): MemoryItem {
  return withDefaults(
    {
      id: faker.string.uuid(),
      content: faker.lorem.paragraph(),
      embeddingId: faker.string.alphanumeric(12),
      timestamp: faker.date.recent(),
      metadata: {
        source: faker.helpers.arrayElement(['tool', 'reflection', 'user'] as const),
        priority: faker.number.int({ min: 1, max: 5 }),
      },
    },
    overrides,
  );
}

export function createToolCall(overrides?: Partial<ToolCall>, faker = createTestFaker()): ToolCall {
  return withDefaults(
    {
      toolName: faker.helpers.arrayElement(['search', 'write_file', 'list_dir', 'run_command'] as const),
      arguments: {
        query: faker.lorem.words(3),
        limit: faker.number.int({ min: 1, max: 10 }),
      },
      result: faker.lorem.sentence(),
      error: undefined,
      timestamp: faker.date.recent(),
    },
    overrides,
  );
}

export function createEnvironmentSnapshot(
  overrides?: Partial<EnvironmentSnapshot>,
  faker = createTestFaker(),
): EnvironmentSnapshot {
  return withDefaults(
    {
      os: faker.helpers.arrayElement(['linux', 'macos', 'windows', 'web'] as const),
      currentDirectory: faker.system.directoryPath(),
      timestamp: faker.date.recent(),
    },
    overrides,
  );
}

export function createMagnetarState(
  overrides?: Partial<MagnetarEidolon>,
  faker = createTestFaker(),
): MagnetarEidolon {
  return withDefaults(
    {
      agentId: faker.string.uuid(),
      goal: createGoal(undefined, faker),
      plan: Array.from({ length: 2 }, () => createTask(undefined, faker)),
      shortTermMemory: Array.from({ length: 2 }, () => createMemoryItem(undefined, faker)),
      toolHistory: Array.from({ length: 2 }, () => createToolCall(undefined, faker)),
      environment: createEnvironmentSnapshot(undefined, faker),
      metadata: {
        runLabel: faker.word.words(2),
        createdBy: 'faker-factory',
      },
    },
    overrides,
  );
}

export function createToolResult(overrides?: Partial<ToolResult>, faker = createTestFaker()): ToolResult {
  return withDefaults(
    {
      success: true,
      output: faker.lorem.sentence(),
      error: undefined,
    },
    overrides,
  );
}
