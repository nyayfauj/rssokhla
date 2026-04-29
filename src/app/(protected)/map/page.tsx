// ─── Map Page ───────────────────────────────────────────────
'use client';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { OKHLA_AREAS } from '@/types/location.types';

export default function MapPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-white">Area Map</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Activity hotspots across Okhla</p>
      </div>
      <Card variant="elevated" padding="none" className="overflow-hidden">
        <div className="relative bg-zinc-900 h-64 flex items-center justify-center">
          <div className="text-center">
            <span className="text-5xl">🗺️</span>
            <p className="text-sm text-zinc-400 mt-3">Interactive map</p>
            <p className="text-xs text-zinc-600 mt-1">Connect Mapbox or Leaflet for live view</p>
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
        </div>
      </Card>
      <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Monitored Areas</h2>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(OKHLA_AREAS).map(([key, area]) => (
          <Card key={key} interactive padding="sm">
            <h3 className="text-sm font-semibold text-white">{area.label}</h3>
            <p className="text-[10px] text-zinc-500 mt-0.5">{area.center[0].toFixed(3)}°N, {area.center[1].toFixed(3)}°E</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
