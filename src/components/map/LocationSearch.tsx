// ─── Location Search (Okhla-specific) ──────────────────────

'use client';

import { useState, useRef, useEffect } from 'react';
import { OKHLA_AREAS, type OkhlaArea } from '@/types/location.types';
import { GEOFENCE_ZONES } from '@/lib/map/config';

interface Props {
  onSelect: (lng: number, lat: number) => void;
}

interface SearchResult {
  id: string;
  label: string;
  sub: string;
  lng: number;
  lat: number;
  type: 'area' | 'zone' | 'custom';
}

// Pre-built search index
function buildSearchIndex(): SearchResult[] {
  const results: SearchResult[] = [];

  // Areas
  (Object.entries(OKHLA_AREAS) as [OkhlaArea, typeof OKHLA_AREAS[OkhlaArea]][]).forEach(([key, area]) => {
    results.push({
      id: `area-${key}`, label: area.label, sub: 'Monitored Area',
      lng: area.center[1], lat: area.center[0], type: 'area',
    });
  });

  // Geofence zones
  GEOFENCE_ZONES.forEach(zone => {
    results.push({
      id: zone.id, label: zone.label, sub: `${zone.type} · ${zone.radius}m zone`,
      lng: zone.center[0], lat: zone.center[1], type: 'zone',
    });
  });

  // Custom Okhla landmarks
  const landmarks = [
    { label: 'Jamia Millia Islamia', sub: 'University', lng: 77.2800, lat: 28.5620 },
    { label: 'Okhla Bird Sanctuary', sub: 'Landmark', lng: 77.3050, lat: 28.5520 },
    { label: 'Kalindi Kunj', sub: 'Bridge/Park', lng: 77.3000, lat: 28.5470 },
    { label: 'Okhla Metro Station', sub: 'Transit', lng: 77.2700, lat: 28.5310 },
    { label: 'Sukhdev Vihar Metro', sub: 'Transit', lng: 77.2670, lat: 28.5360 },
    { label: 'Jasola Apollo Metro', sub: 'Transit', lng: 77.2610, lat: 28.5410 },
    { label: 'Haji Colony', sub: 'Locality', lng: 77.2830, lat: 28.5600 },
    { label: 'Ghaffar Manzil Colony', sub: 'Locality', lng: 77.2820, lat: 28.5610 },
    { label: 'Thokar No. 8', sub: 'Junction', lng: 77.2830, lat: 28.5580 },
  ];
  landmarks.forEach((lm, i) => {
    results.push({ id: `lm-${i}`, ...lm, type: 'custom' });
  });

  return results;
}

const SEARCH_INDEX = buildSearchIndex();

export default function LocationSearch({ onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const q = query.toLowerCase();
    const filtered = SEARCH_INDEX.filter(r =>
      r.label.toLowerCase().includes(q) || r.sub.toLowerCase().includes(q)
    ).slice(0, 6);
    setResults(filtered);
  }, [query]);

  const handleSelect = (r: SearchResult) => {
    setQuery(r.label);
    setResults([]);
    setFocused(false);
    inputRef.current?.blur();
    onSelect(r.lng, r.lat);
  };

  const typeIcon = (type: string) => type === 'area' ? '📍' : type === 'zone' ? '⭕' : '🏛️';

  return (
    <div className="relative">
      <div className="relative">
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-500">🔍</span>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search Okhla locations..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          className="w-full bg-zinc-900/90 backdrop-blur-xl border border-zinc-800/60 text-white placeholder-zinc-600 rounded-xl pl-8 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-red-500/30 shadow-lg"
        />
        {query && (
          <button onClick={() => { setQuery(''); setResults([]); }} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white text-xs">✕</button>
        )}
      </div>

      {/* Results dropdown */}
      {focused && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-900/95 backdrop-blur-xl border border-zinc-800/60 rounded-xl overflow-hidden shadow-2xl z-20">
          {results.map(r => (
            <button key={r.id} onClick={() => handleSelect(r)}
              className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-zinc-800/50 transition-colors border-b border-zinc-800/20 last:border-0">
              <span className="text-sm">{typeIcon(r.type)}</span>
              <div className="min-w-0">
                <p className="text-xs text-white truncate">{r.label}</p>
                <p className="text-[10px] text-zinc-500 truncate">{r.sub}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
