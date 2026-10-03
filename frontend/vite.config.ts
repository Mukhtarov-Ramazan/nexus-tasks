import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import ui from '@nuxt/ui/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    ui({
      ui: {
        colors: {
          primary: 'black',
          secondary: 'sky',
          neutral: 'neutral',
        },
        container: {
          base: 'w-full max-w-(1920px) mx-auto px-4 sm:px-6 lg:px-8',
        },
      },
    }),
  ],
  server: {
    // На этой машине IPv6-loopback (::1) не работает, а Vite по умолчанию слушает именно его
    host: '127.0.0.1',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // additionalData: `@import "@/app/assets/styles/_variables.scss";`
      },
    },
  },
});
