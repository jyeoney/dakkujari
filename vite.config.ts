import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Vitest 번들링 Vite와 프로젝트 Vite 타입 불일치
  plugins: [react()] as any,
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './src/test/setup.ts'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
