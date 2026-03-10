import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';

export default defineConfig({
  test: {
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    root: './',
    environment: 'node',
  },
  plugins: [
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
});
