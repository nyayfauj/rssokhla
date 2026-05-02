'use client';

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useIncidentsStore } from '@/stores/incidents.store';

const MapView = dynamic(() => import('@/components/map/MapView'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-zinc-900 rounded-2xl">
      <div className="text-center animate-pulse">
        <span className="text-5xl" aria-hidden="true">🗺️</span>
        <p className="text-sm text-zinc-400 mt-3">Loading map...</p>
      </div>
    </div>
  ),
});

const CATEGORY_LABELS = [
  { color: 'bg-red-600', label: 'Suspicious Activity' },
  { color: 'bg-orange-600', label: 'Harassment' },
  { color: 'bg-yellow-500', label: 'Community Incident' },
  { color: 'bg-purple-600', label: 'Surveillance Reported' },
  { color: 'bg-pink-600', label: 'Public Nuisance' },
];

export default function MapClient() {
  const { incidents, fetchIncidents, isLoading } = useIncidentsStore();

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  const incidentCount = useMemo(() => incidents.length, [incidents]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-1rem)]">
      {/* Header */}
      <div className="flex items-center justify-between px-1 py-2 flex-shrink-0">
        <div>
          <h1 className="text-xl font-semibold text-white flex items-center gap-2">
            <span className="text-red-500" aria-hidden="true">🗺️</span> Community Safety Map
          </h1>
          <p className="text-xs text-zinc-500">Reported incidents and safety alerts</p>
        </div>
        <div className="flex items-center gap-3 bg-zinc-900/50 border border-zinc-800 rounded-full px-3 py-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative rounded-full h-2 w-2 bg-red-600" />
          </span>
          <span className="text-xs text-zinc-300 font-medium">
            {isLoading ? 'Loading...' : `${incidentCount} active`}
          </span>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 rounded-2xl overflow-hidden border border-zinc-800/40 min-h-0 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <MapView incidents={incidents} />
      </div>

      {/* Legend */}
      <div className="flex-shrink-0 mt-3 overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 min-w-max pb-2">
          {CATEGORY_LABELS.map(item => (
            <div key={item.label} className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 rounded-xl px-3 py-1.5 shadow-lg">
              <span className={`w-2 h-2 rounded-full ${item.color}`} />
              <span className="text-xs text-zinc-400 whitespace-nowrap">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
