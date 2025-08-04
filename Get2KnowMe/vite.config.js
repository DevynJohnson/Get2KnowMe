import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  root: './client',
  build: {
    outDir: '../dist',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          bootstrap: ['react-bootstrap', 'bootstrap'],
          qr: ['qrcode', '@zxing/library'],
          fontawesome: [
            '@fortawesome/fontawesome-svg-core',
            '@fortawesome/free-solid-svg-icons',
            '@fortawesome/react-fontawesome'
          ]
        }
      }
    },
    // Ensure assets are properly handled for production
    assetsDir: 'assets',
    sourcemap: false, // Disable sourcemaps for production to reduce bundle size
    minify: 'terser', // Use terser for better minification
    target: 'es2015' // Ensure compatibility with older browsers
  },
  cssCodeSplit: true,
  // Ensure FontAwesome dependencies are optimized
  optimizeDeps: {
    include: [
      '@fortawesome/fontawesome-svg-core',
      '@fortawesome/free-solid-svg-icons',
      '@fortawesome/react-fontawesome'
    ]
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
})