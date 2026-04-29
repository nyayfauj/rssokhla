'use client';

import { useEffect, useState } from 'react';
import type { Incident } from '@/types/incident.types';
import { formatDistanceToNow } from 'date-fns';

interface Props {
  incidents: Incident[];
}

export default function ActivityTicker({ incidents }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (incidents.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % incidents.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [incidents.length]);

  if (incidents.length === 0) return null;

  const current = incidents[currentIndex];

  return (
    <div className="bg-red-950/20 border-y border-red-500/10 py-2 overflow-hidden backdrop-blur-sm">
      <div className="container mx-auto px-4 flex items-center gap-4">
        <div className="flex items-center gap-2 px-2 py-0.5 bg-red-600 rounded text-[10px] font-bold text-white uppercase tracking-tighter animate-pulse">
          Live Alert
        </div>
        
        <div className="flex-1 overflow-hidden">
          <div 
            key={current.$id}
            className="flex items-center gap-3 animate-slide-up whitespace-nowrap"
          >
            <span className="text-red-400 font-bold text-xs">
              [{current.severity.toUpperCase()}]
            </span>
            <span className="text-zinc-300 text-xs font-medium">
              {current.title}
            </span>
            <span className="text-zinc-600 text-[10px] italic">
              — {current.locationId} ({formatDistanceToNow(new Date(current.timestamp))} ago)
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4 text-[10px] text-zinc-500 font-mono uppercase tracking-widest">
          <span>Okhla Monitor: ACTIVE</span>
          <span className="w-1 h-1 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          0% { transform: translateY(100%); opacity: 0; }
          10% { transform: translateY(0); opacity: 1; }
          90% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-100%); opacity: 0; }
        }
        .animate-slide-up {
          animation: slide-up 5s infinite;
        }
      `}</style>
    </div>
  );
}
