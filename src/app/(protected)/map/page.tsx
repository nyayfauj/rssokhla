// ─── Map Page ───────────────────────────────────────────────

'use client';

import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with mapbox-gl
const MapView = dynamic(() => import('@/components/map/MapView'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-zinc-900 rounded-2xl">
      <div className="text-center animate-pulse">
        <span className="text-5xl">🗺️</span>
        <p className="text-sm text-zinc-400 mt-3">Loading map...</p>
      </div>
    </div>
  ),
});

export default function MapPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-1rem)]">
      {/* Header */}
      <div className="flex items-center justify-between px-1 py-2 flex-shrink-0">
        <div>
          <h1 className="text-base sm:text-xl font-bold text-white">Area Map</h1>
          <p className="text-[10px] sm:text-xs text-zinc-500">Okhla monitoring zones & incidents</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span className="text-[10px] text-green-400 font-medium">LIVE</span>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 rounded-2xl overflow-hidden border border-zinc-800/40 min-h-0">
        <MapView />
      </div>

      {/* Legend (below map, mobile-friendly) */}
      <div className="flex-shrink-0 mt-2 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 min-w-max pb-1">
          {[
            { color: 'bg-red-500', label: 'Recruitment' },
            { color: 'bg-orange-500', label: 'Propaganda' },
            { color: 'bg-yellow-500', label: 'Meeting' },
            { color: 'bg-purple-500', label: 'Surveillance' },
            { color: 'bg-pink-500', label: 'Harassment' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-1.5 bg-zinc-900/60 border border-zinc-800/40 rounded-lg px-2 py-1">
              <span className={`w-2 h-2 rounded-full ${item.color}`} />
              <span className="text-[10px] text-zinc-400 whitespace-nowrap">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
