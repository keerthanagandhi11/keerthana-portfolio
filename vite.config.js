import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative asset paths so the build works at a domain root or a sub-path (GitHub Pages)
  base: './',
  server: {
    port: 5173,
    host: true
  }
})
