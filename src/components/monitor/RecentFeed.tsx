// ─── Recent Incidents Feed (public) ─────────────────────────

'use client';

import { useState, useEffect } from 'react';
import type { MockIncident } from '@/lib/mock-data';
import { OKHLA_AREAS } from '@/types/location.types';

interface Props { incidents: MockIncident[]; }

const SEV_BADGE = {
  critical: 'bg-red-500/15 text-red-400 border-red-500/25',
  high: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  low: 'bg-green-500/10 text-green-400 border-green-500/20',
};

const STATUS_BADGE = {
  reported: { label: 'Unverified', color: 'text-blue-400' },
  verified: { label: 'Verified', color: 'text-green-400' },
  resolved: { label: 'Resolved', color: 'text-zinc-500' },
  false_positive: { label: 'Dismissed', color: 'text-zinc-600' },
};

const CAT_ICON: Record<string, string> = { recruitment: '🎯', propaganda: '📢', meeting: '🤝', surveillance: '👁️', harassment: '⚠️', other: '📋' };

function timeAgo(ts: string) {
  const m = Math.floor((Date.now() - new Date(ts).getTime()) / 60000);
  if (m < 1) return 'now';
  if (m < 60) return `${m}m`;
  if (m < 1440) return `${Math.floor(m / 60)}h`;
  return `${Math.floor(m / 1440)}d`;
}

export default function RecentFeed({ incidents }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const sorted = [...incidents].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="bg-zinc-900/30 border border-zinc-800/40 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 border-b border-zinc-800/40 bg-zinc-900/60">
        <div className="flex items-center gap-2">
          <span className="text-xs">📋</span>
          <span className="text-[10px] sm:text-xs font-semibold text-zinc-400 uppercase tracking-widest">All Incidents</span>
        </div>
        <span className="text-[10px] text-zinc-600">{incidents.length} total</span>
      </div>
      <div className="divide-y divide-zinc-800/20">
        {sorted.map((inc) => {
          const area = OKHLA_AREAS[inc.area];
          const st = STATUS_BADGE[inc.status];
          return (
            <div key={inc.id} className="px-3 sm:px-4 py-3 hover:bg-zinc-800/20 transition-colors">
              {/* Row 1: title + severity */}
              <div className="flex items-start gap-2">
                <span className="text-sm sm:text-base mt-0.5 flex-shrink-0">{CAT_ICON[inc.category]}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-xs sm:text-sm text-white font-medium truncate flex-1">{inc.title}</p>
                    <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${SEV_BADGE[inc.severity]}`}>
                      {inc.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-zinc-500 line-clamp-1">{inc.description}</p>
                  {/* Row 2: meta */}
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-[9px] sm:text-[10px] text-zinc-500">📍 {area?.label}</span>
                    <span className="text-[9px] sm:text-[10px] text-zinc-600">·</span>
                    <span className="text-[9px] sm:text-[10px] text-zinc-500" suppressHydrationWarning>{mounted ? `${timeAgo(inc.timestamp)} ago` : '...'}</span>
                    <span className="text-[9px] sm:text-[10px] text-zinc-600">·</span>
                    <span className={`text-[9px] sm:text-[10px] font-medium ${st.color}`}>{st.label}</span>
                    {inc.verificationCount > 0 && (
                      <>
                        <span className="text-[9px] sm:text-[10px] text-zinc-600">·</span>
                        <span className="text-[9px] sm:text-[10px] text-green-400">✓{inc.verificationCount}</span>
                      </>
                    )}
                    {inc.isAnonymous && (
                      <span className="text-[9px] sm:text-[10px] text-zinc-600">🕶️</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
