// ─── Live Incident Ticker ───────────────────────────────────

'use client';

import { useState, useEffect } from 'react';
import type { MockIncident } from '@/lib/mock-data';
import { OKHLA_AREAS } from '@/types/location.types';

interface Props { incidents: MockIncident[]; }

const SEV_DOT = { critical: 'bg-red-500', high: 'bg-amber-500', medium: 'bg-yellow-500', low: 'bg-green-500' };
const CAT_ICON: Record<string, string> = { recruitment: '🎯', propaganda: '📢', meeting: '🤝', surveillance: '👁️', harassment: '⚠️', other: '📋' };

function timeAgo(ts: string) {
  const m = Math.floor((Date.now() - new Date(ts).getTime()) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  return `${Math.floor(m / 60)}h ago`;
}

export default function LiveTicker({ incidents }: Props) {
  const [highlight, setHighlight] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const id = setInterval(() => setHighlight(p => (p + 1) % Math.min(incidents.length, 5)), 3000);
    return () => clearInterval(id);
  }, [incidents.length]);

  const sorted = [...incidents].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);

  return (
    <div className="bg-zinc-900/50 border border-zinc-800/40 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-b border-zinc-800/40 bg-zinc-900/60">
        <div className="flex items-center gap-2">
          <span className="text-xs">📡</span>
          <span className="text-[10px] sm:text-xs font-semibold text-zinc-400 uppercase tracking-widest">Live Feed</span>
        </div>
        <span className="text-[10px] text-zinc-600 font-mono">Auto-updating</span>
      </div>
      <div className="divide-y divide-zinc-800/30">
        {sorted.map((inc, i) => {
          const area = OKHLA_AREAS[inc.area];
          return (
            <div
              key={inc.id}
              className={`flex items-center gap-2.5 px-3 sm:px-4 py-2.5 transition-colors duration-500 ${
                i === highlight ? 'bg-zinc-800/30' : ''
              }`}
            >
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${SEV_DOT[inc.severity]} ${inc.severity === 'critical' ? 'animate-pulse' : ''}`} />
              <span className="text-sm sm:text-base flex-shrink-0">{CAT_ICON[inc.category]}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-white font-medium truncate">{inc.title}</p>
                <p className="text-[10px] text-zinc-500 truncate" suppressHydrationWarning>{area?.label} · {mounted ? timeAgo(inc.timestamp) : '...'}</p>
              </div>
              {inc.verificationCount > 0 && (
                <span className="text-[10px] text-green-400 flex-shrink-0">✓{inc.verificationCount}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
