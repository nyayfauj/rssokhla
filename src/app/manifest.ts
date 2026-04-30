// ─── PWA Web App Manifest ───────────────────────────────────

import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NyayFauj // Intelligence Hub',
    short_name: 'NyayFauj',
    description: 'High-fidelity community intelligence & tactical monitoring for the Okhla Sector.',
    start_url: '/',
    display: 'standalone',
    background_color: '#050606',
    theme_color: '#dc2626',
    orientation: 'portrait',
    categories: ['security', 'news', 'social'],
    shortcuts: [
      {
        name: 'Transmit Intel',
        url: '/incidents/report',
        icons: [{ src: '/icons/icon-192x192.png', sizes: '192x192' }],
      },
      {
        name: 'Strategic Overview',
        url: '/',
        icons: [{ src: '/icons/icon-192x192.png', sizes: '192x192' }],
      },
    ],
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
