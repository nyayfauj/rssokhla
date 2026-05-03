'use client';

import dynamic from 'next/dynamic';
import Skeleton from '@/components/ui/Skeleton';

const MapClient = dynamic(() => import('@/components/map/MapClient'), {
  ssr: false,
  loading: () => <Skeleton lines={1} height="600px" className="rounded-2xl border-zinc-800 w-full" />,
});

export default function MapWrapper() {
  return <MapClient />;
}
