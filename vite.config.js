import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from "node:url";
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/npm
export default defineConfig({
  base: '/pokemon/',
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
});