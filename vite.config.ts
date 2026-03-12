import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      pwaAssets: {
        image: 'public/icon.svg',
        preset: {
          transparent: {
            sizes: [192, 512],
            favicons: [
              [32, 'favicon-32x32.png'],
              [16, 'favicon-16x16.png'],
            ],
          },
          maskable: {
            sizes: [],
          },
          apple: {
            sizes: [180],
          },
          assetName: (type, size) => {
            if (type === 'apple' && size.width === 180 && size.height === 180)
              return 'apple-touch-icon.png';

            if (type === 'transparent')
              return `pwa-${size.width}x${size.height}.png`;

            return `maskable-icon-${size.width}x${size.height}.png`;
          },
        },
      },
      manifest: {
        name: 'COCO Timer',
        short_name: 'COCO Timer',
        description: 'A timer for the Hario Switch New Hybrid Method',
        theme_color: '#6d4c41',
        background_color: '#FBF4F0',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,jpg,wav,json}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  publicDir: 'public',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test-setup.ts',
  },
});
