import { defineConfig } from 'vitest/config';
import path from 'path';

const isIntegration = process.env.TEST_SUITE === 'integration';

export default defineConfig({
  resolve: {
    alias: {
      '@domain': path.resolve(__dirname, './src/domain'),
      '@application': path.resolve(__dirname, './src/application'),
      '@infrastructure': path.resolve(__dirname, './src/infrastructure'),
      '@presentation': path.resolve(__dirname, './src/presentation'),
    },
  },
  test: {
    include: isIntegration
      ? ['src/__tests__/integration/**/*.test.ts']
      : ['src/__tests__/unit/**/*.test.ts'],
    setupFiles: isIntegration ? ['src/__tests__/integration/setup.ts'] : [],
    testTimeout: isIntegration ? 30000 : 5000,
    reporters: ['default', 'junit'],
    outputFile: {
      junit: isIntegration
        ? './test-results/integration-results.xml'
        : './test-results/unit-results.xml',
    },
  },
});
