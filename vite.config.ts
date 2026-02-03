import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // Custom domain - no base path needed
  build: {
    outDir: 'dist',
  },
})
