import { defineConfig } from 'vite'
import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    legacy({
      targets: ['defaults'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
    }),
    react()
  ],
})
