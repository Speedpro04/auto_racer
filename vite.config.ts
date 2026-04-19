import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  base: '/',
  server: {
    port: 3000,
    host: true
  },
  preview: {
    allowedHosts: ['auto.axoshub.com', 'localhost'],
    port: 3000,
    host: true
  },
  ssr: {
    noExternal: ['framer-motion']
  }
})
