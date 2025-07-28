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
        // Cache busting için hash ekle
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      },
    },
    chunkSizeWarningLimit: 1000,
    minify: 'esbuild',
    target: 'es2015',
    // Build cache'ini temizle
    emptyOutDir: true,
    // Source map'leri devre dışı bırak (production için)
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
    // Dependency cache'ini temizle
    force: true,
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
  },
  // Cache busting için
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
});
