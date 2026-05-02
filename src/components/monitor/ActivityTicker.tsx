'use client';

import { useMemo } from 'react';
import type { Incident } from '@/types/incident.types';
import { formatDistanceToNow } from 'date-fns';

interface Props {
  incidents: Incident[];
}

export default function ActivityTicker({ incidents }: Props) {
  const tickerItems = useMemo(() => {
    if (!incidents || incidents.length === 0) return [];
    const base = incidents.slice(0, 15).map(incident => ({
      severity: incident.severity?.toUpperCase() || 'LOW',
      title: incident.title || 'Untitled',
      location: incident.locationId?.replace(/_/g, ' ').toUpperCase() || 'Unknown',
      time: formatDistanceToNow(new Date(incident.timestamp)),
    }));
    return [...base, ...base];
  }, [incidents]);

  if (tickerItems.length === 0) return null;

  return (
    <div
      className="bg-red-600 border-y border-red-500 py-1 overflow-hidden flex items-center h-8 sm:h-10"
      role="marquee"
      aria-label="Live activity feed"
    >
      <div className="flex items-center gap-2 px-4 sm:px-6 h-full bg-red-600 relative z-10 shadow-[10px_0_15px_rgba(220,38,38,1)]">
        <span className="text-[9px] sm:text-xs font-black text-white uppercase tracking-widest whitespace-nowrap flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_8px_#fff]"></span>
          Live Updates
        </span>
      </div>
      
      <div className="flex-1 relative flex items-center overflow-hidden">
        <div className="flex items-center gap-16 whitespace-nowrap animate-marquee">
          {tickerItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 sm:gap-6">
              <span className="text-[9px] sm:text-xs font-black text-white/60">[{item.severity}]</span>
              <span className="text-[9px] sm:text-xs font-black text-white uppercase tracking-wide">{item.title}</span>
              <span className="text-[9px] sm:text-xs text-white/50 italic font-bold">— {item.location}</span>
              <span className="text-[9px] sm:text-xs text-white/70 font-mono">({item.time})</span>
              <span className="text-white/30 px-1 sm:px-3 text-[9px]">///</span>
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
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
