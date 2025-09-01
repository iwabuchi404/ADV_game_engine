import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import path from 'path';

export default defineConfig({
  plugins: [react(), vanillaExtractPlugin()],
  base: process.env.NODE_ENV === 'production' ? '/ADV_game_engine/' : '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
  server: {
    fs: {
      allow: ['./'], // プロジェクトルートを明示的に許可
    },
    headers: {
      'Accept-Encoding': 'gzip, deflate, br',
    },
  },
});
