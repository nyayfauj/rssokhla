'use client';

import { useMemo } from 'react';
import type { Incident } from '@/types/incident.types';

interface Props {
  incidents: Incident[];
}

const AREAS = [
  { id: 'sarita_vihar', name: 'Sarita Vihar' },
  { id: 'zakir_nagar', name: 'Zakir Nagar' },
  { id: 'abul_fazal', name: 'Abul Fazal' },
  { id: 'madanpur_khadar_west', name: 'Khadar West' },
  { id: 'madanpur_khadar_east', name: 'Khadar East' },
];

export default function AreaThreatGauges({ incidents }: Props) {
  const areaData = useMemo(() => {
    return AREAS.map(area => {
      const areaIncidents = incidents.filter(i => i.locationId === area.id);
      if (areaIncidents.length === 0) return { ...area, level: 0, count: 0 };
      
      const score = areaIncidents.reduce((acc, i) => {
        const weight = i.severity === 'critical' ? 45 : i.severity === 'high' ? 30 : i.severity === 'medium' ? 15 : 5;
        return acc + weight;
      }, 0);
      
      return { ...area, level: Math.min(100, 10 + score), count: areaIncidents.length };
    });
  }, [incidents]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4" role="group" aria-label="Area threat levels">
      {areaData.map(area => {
        const color = area.level > 70 ? '#ef4444' : area.level > 40 ? '#f59e0b' : '#10b981';

        return (
          <div 
            key={area.id}
            className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/40 group hover:border-zinc-700 transition-all"
            role="img"
            aria-label={`${area.name}: activity level ${area.level}% with ${area.count} incidents`}
          >
            <div className="relative w-16 h-16 sm:w-20 sm:h-20">
              <div className="absolute inset-0 border border-zinc-800/40 rounded-full"></div>
              <div className="absolute inset-2 border border-zinc-800/40 rounded-full"></div>
              <div className="absolute inset-4 border border-zinc-800/40 rounded-full"></div>
              
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-zinc-800"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  fill="none"
                  stroke={color}
                  strokeWidth="3"
                  strokeDasharray="213.6"
                  strokeDashoffset={213.6 - (area.level / 100) * 213.6}
                  strokeLinecap="round"
                  className="transition-all duration-[1.5s] ease-out"
                />
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <div 
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: color }}
                ></div>
              </div>
            </div>

            <div className="text-center space-y-1">
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider leading-none">{area.name}</p>
              <div className="flex items-baseline justify-center gap-0.5">
                <span className="text-lg font-bold tracking-tighter" style={{ color }}>{area.level}</span>
                <span className="text-xs font-medium text-zinc-600">%</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
