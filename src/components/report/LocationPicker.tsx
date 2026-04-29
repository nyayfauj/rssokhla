// ─── Location Picker (GPS + Manual + Landmark) ─────────────
'use client';

import { useState, useEffect, useCallback } from 'react';
import { OKHLA_AREAS, type OkhlaArea } from '@/types/location.types';

interface Props {
  area: OkhlaArea | '';
  onAreaChange: (area: OkhlaArea) => void;
  coordinates: [number, number] | null;
  onCoordinatesChange: (coords: [number, number]) => void;
  landmark: string;
  onLandmarkChange: (lm: string) => void;
}

type Mode = 'gps' | 'area' | 'landmark';

const LANDMARKS = [
  { label: 'Jamia Millia Islamia Gate', area: 'jamia_nagar' as OkhlaArea, coords: [28.5620, 77.2800] as [number, number] },
  { label: 'Shaheen Bagh Market', area: 'shaheen_bagh' as OkhlaArea, coords: [28.5440, 77.2940] as [number, number] },
  { label: 'Batla House Junction', area: 'batla_house' as OkhlaArea, coords: [28.5590, 77.2790] as [number, number] },
  { label: 'Zakir Nagar Market', area: 'zakir_nagar' as OkhlaArea, coords: [28.5650, 77.2830] as [number, number] },
  { label: 'Abul Fazal Main Gate', area: 'abul_fazal_enclave' as OkhlaArea, coords: [28.5530, 77.2850] as [number, number] },
  { label: 'Okhla Metro Station', area: 'okhla_phase_1' as OkhlaArea, coords: [28.5310, 77.2710] as [number, number] },
  { label: 'Jogabai Extension', area: 'johri_farm' as OkhlaArea, coords: [28.5560, 77.2900] as [number, number] },
  { label: 'Jasola Apollo Metro', area: 'jasola' as OkhlaArea, coords: [28.5400, 77.2600] as [number, number] },
  { label: 'Kalindi Kunj', area: 'shaheen_bagh' as OkhlaArea, coords: [28.5470, 77.3000] as [number, number] },
  { label: 'Thokar No. 8', area: 'batla_house' as OkhlaArea, coords: [28.5580, 77.2830] as [number, number] },
  { label: 'Noor Nagar Chowk', area: 'jamia_nagar' as OkhlaArea, coords: [28.5615, 77.2810] as [number, number] },
];

export default function LocationPicker({ area, onAreaChange, coordinates, onCoordinatesChange, landmark, onLandmarkChange }: Props) {
  const [mode, setMode] = useState<Mode>('area');
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [gpsError, setGpsError] = useState('');

  const captureGPS = useCallback(() => {
    if (!navigator.geolocation) { setGpsError('GPS not available'); setGpsStatus('error'); return; }
    setGpsStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onCoordinatesChange([pos.coords.latitude, pos.coords.longitude]);
        setGpsStatus('success');
        // Auto-detect nearest area
        let nearest: OkhlaArea = 'batla_house';
        let minDist = Infinity;
        (Object.entries(OKHLA_AREAS) as [OkhlaArea, { center: [number, number] }][]).forEach(([key, a]) => {
          const d = Math.hypot(a.center[0] - pos.coords.latitude, a.center[1] - pos.coords.longitude);
          if (d < minDist) { minDist = d; nearest = key; }
        });
        onAreaChange(nearest);
      },
      (err) => { setGpsError(err.message); setGpsStatus('error'); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [onAreaChange, onCoordinatesChange]);

  return (
    <div className="space-y-3">
      {/* Mode tabs */}
      <div className="flex gap-1 bg-zinc-900/60 rounded-xl p-1">
        {([['gps', '📍', 'GPS'], ['area', '🗺️', 'Area'], ['landmark', '🏛️', 'Landmark']] as [Mode, string, string][]).map(([m, icon, label]) => (
          <button key={m} type="button" onClick={() => setMode(m)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors ${
              mode === m ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}>
            <span>{icon}</span>{label}
          </button>
        ))}
      </div>

      {/* GPS Mode */}
      {mode === 'gps' && (
        <div className="space-y-2">
          <button type="button" onClick={captureGPS} disabled={gpsStatus === 'loading'}
            className="w-full py-3.5 bg-zinc-900 border border-zinc-700 rounded-xl text-sm font-medium text-white hover:bg-zinc-800 transition-colors active:scale-[0.98] flex items-center justify-center gap-2">
            {gpsStatus === 'loading' ? (
              <><span className="animate-spin">⏳</span> Detecting location...</>
            ) : gpsStatus === 'success' ? (
              <><span className="text-green-400">✓</span> Location captured</>
            ) : (
              <><span>📍</span> Capture Current Location</>
            )}
          </button>
          {gpsStatus === 'success' && coordinates && (
            <p className="text-[10px] text-green-400 text-center font-mono">{coordinates[0].toFixed(4)}°N, {coordinates[1].toFixed(4)}°E · {area ? OKHLA_AREAS[area as OkhlaArea]?.label : ''}</p>
          )}
          {gpsStatus === 'error' && <p className="text-[10px] text-red-400 text-center">{gpsError}</p>}
        </div>
      )}

      {/* Area Mode */}
      {mode === 'area' && (
        <div className="grid grid-cols-2 gap-1.5">
          {(Object.entries(OKHLA_AREAS) as [OkhlaArea, { label: string; center: [number, number] }][]).map(([key, a]) => (
            <button key={key} type="button" onClick={() => { onAreaChange(key); onCoordinatesChange(a.center); }}
              className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all text-left active:scale-[0.97] ${
                area === key ? 'border-red-500 bg-red-500/10 text-white' : 'border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-600'
              }`}>
              {a.label}
            </button>
          ))}
        </div>
      )}

      {/* Landmark Mode */}
      {mode === 'landmark' && (
        <div className="space-y-1.5 max-h-52 overflow-y-auto scrollbar-hide">
          {LANDMARKS.map(lm => (
            <button key={lm.label} type="button" onClick={() => { onLandmarkChange(lm.label); onAreaChange(lm.area); onCoordinatesChange(lm.coords); }}
              className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl border text-left transition-all text-xs active:scale-[0.98] ${
                landmark === lm.label ? 'border-red-500 bg-red-500/10 text-white' : 'border-zinc-800/40 bg-zinc-900/30 text-zinc-400 hover:border-zinc-600'
              }`}>
              <span className="text-sm">🏛️</span>
              <div>
                <p className="font-medium">{lm.label}</p>
                <p className="text-[10px] text-zinc-600">{OKHLA_AREAS[lm.area]?.label}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
