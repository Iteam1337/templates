import { defineConfig } from 'vite'

import react from '@vitejs/plugin-react'
import eslintPlugin from '@nabla/vite-plugin-eslint'

export default defineConfig({
  plugins: [react(), eslintPlugin()],
})
