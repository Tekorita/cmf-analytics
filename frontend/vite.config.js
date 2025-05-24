import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true, // 👈 IMPORTANTE: permite acceso desde fuera del contenedor
    strictPort: true // obliga a usar ese puerto exacto
  }
})
