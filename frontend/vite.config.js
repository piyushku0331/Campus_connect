import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    react({
      fastRefresh: true,
      jsxRuntime: 'automatic'
    }),
    legacy({
      targets: ['defaults', 'not IE 11']
    })
  ],
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg', '**/*.webp'],
  publicDir: 'public',
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssCodeSplit: true,
    sourcemap: false,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react-vendor';
          }
          if (id.includes('react-router')) {
            return 'router';
          }
          if (id.includes('lucide-react') || id.includes('react-hot-toast')) {
            return 'ui-vendor';
          }
          if (id.includes('axios')) {
            return 'http-client';
          }
          if (id.includes('useAuth') || id.includes('ProtectedRoute')) {
            return 'auth';
          }
          if (id.includes('/pages/')) {
            return 'pages';
          }
          if (id.includes('/components/')) {
            return 'components';
          }
        }
      },
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
        unknownGlobalSideEffects: false
      }
    },
    cssMinify: 'esbuild',
    modulePreload: {
      polyfill: false
    }
  },
  server: {
    hmr: {
      overlay: false
    },
    compress: true
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios',
      'lucide-react',
      'react-hot-toast'
    ],
    force: true,
    exclude: []
  },
  esbuild: {
    drop: ['console', 'debugger'],
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true
  }
})
