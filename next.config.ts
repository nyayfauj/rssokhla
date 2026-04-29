import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ─── Image Optimization ─────────────────────────────────
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cloud.appwrite.io',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },

  // ─── Security Headers ──────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
    ];
  },

  // ─── PWA / Service Worker ──────────────────────────────
  async rewrites() {
    return [];
  },

  // ─── Experimental / Performance ────────────────────────
  experimental: {
    optimizePackageImports: ['zustand', 'appwrite'],
  },
};

export default nextConfig;
