'use client';

import type { Incident } from '@/types/incident.types';

interface Props {
  incidents: Incident[];
}

const AREAS = [
  { id: 'shaheen_bagh', name: 'Shaheen Bagh' },
  { id: 'jamia_nagar', name: 'Jamia Nagar' },
  { id: 'jasola', name: 'Jasola' },
  { id: 'batla_house', name: 'Batla House' },
  { id: 'abf_enclave', name: 'Abul Fazal' },
];

export default function AreaThreatGauges({ incidents }: Props) {
  const getThreatLevel = (areaId: string) => {
    const areaIncidents = incidents.filter(i => i.locationId === areaId);
    if (areaIncidents.length === 0) return 10;
    
    const score = areaIncidents.reduce((acc, i) => {
      const weight = i.severity === 'critical' ? 45 : i.severity === 'high' ? 30 : i.severity === 'medium' ? 15 : 5;
      return acc + weight;
    }, 0);
    
    return Math.min(100, 10 + score);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
      {AREAS.map(area => {
        const level = getThreatLevel(area.id);
        const color = level > 70 ? '#ef4444' : level > 40 ? '#f59e0b' : '#10b981';
        const ringColor = level > 70 ? 'rgba(239, 68, 68, 0.2)' : level > 40 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)';

        return (
          <div 
            key={area.id}
            className="flex flex-col items-center gap-4 p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/40 group hover:border-zinc-700 transition-all"
          >
            <div className="relative w-20 h-20">
              {/* Radar Grid Circles */}
              <div className="absolute inset-0 border border-zinc-800/40 rounded-full"></div>
              <div className="absolute inset-2 border border-zinc-800/40 rounded-full"></div>
              <div className="absolute inset-4 border border-zinc-800/40 rounded-full"></div>
              
              {/* Progress Gauge */}
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
                  strokeDashoffset={213.6 - (level / 100) * 213.6}
                  strokeLinecap="round"
                  className="transition-all duration-[1.5s] ease-out shadow-[0_0_10px_currentColor]"
                />
              </svg>

              {/* Center Dot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div 
                  className="w-1 h-1 rounded-full animate-ping"
                  style={{ backgroundColor: color }}
                ></div>
              </div>
            </div>

            <div className="text-center space-y-1">
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-none">{area.name}</p>
              <div className="flex items-baseline justify-center gap-0.5">
                <span className="text-xl font-black tracking-tighter" style={{ color }}>{level}</span>
                <span className="text-[8px] font-bold text-zinc-600">%</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
