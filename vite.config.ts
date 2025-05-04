import { splitVendorChunkPlugin,defineConfig } from 'vite'

import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),splitVendorChunkPlugin()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    watch: {
      usePolling: true,
      interval: 3000
    },
  },
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/js/vendor/[hash].js',
        entryFileNames: 'assets/js/[name].js',
      },
    },
  },
  base:'./',
});