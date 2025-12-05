import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import autoImport from 'unplugin-auto-import/vite'
import tailwindcss from '@tailwindcss/vite'
import vueRouter from 'unplugin-vue-router/vite'
import vueRouterConfigurations from './src/router/configuration'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vueRouter(vueRouterConfigurations),
    vue({
      features: {
        propsDestructure: true,
      },
    }),
    vueJsx(),
    vueDevTools(),
    tailwindcss(),
    autoImport({
      imports: ['vue', 'pinia', 'vue-router'],
      dts: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~': fileURLToPath(new URL('./modules', import.meta.url)),
    },
  },
})
