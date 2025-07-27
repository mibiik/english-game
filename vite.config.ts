import path from "path"
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react', 'react-icons'],
          'firebase-vendor': ['firebase', 'react-firebase-hooks'],
          'utils-vendor': ['axios', 'clsx', 'tailwind-merge'],
          'charts-vendor': ['recharts'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'lucide-react',
      'react-icons',
      'firebase',
      'axios',
      'clsx',
      'tailwind-merge',
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "firebase": "firebase/app",
    },
  },
  server: {
    hmr: {
      overlay: false,
    },
    host: 'localhost',
    port: 3000,
  },
});
