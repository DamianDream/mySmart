import { defineConfig } from 'vite';
import { resolve } from 'path';
import copy from 'rollup-plugin-copy';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        content: resolve(__dirname, 'src/content/index.js'),
        background: resolve(__dirname, 'src/background.js')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  },
  plugins: [
    copy({
      targets: [
        { src: 'src/manifest.json', dest: 'dist' },
        { src: 'src/icons', dest: 'dist' },
        { src: 'src/sidebar.css', dest: 'dist' },
        { src: 'src/interceptor.js', dest: 'dist' }
      ],
      hook: 'writeBundle'
    })
  ]
});
