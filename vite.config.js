import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base '/pizza/' makes generated asset URLs resolve correctly once the app is
// served under yourdomain.com/pizza via the main site's Vercel rewrite.
export default defineConfig({
  base: '/pizzashop-front/',
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_BACKEND_PROXY_TARGET || 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
