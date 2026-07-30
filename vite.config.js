import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  css: {
    // This project uses scoped Vue styles, not Tailwind/PostCSS.
    // Pass an explicit (empty) PostCSS config so Vite stops searching the
    // filesystem for a postcss.config.* file (prevents the stale
    // "@tailwindcss/postcss" not found error from the old template).
    postcss: {}
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: true,
    port: 3000,
    strictPort: false,
    // Reenvia las llamadas /api al servidor Express (puerto 3001)
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
})
