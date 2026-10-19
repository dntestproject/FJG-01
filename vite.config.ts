import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Sandbox/dev-tunnel hostnames are dynamic, so match them by suffix rather than
// disabling Vite's host check outright.
const ALLOWED_HOSTS = ['.prod-runtime.all-hands.dev', 'localhost', '127.0.0.1'];

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    allowedHosts: ALLOWED_HOSTS,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: false,
    allowedHosts: ALLOWED_HOSTS,
  },
});
