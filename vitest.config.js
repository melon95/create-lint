import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    moduleNameMapper: {
      '^(.{1,2}/.*).(js|jsx|ts|tsx)$': '$1',
    },
    include: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
    exclude: ['node_modules/**'],
    testTimeout: 5000,
  },
});
