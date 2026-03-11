import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: {
    alias: {
      '@magnetar/magnetar-sdk/agent': fileURLToPath(new URL('../../packages/magnetar-sdk/src/agent.ts', import.meta.url)),
      '@magnetar/magnetar-sdk/interfaces': fileURLToPath(new URL('../../packages/magnetar-sdk/src/interfaces.ts', import.meta.url)),
      '@magnetar/magnetar-sdk/models': fileURLToPath(new URL('../../packages/magnetar-sdk/src/models.ts', import.meta.url)),
      '@magnetar/magnetar-sdk/providers/lm-studio': fileURLToPath(new URL('../../packages/magnetar-sdk/src/providers/lm-studio.ts', import.meta.url)),
      '@magnetar/magnetar-sdk/tools/node-filesystem': fileURLToPath(new URL('../../packages/magnetar-sdk/src/tools/node-filesystem.ts', import.meta.url)),
      '@magnetar/magnetar-sdk/tools/web-filesystem': fileURLToPath(new URL('../../packages/magnetar-sdk/src/tools/web-filesystem.ts', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: 'coverage',
      thresholds: {
        lines: 100,
        branches: 100,
        functions: 100,
        statements: 100,
      },
    },
  },
});
