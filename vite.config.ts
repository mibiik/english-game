import path from "path"
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        const buildTime = new Date().toISOString();
        return html.replace('<%- BUILD_TIME %>', buildTime);
      }
    }
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react', 'react-icons'],
          'utils-vendor': ['axios', 'clsx', 'tailwind-merge'],
          'charts-vendor': ['recharts'],
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      },
    },
    chunkSizeWarningLimit: 1000,
    minify: 'esbuild',
    target: 'es2015',
    emptyOutDir: true,
    sourcemap: false,
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'lucide-react',
      'react-icons',
      'axios',
      'clsx',
      'tailwind-merge',
    ],
    force: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    hmr: {
      overlay: false,
    },
    host: 'localhost',
    port: 3000,
    fs: {
      strict: false,
    },
  },
  css: {
    modules: false,
    devSourcemap: false,
    preprocessorOptions: {
      css: {
        charset: false,
      },
    },
  },
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
});
