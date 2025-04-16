import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.spec.{ts,js}'],
    exclude: ['node_modules'],
    globals: true,
  },
});
