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
  { id: 'abf_enclave', name: 'Abul Fazal Enclave' },
];

export default function AreaThreatGauges({ incidents }: Props) {
  const getThreatLevel = (areaId: string) => {
    const areaIncidents = incidents.filter(i => i.locationId === areaId);
    if (areaIncidents.length === 0) return 10;
    
    const score = areaIncidents.reduce((acc, i) => {
      const weight = i.severity === 'critical' ? 40 : i.severity === 'high' ? 25 : i.severity === 'medium' ? 10 : 5;
      return acc + weight;
    }, 0);
    
    return Math.min(100, 10 + score);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {AREAS.map(area => {
        const level = getThreatLevel(area.id);
        const color = level > 70 ? 'text-red-500' : level > 40 ? 'text-orange-500' : 'text-green-500';
        const borderColor = level > 70 ? 'border-red-500/20' : level > 40 ? 'border-orange-500/20' : 'border-green-500/20';

        return (
          <div 
            key={area.id}
            className={`bg-zinc-900/40 border ${borderColor} rounded-xl p-3 flex flex-col items-center gap-2 group hover:bg-zinc-800/40 transition-all cursor-default`}
          >
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{area.name}</span>
            
            <div className="relative w-16 h-8 overflow-hidden">
              <div className="absolute inset-0 border-[6px] border-zinc-800 rounded-t-full"></div>
              <div 
                className={`absolute inset-0 border-[6px] ${color} rounded-t-full origin-bottom transition-all duration-1000`}
                style={{ transform: `rotate(${(level / 100) * 180 - 180}deg)` }}
              ></div>
            </div>
            
            <div className="flex flex-col items-center">
              <span className={`text-lg font-black tracking-tighter ${color}`}>{level}%</span>
              <span className="text-[8px] text-zinc-600 uppercase">Alert Level</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
