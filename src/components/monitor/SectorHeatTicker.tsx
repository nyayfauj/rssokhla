'use client';

import { useMemo } from 'react';
import type { Incident } from '@/types/incident.types';
import { OKHLA_WARDS } from '@/lib/utils/wards';

interface Props {
  incidents: Incident[];
}

export default function SectorHeatTicker({ incidents }: Props) {
  const sectors = useMemo(() => {
    return OKHLA_WARDS.map(ward => {
      const wardIncidents = incidents.filter(i => i.locationId === ward.id);
      const criticalCount = wardIncidents.filter(i => i.severity === 'critical').length;
      const highCount = wardIncidents.filter(i => i.severity === 'high').length;
      
      let heat = 'STABLE';
      let trend = 'NEUTRAL';

      if (criticalCount > 0) {
        heat = 'CRITICAL';
        trend = 'UP';
      } else if (highCount > 1) {
        heat = 'HIGH';
        trend = 'UP';
      } else if (wardIncidents.length > 2) {
        heat = 'MODERATE';
        trend = 'NEUTRAL';
      } else if (wardIncidents.length === 0) {
        heat = 'QUIET';
        trend = 'STABLE';
      }

      return { name: ward.name.toUpperCase(), heat, trend };
    });
  }, [incidents]);

  return (
    <div className="bg-zinc-950 border-y border-zinc-800/40 py-1.5 overflow-hidden flex whitespace-nowrap no-print">
      <div className="flex animate-marquee items-center">
        {[...sectors, ...sectors].map((s, i) => (
          <div key={i} className="flex items-center gap-4 mx-8 group cursor-default">
            <span className="text-[9px] font-black text-zinc-500 tracking-widest">{s.name}</span>
            <div className="flex items-center gap-1.5">
              <span className={`text-[9px] font-black ${
                s.heat === 'CRITICAL' || s.heat === 'HIGH' ? 'text-red-500' : s.heat === 'MODERATE' ? 'text-orange-500' : 'text-green-500'
              }`}>
                {s.heat}
              </span>
              <span className={`text-[8px] ${s.trend === 'UP' ? 'text-red-500' : s.trend === 'DOWN' ? 'text-green-500' : 'text-zinc-600'}`}>
                {s.trend === 'UP' ? '▲' : s.trend === 'DOWN' ? '▼' : '▬'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
