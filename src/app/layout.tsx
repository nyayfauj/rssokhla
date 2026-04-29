import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ServiceWorkerRegistrar from '@/components/ServiceWorkerRegistrar';
import ErrorBoundary from '@/components/ErrorBoundary';
import ToastContainer from '@/components/ui/Toast';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'NyayFauj — Okhla Community Monitor',
    template: '%s | NyayFauj',
  },
  description: 'Community-driven safety monitoring platform for Okhla — track, report, and verify RSS activities in your neighborhood.',
  keywords: ['okhla', 'safety', 'monitor', 'community', 'reporting', 'nyayfauj'],
  authors: [{ name: 'NyayFauj' }],
  applicationName: 'NyayFauj',
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
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0a0a0a',
  colorScheme: 'dark',
};

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
      <body className="font-sans bg-[#0a0a0a] text-zinc-100 antialiased overscroll-none">
        <ErrorBoundary>
          <ServiceWorkerRegistrar />
          <ToastContainer />
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
