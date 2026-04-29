import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build'
  },
  server: {
    watch: {
      ignored: ['**/db/**', '**/uploads/**']
    },
    proxy: {
      '/backend-service': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/backend-service/, '')
      }
    }
  }
})
