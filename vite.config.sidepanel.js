import { defineConfig } from 'vite';
import { resolve } from 'path';

// Built in a separate pass (emptyOutDir: false) so the side panel's shared UI
// code is inlined into a single self-contained module — keeping it out of the
// classic content script, which cannot use ES imports.
export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    // No benefit to preloading a local bundle in an extension page, and the
    // <link modulepreload> triggers a cross-world warning — turn it off.
    modulePreload: false,
    rollupOptions: {
      input: {
        sidepanel: resolve(__dirname, 'sidepanel.html'),
        contactpopup: resolve(__dirname, 'contact-popup.html')
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    }
  }
});
