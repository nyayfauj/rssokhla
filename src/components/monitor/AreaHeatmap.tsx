// ─── Area Heatmap Grid ──────────────────────────────────────

'use client';

import type { Incident } from '@/types/incident.types';
import { OKHLA_AREAS, type OkhlaArea } from '@/types/location.types';

interface Props { incidents: Incident[]; }

function getAreaRisk(count: number, hasCritical: boolean): { bg: string; border: string; dot: string; label: string } {
  if (hasCritical) return { bg: 'bg-red-950/50', border: 'border-red-800/60', dot: 'bg-red-500', label: 'CRITICAL' };
  if (count >= 3) return { bg: 'bg-amber-950/40', border: 'border-amber-800/50', dot: 'bg-amber-500', label: 'HIGH' };
  if (count >= 1) return { bg: 'bg-yellow-950/30', border: 'border-yellow-800/30', dot: 'bg-yellow-500', label: 'MODERATE' };
  return { bg: 'bg-zinc-900/50', border: 'border-zinc-800/40', dot: 'bg-green-500', label: 'CLEAR' };
}

export default function AreaHeatmap({ incidents }: Props) {
  const areaMap = new Map<OkhlaArea, { count: number; hasCritical: boolean }>();

  for (const inc of incidents) {
    const locId = inc.locationId as OkhlaArea;
    const entry = areaMap.get(locId) || { count: 0, hasCritical: false };
    entry.count++;
    if (inc.severity === 'critical') entry.hasCritical = true;
    areaMap.set(locId, entry);
  }

  return (
    <div className="bg-zinc-900/30 border border-zinc-800/40 rounded-2xl overflow-hidden">
      <div className="px-3 sm:px-4 py-2.5 border-b border-zinc-800/40 bg-zinc-900/60">
        <div className="flex items-center gap-2">
          <span className="text-xs">🗺️</span>
          <span className="text-[10px] sm:text-xs font-semibold text-zinc-400 uppercase tracking-widest">Area Threat Map</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-px bg-zinc-800/20 p-px">
        {(Object.entries(OKHLA_AREAS) as [OkhlaArea, typeof OKHLA_AREAS[OkhlaArea]][]).map(([key, area]) => {
          const data = areaMap.get(key) || { count: 0, hasCritical: false };
          const risk = getAreaRisk(data.count, data.hasCritical);

          return (
            <div key={key} className={`${risk.bg} p-2.5 sm:p-3 flex items-center justify-between gap-1`}>
              <div className="min-w-0">
                <p className="text-[11px] sm:text-xs text-white font-medium truncate">{area.label}</p>
                <p className="text-[9px] text-zinc-500">{data.count} incident{data.count !== 1 ? 's' : ''}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <span className={`w-1.5 h-1.5 rounded-full ${risk.dot} ${data.hasCritical ? 'animate-pulse' : ''}`} />
                <span className={`text-[8px] sm:text-[9px] font-bold ${
                  risk.label === 'CRITICAL' ? 'text-red-400' :
                  risk.label === 'HIGH' ? 'text-amber-400' :
                  risk.label === 'MODERATE' ? 'text-yellow-400' : 'text-green-400'
                }`}>{risk.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}



