'use client';

import { useEffect, useState } from 'react';
import type { Incident } from '@/types/incident.types';
import { formatDistanceToNow } from 'date-fns';

interface Props {
  incidents: Incident[];
}

export default function ActivityTicker({ incidents }: Props) {
  if (!incidents || incidents.length === 0) return null;

  return (
    <div className="bg-red-600 border-y border-red-500 py-2 overflow-hidden flex items-center h-10">
      <div className="flex items-center gap-3 px-6 h-full bg-red-600 relative z-10 shadow-[15px_0_20px_rgba(220,38,38,1)]">
        <span className="text-[11px] font-black text-white uppercase tracking-[0.3em] whitespace-nowrap flex items-center gap-2.5">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_10px_#fff]"></span>
          Intelligence Wire
        </span>
      </div>
      
      <div className="flex-1 relative flex items-center overflow-hidden">
        <div className="flex items-center gap-16 whitespace-nowrap animate-marquee">
          {/* Repeat items twice for infinite scroll */}
          {[...incidents, ...incidents, ...incidents].map((incident, idx) => (
            <div key={`${incident.$id}-${idx}`} className="flex items-center gap-6">
              <span className="text-[10px] font-black text-white/60">[{incident.severity.toUpperCase()}]</span>
              <span className="text-[11px] font-bold text-white uppercase tracking-[0.1em]">{incident.title}</span>
              <span className="text-[10px] text-white/50 italic">— {incident.locationId.replace('_', ' ').toUpperCase()}</span>
              <span className="text-[10px] text-white/70 font-mono">({formatDistanceToNow(new Date(incident.timestamp))} ago)</span>
              <span className="text-white/30 px-3">///</span>
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
