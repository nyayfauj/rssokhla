import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ServiceWorkerRegistrar from '@/components/ServiceWorkerRegistrar';
import ErrorBoundary from '@/components/ErrorBoundary';
import ToastContainer from '@/components/ui/Toast';
import AppwritePing from '@/components/AppwritePing';
import PublicHeader from '@/components/layout/PublicHeader';
import CommandPalette from '@/components/ui/CommandPalette';
import AlertToasts from '@/components/ui/AlertToasts';
import Footer from '@/components/layout/Footer';
import CookieConsent from '@/components/layout/CookieConsent';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://rssokhla.site'),
  title: {
    default: 'NyayFauj — Okhla Community Monitor',
    template: '%s | NyayFauj',
  },
  description: 'Community-driven safety monitoring platform for Okhla, New Delhi — report, track, and verify local activities securely.',
  keywords: ['okhla', 'community safety', 'incident reporting', 'okhla news', 'jamia nagar', 'shaheen bagh', 'new delhi'],
  authors: [{ name: 'NyayFauj Community' }],
  applicationName: 'NyayFauj',
  openGraph: {
    title: 'NyayFauj — Okhla Community Monitor',
    description: 'Community-powered safety monitoring for Okhla, New Delhi.',
    url: '/',
    siteName: 'NyayFauj',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NyayFauj — Okhla Community Monitor',
    description: 'Community-powered safety monitoring for Okhla, New Delhi.',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'NyayFauj',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0a0a0a',
  colorScheme: 'dark',
};

import BottomNav from '@/components/layout/BottomNav';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="font-sans bg-[#050606] text-zinc-100 antialiased overscroll-none selection:bg-red-500/30">
        {/* Cinematic Overlays */}
        <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none z-0" aria-hidden="true"></div>
        <div className="fixed inset-0 bg-scanline opacity-5 pointer-events-none z-10 animate-scan" aria-hidden="true"></div>
        
        <div className="relative z-20 min-h-screen flex flex-col">
          <ErrorBoundary>
            <ServiceWorkerRegistrar />
            <AppwritePing />
            <ToastContainer />
            <CommandPalette />
            <AlertToasts />
            <PublicHeader />
            <main className="flex-1 pb-20 sm:pb-0" role="main">
              {children}
            </main>
            <Footer />
            <CookieConsent />
            <BottomNav />
          </ErrorBoundary>
        </div>
      </body>
    </html>
  );
}
