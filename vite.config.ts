import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname,'./src'),
    },
  },
  server: {
    port: 3000,
    // Listen on all interfaces so the dockerised ngrok agent can reach it
    // via host.docker.internal (IPv4); the default binds to [::1] only.
    host: true,
    // Dev only: forward /api/* to the Flask backend (see VITE_API_BASE_URL).
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        rewrite: (p) => p.replace(/^\/api/, ''),
      },
    },
  },
});
