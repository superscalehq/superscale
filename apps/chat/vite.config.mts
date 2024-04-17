import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),
      output: {
        dir: path.resolve(__dirname, 'dist'),
        entryFileNames: 'index.js',
        assetFileNames: '[name].[ext]',
        chunkFileNames: '[name].js',
        preserveModules: false,
      },
    },
    assetsDir: '.',
  },
  publicDir: path.resolve(__dirname, 'public'),
  plugins: [
    svelte({
      configFile: path.resolve(__dirname, 'svelte.config.mjs'),
    }),
  ],
});
