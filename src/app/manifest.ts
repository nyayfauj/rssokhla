// ─── PWA Web App Manifest ───────────────────────────────────

import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NyayFauj — Okhla Monitor',
    short_name: 'NyayFauj',
    description: 'Community safety monitoring for Okhla — track, report, and verify RSS activities',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#dc2626',
    orientation: 'portrait',
    categories: ['security', 'news', 'social'],
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
