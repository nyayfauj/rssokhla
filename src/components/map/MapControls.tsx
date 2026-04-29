// ─── Map Layer Controls ─────────────────────────────────────

'use client';

import { useState } from 'react';
import type { ActiveLayers } from './MapView';

interface Props {
  activeLayers: ActiveLayers;
  onToggleLayer: (layer: keyof ActiveLayers) => void;
  compassActive: boolean;
  onToggleCompass: () => void;
  compassHeading: number | null;
}

const LAYER_OPTIONS: { key: keyof ActiveLayers; label: string; icon: string }[] = [
  { key: 'incidents', label: 'Incidents', icon: '📍' },
  { key: 'heatmap', label: 'Heatmap', icon: '🔥' },
  { key: 'geofences', label: 'Zones', icon: '⭕' },
  { key: 'labels', label: 'Labels', icon: '🏷️' },
];

export default function MapControls({ activeLayers, onToggleLayer, compassActive, onToggleCompass, compassHeading }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      {/* Toggle button */}
      <button onClick={() => setOpen(!open)}
        className="w-10 h-10 bg-zinc-900/90 backdrop-blur border border-zinc-800/60 rounded-xl flex items-center justify-center text-sm hover:bg-zinc-800/90 transition-colors shadow-lg">
        🗂️
      </button>

      {/* Panel */}
      {open && (
        <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-800/60 rounded-2xl p-2.5 shadow-2xl min-w-[140px] animate-fade-in">
          <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-semibold px-1 mb-1.5">Layers</p>
          {LAYER_OPTIONS.map(opt => (
            <button key={opt.key} onClick={() => onToggleLayer(opt.key)}
              className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-left text-xs transition-colors ${
                activeLayers[opt.key] ? 'bg-red-500/10 text-red-400' : 'text-zinc-500 hover:bg-zinc-800/50'
              }`}>
              <span>{opt.icon}</span>
              <span className="flex-1">{opt.label}</span>
              <span className={`w-2 h-2 rounded-full ${activeLayers[opt.key] ? 'bg-red-500' : 'bg-zinc-700'}`} />
            </button>
          ))}

          <div className="h-px bg-zinc-800/50 my-1.5" />

          {/* Compass */}
          <button onClick={onToggleCompass}
            className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-left text-xs transition-colors ${
              compassActive ? 'bg-blue-500/10 text-blue-400' : 'text-zinc-500 hover:bg-zinc-800/50'
            }`}>
            <span>🧭</span>
            <span className="flex-1">Compass</span>
            {compassActive && compassHeading !== null && (
              <span className="text-[10px] font-mono">{Math.round(compassHeading)}°</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
