import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// base:'./' 关键：产物使用相对路径，确保 doubao-html / Cloudflare Pages / IGA Pages 都能正确打包与访问
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    chunkSizeWarningLimit: 700
  }
})
