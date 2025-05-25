import { defineConfig } from 'vite'
import wasm from "vite-plugin-wasm"
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    wasm(),
    react()
  ],
  build: {
    target: 'esnext'
  }
})
