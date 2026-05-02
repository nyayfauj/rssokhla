// ─── Location Picker (Ward + Colony + GPS + Manual) ──────────
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { OKHLA_WARDS, type Ward, type Colony } from '@/lib/utils/wards';
import { OKHLA_AREAS, type OkhlaArea } from '@/types/location.types';

interface Props {
  area: string;
  onAreaChange: (area: string) => void;
  coordinates: [number, number] | null;
  onCoordinatesChange: (coords: [number, number]) => void;
  landmark: string;
  onLandmarkChange: (lm: string) => void;
}

type Mode = 'gps' | 'wards' | 'address';

export default function LocationPicker({ 
  area, 
  onAreaChange, 
  coordinates, 
  onCoordinatesChange, 
  landmark, 
  onLandmarkChange 
}: Props) {
  const [mode, setMode] = useState<Mode>('wards');
  const [selectedWardId, setSelectedWardId] = useState<string | null>(null);
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [gpsError, setGpsError] = useState('');

  // Find selected ward and colony for UI states
  const selectedWard = useMemo(() => 
    OKHLA_WARDS.find(w => w.id === selectedWardId), 
  [selectedWardId]);

  // GPS Logic
  const captureGPS = useCallback(() => {
    if (!navigator.geolocation) { 
      setGpsError('GPS not available'); 
      setGpsStatus('error'); 
      return; 
    }
    
    setGpsStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        onCoordinatesChange([lat, lng]);
        setGpsStatus('success');

        // 1. Find nearest Ward
        let nearestWard = OKHLA_WARDS[0];
        let minWardDist = Infinity;
        OKHLA_WARDS.forEach(w => {
          const d = Math.hypot(w.center[0] - lat, w.center[1] - lng);
          if (d < minWardDist) { minWardDist = d; nearestWard = w; }
        });

        setSelectedWardId(nearestWard.id);
        onAreaChange(nearestWard.id);

        // 2. Since we don't have per-colony coords, we just stay at ward level 
        // or the user can refine. 
        setMode('wards');
      },
      (err) => { 
        setGpsError(err.message); 
        setGpsStatus('error'); 
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [onAreaChange, onCoordinatesChange]);

  const handleWardSelect = (ward: Ward) => {
    setSelectedWardId(ward.id);
    onAreaChange(ward.id);
    onCoordinatesChange(ward.center);
    onLandmarkChange(''); // Reset colony/address when ward changes
  };

  const handleColonySelect = (colony: Colony) => {
    onLandmarkChange(colony.name);
  };

  return (
    <div className="space-y-6">
      {/* Mode Navigation */}
      <div className="flex gap-2 p-1.5 bg-black/40 border border-zinc-800/50 rounded-2xl">
        {(['gps', 'wards', 'address'] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              mode === m 
                ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {m === 'gps' && '📍 GPS'}
            {m === 'wards' && '🗺️ Areas'}
            {m === 'address' && '🏠 Address'}
          </button>
        ))}
      </div>

      <div className="min-h-[280px] animate-in fade-in slide-in-from-bottom-2 duration-500">
        {/* GPS Mode */}
        {mode === 'gps' && (
          <div className="flex flex-col items-center justify-center h-full space-y-6 py-8">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
              gpsStatus === 'loading' ? 'bg-red-600/10 animate-pulse' : 'bg-zinc-900 border border-zinc-800'
            }`}>
              <span className="text-3xl">{gpsStatus === 'success' ? '✅' : '📡'}</span>
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="text-sm font-black text-white uppercase tracking-tighter">Precision Geolocation</h3>
              <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest leading-relaxed">
                Automatically detect your current ward and <br/> sector for rapid response.
              </p>
            </div>

            <button
              type="button"
              onClick={captureGPS}
              disabled={gpsStatus === 'loading'}
              className="px-8 py-3 bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-xl shadow-red-900/20 hover:bg-red-500 transition-all active:scale-95 disabled:opacity-50"
            >
              {gpsStatus === 'loading' ? 'Locating Node...' : 'Acquire GPS Signal'}
            </button>

            {gpsError && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest">{gpsError}</p>}
          </div>
        )}

        {/* Ward/Colony Mode */}
        {mode === 'wards' && (
          <div className="space-y-6">
            {!selectedWardId ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 px-1">
                  <span className="w-1 h-4 bg-red-600 rounded-full" />
                  <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Select Municipal Ward</h3>
                </div>
                <div className="grid grid-cols-1 gap-2.5">
                  {OKHLA_WARDS.map(ward => (
                    <button
                      key={ward.id}
                      type="button"
                      onClick={() => handleWardSelect(ward)}
                      className="group flex items-center justify-between p-4 bg-zinc-900/40 border border-zinc-800/60 rounded-2xl hover:border-red-600/50 hover:bg-zinc-900/60 transition-all text-left"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[8px] font-black bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded uppercase">Ward {ward.number}</span>
                          <h4 className="text-xs font-black text-white uppercase tracking-tight">{ward.name}</h4>
                        </div>
                        <p className="text-[9px] text-zinc-600 font-medium">{ward.description}</p>
                      </div>
                      <span className="text-zinc-700 group-hover:text-red-500 group-hover:translate-x-1 transition-all">→</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center justify-between px-1">
                  <button 
                    onClick={() => setSelectedWardId(null)}
                    className="text-[9px] font-black text-red-500 uppercase tracking-widest hover:text-red-400 transition-colors"
                  >
                    ← Back to Wards
                  </button>
                  <span className="text-[10px] font-black text-white uppercase italic">{selectedWard?.name}</span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 px-1">
                    <span className="w-1 h-4 bg-red-600 rounded-full" />
                    <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Select Specific Colony/Area</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedWard?.colonies.map(colony => (
                      <button
                        key={colony.id}
                        type="button"
                        onClick={() => handleColonySelect(colony)}
                        className={`p-3.5 rounded-xl border text-[10px] font-black uppercase tracking-tight text-left transition-all active:scale-[0.97] ${
                          landmark === colony.name 
                            ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-900/20' 
                            : 'bg-zinc-900/40 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                        }`}
                      >
                        {colony.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Address Mode */}
        {mode === 'address' && (
          <div className="space-y-6 py-2">
             <div className="flex items-center gap-3 px-1">
                <span className="w-1 h-4 bg-red-600 rounded-full" />
                <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Manual Address Override</h3>
              </div>
              
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600/20 to-transparent blur opacity-20 group-hover:opacity-40 transition-all" />
                <textarea
                  value={landmark}
                  onChange={(e) => onLandmarkChange(e.target.value)}
                  placeholder="Enter house number, street name, block, or specific landmark details here..."
                  className="relative w-full h-40 bg-[#050606] border border-zinc-800 rounded-2xl p-5 text-sm text-zinc-200 placeholder:text-zinc-700 outline-none focus:border-red-600/50 transition-all resize-none"
                />
              </div>

              <div className="bg-zinc-900/40 border border-zinc-800/60 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-amber-500 text-xs">⚠️</span>
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Protocol Note</span>
                </div>
                <p className="text-[9px] text-zinc-600 leading-relaxed uppercase">
                  Manual addresses help field operatives locate incidents faster in areas with weak GPS signals or complex alleyways.
                </p>
              </div>
          </div>
        )}
      </div>

      {/* Selected Location HUD */}
      {(area || landmark) && (
        <div className="pt-4 border-t border-zinc-800/40 flex items-center justify-between px-1">
          <div className="space-y-1">
            <p className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.3em]">Current Target Zone</p>
            <p className="text-[10px] font-black text-white uppercase truncate max-w-[200px]">
              {area || 'UNSPECIFIED'} {landmark && `// ${landmark}`}
            </p>
          </div>
          {coordinates && (
            <div className="text-right">
              <p className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.3em]">Coordinates</p>
              <p className="text-[9px] font-mono text-red-500/80">{coordinates[0].toFixed(4)}N, {coordinates[1].toFixed(4)}E</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
