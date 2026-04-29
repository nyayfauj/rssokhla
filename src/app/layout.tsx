import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ServiceWorkerRegistrar from '@/components/ServiceWorkerRegistrar';
import ErrorBoundary from '@/components/ErrorBoundary';
import ToastContainer from '@/components/ui/Toast';
import AppwritePing from '@/components/AppwritePing';
import PublicHeader from '@/components/layout/PublicHeader';

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
  description: 'Community-driven safety monitoring platform for Okhla — track, report, and verify activities in your neighborhood securely.',
  keywords: ['okhla', 'safety', 'monitor', 'community', 'reporting', 'nyayfauj', 'jamia nagar', 'shaheen bagh'],
  authors: [{ name: 'NyayFauj Community' }],
  applicationName: 'NyayFauj',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'NyayFauj — Okhla Community Monitor',
    description: 'Autonomous community-driven safety monitoring platform for Okhla.',
    url: '/',
    siteName: 'NyayFauj',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NyayFauj — Okhla Community Monitor',
    description: 'Autonomous community-driven safety monitoring platform for Okhla.',
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
          <AppwritePing />
          <ToastContainer />
          <PublicHeader />
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
