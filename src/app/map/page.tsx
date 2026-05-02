import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

export const metadata: Metadata = {
  title: 'Safety Map — Okhla Community Monitor',
  description: 'Interactive map of reported safety incidents and community alerts in Okhla, New Delhi.',
  openGraph: {
    title: 'Safety Map — Okhla Community Monitor',
    description: 'Interactive map of reported safety incidents in Okhla.',
  },
};

const MapView = dynamic(() => import('@/components/map/MapView'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-zinc-900 rounded-2xl">
      <div className="text-center animate-pulse">
        <span className="text-5xl" aria-hidden="true">&#x1F5FA;&#xFE0F;</span>
        <p className="text-sm text-zinc-400 mt-3">Loading map...</p>
      </div>
    </div>
  ),
});

const MapClient = dynamic(() => import('@/components/map/MapClient'), { ssr: false });

export default function MapPage() {
  return <MapClient />;
}
