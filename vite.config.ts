import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': '/src' },
  },
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router'],
          'vendor-editor': [
            '@tiptap/react',
            '@tiptap/starter-kit',
            'tiptap-markdown',
          ],
          'vendor-ai': ['ai', '@ai-sdk/anthropic', '@ai-sdk/openai'],
          'vendor-ui': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-toast',
          ],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['sql.js'],
  },
});
