import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  server: {
    // Toujours http://localhost:3000 : si le port est pris, Vite s'arrête au lieu de passer sur 3001.
    port: 3000,
    strictPort: true,
    open: true,
  },
  build: {
    outDir: 'build',
  },
})
