'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import type { Incident } from '@/types/incident.types';
import { OKHLA_AREAS, type OkhlaArea } from '@/types/location.types';

interface Props { incidents: Incident[]; }

const SEV_BADGE = {
  critical: 'bg-red-500/15 text-red-400 border-red-500/25',
  high: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  low: 'bg-green-500/10 text-green-400 border-green-500/20',
};

const STATUS_BADGE = {
  reported: { label: 'Reported', color: 'text-blue-400' },
  verified: { label: 'Verified', color: 'text-green-400' },
  resolved: { label: 'Resolved', color: 'text-zinc-500' },
  false_positive: { label: 'Dismissed', color: 'text-zinc-600' },
};

const CAT_ICON: Record<string, string> = { 
  recruitment: '🎯', 
  propaganda: '📢', 
  meeting: '🤝', 
  surveillance: '👁️', 
  harassment: '⚠️', 
  other: '📋' 
};

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

  const sorted = useMemo(() => {
    return [...incidents].sort((a, b) => {
      const aTime = new Date(a.timestamp).getTime();
      const bTime = new Date(b.timestamp).getTime();
      return (isNaN(bTime) ? 0 : bTime) - (isNaN(aTime) ? 0 : aTime);
    });
  }, [incidents]);

  return (
    <div className="bg-zinc-900/30 border border-zinc-800/40 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/40 bg-zinc-900/60">
        <div className="flex items-center gap-2">
          <span className="text-sm" aria-hidden="true">📋</span>
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">All Reports</span>
        </div>
        <span className="text-xs text-zinc-600">{incidents.length} total</span>
      </div>
      <div className="divide-y divide-zinc-800/20">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <span className="text-3xl mb-3 opacity-20" aria-hidden="true">📡</span>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">[ NO INTELLIGENCE LOGS FOUND IN CURRENT STREAM ]</p>
            <p className="text-[9px] font-medium text-zinc-600 mt-2">Awaiting operative transmissions or sector reports.</p>
          </div>
        ) : (
          sorted.map((inc) => {
            const area = OKHLA_AREAS[inc.locationId as OkhlaArea];
            const st = STATUS_BADGE[inc.status as keyof typeof STATUS_BADGE] || STATUS_BADGE.reported;
            const sevClass = SEV_BADGE[inc.severity as keyof typeof SEV_BADGE] || SEV_BADGE.low;
            const catIcon = CAT_ICON[inc.category] || CAT_ICON.other;
            const ts = inc.timestamp ? timeAgo(inc.timestamp) : '';
            
            // Trust-based confidence calculation
            const confidence = Math.min(Math.round(((inc.trustPoints || 0) / 10) * 100), 100);
            const confColor = confidence > 80 ? 'text-green-400' : confidence > 40 ? 'text-yellow-400' : 'text-zinc-500';

            return (
              <Link
                key={inc.$id}
                href={`/incidents/${inc.$id}`}
                className="block px-4 py-3 hover:bg-zinc-800/20 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/50"
                aria-label={`Report: ${inc.title || 'Untitled'}`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-base sm:text-lg mt-0.5 flex-shrink-0" aria-hidden="true">{catIcon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm text-white font-medium truncate flex-1">{inc.title || 'Untitled'}</p>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[9px] font-black uppercase tracking-tighter ${confColor}`}>
                          {confidence}% Trust
                        </span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest border ${sevClass}`}>
                          {(inc.severity || 'low')}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-500 line-clamp-1">{inc.description || ''}</p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">📍 {area?.label || inc.locationId}</span>
                      {ts && (
                        <>
                          <span className="text-zinc-600">·</span>
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest" suppressHydrationWarning>{mounted ? `${ts} ago` : '...'}</span>
                        </>
                      )}
                      <span className="text-zinc-600">·</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${st.color}`}>{st.label}</span>
                      {(inc.verificationCount || 0) > 0 && (
                        <>
                          <span className="text-zinc-600">·</span>
                          <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">✓ {inc.verificationCount}</span>
                        </>
                      )}
                      {inc.isAnonymous && (
                        <span className="text-xs text-zinc-600" aria-label="Anonymous report">🕶️</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
