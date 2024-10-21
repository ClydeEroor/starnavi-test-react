import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import EnvironmentPlugin from "vite-plugin-environment"

export default defineConfig({
  plugins: [react(),EnvironmentPlugin("all")],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  define: {
    'process.env': process.env // Убедитесь, что env переменные корректно передаются
  }
})
