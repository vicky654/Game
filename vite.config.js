import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ─── Vite Config ──────────────────────────────────────────────────────────────
// API calls now use full URLs resolved by src/config/api.js (dev vs prod),
// so the /api proxy below is no longer needed. Kept commented out for reference
// in case you ever want to run both frontend and backend on the same dev host.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:5000',
    //     changeOrigin: true,
    //   },
    // },
  },
})
