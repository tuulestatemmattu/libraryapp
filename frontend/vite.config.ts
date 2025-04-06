import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    checker({
      typescript: {
        buildMode: true,
      },
    }),
  ],
  server: {
    allowedHosts: ['frontend-e2e'],
  },
});
