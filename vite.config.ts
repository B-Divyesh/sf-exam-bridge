import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { writeServiceWorker } from './scripts/build-service-worker.mjs';

export default defineConfig({
  plugins: [{
    name: 'exam-bridge-final-build-service-worker',
    apply: 'build',
    closeBundle: async () => { await writeServiceWorker(resolve(process.cwd(), 'dist')); },
  }],
  build: { target: 'es2022', outDir: 'dist' },
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
});
