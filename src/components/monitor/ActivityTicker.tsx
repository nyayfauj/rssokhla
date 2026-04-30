'use client';

import { useEffect, useState } from 'react';
import type { Incident } from '@/types/incident.types';
import { formatDistanceToNow } from 'date-fns';

interface Props {
  incidents: Incident[];
}

export default function ActivityTicker({ incidents }: Props) {
  if (incidents.length === 0) return null;

  return (
    <div className="bg-red-600 border-y border-red-500 py-1.5 overflow-hidden flex items-center h-8">
      <div className="flex items-center gap-3 px-4 h-full bg-red-600 relative z-10 shadow-[10px_0_15px_rgba(220,38,38,1)]">
        <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] whitespace-nowrap flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_8px_#fff]"></span>
          Intelligence Wire
        </span>
      </div>
      
      <div className="flex-1 relative flex items-center overflow-hidden">
        <div className="flex items-center gap-12 whitespace-nowrap animate-marquee">
          {/* Repeat items twice for infinite scroll */}
          {[...incidents, ...incidents, ...incidents].map((incident, idx) => (
            <div key={`${incident.$id}-${idx}`} className="flex items-center gap-4">
              <span className="text-[9px] font-black text-white/50">[{incident.severity.toUpperCase()}]</span>
              <span className="text-[10px] font-bold text-white uppercase tracking-wider">{incident.title}</span>
              <span className="text-[9px] text-white/40 italic">— {incident.locationId}</span>
              <span className="text-[9px] text-white/60 font-mono">({formatDistanceToNow(new Date(incident.timestamp))} ago)</span>
              <span className="text-white/20 px-2">///</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
