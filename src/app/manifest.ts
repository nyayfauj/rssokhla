import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NyayFauj — Okhla Community Monitor',
    short_name: 'NyayFauj',
    description: 'Community-powered safety monitoring platform for Okhla — report, track, and verify local activities securely.',
    start_url: '/',
    display: 'standalone',
    background_color: '#050606',
    theme_color: '#dc2626',
    orientation: 'portrait',
    categories: ['safety', 'community', 'news'],
    shortcuts: [
      {
        name: 'Report Incident',
        url: '/incidents/report',
        icons: [{ src: '/icons/icon-192x192.png', sizes: '192x192' }],
      },
      {
        name: 'Community Monitor',
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
