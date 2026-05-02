import type { Metadata } from 'next';
import MapClient from '@/components/map/MapClient';

export const metadata: Metadata = {
  title: 'Safety Map — Okhla Community Monitor',
  description: 'Interactive map of reported safety incidents and community alerts in Okhla, New Delhi.',
  openGraph: {
    title: 'Safety Map — Okhla Community Monitor',
    description: 'Interactive map of reported safety incidents in Okhla.',
  },
};

export default function MapPage() {
  return <MapClient />;
}
