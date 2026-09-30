import { defineConfig } from 'vite';

export default defineConfig({
  // Root is the portfolio folder itself
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Minify for production
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      input: './index.html',
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
