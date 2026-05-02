// ─── Profile Cards Strip (Public Dashboard) ────────────────

'use client';

import type { KaryakartaProfile } from '@/types/karyakarta.types';
import { RANK_LABELS, AFFILIATION_LABELS, THREAT_COLORS, ACTIVITY_LABELS } from '@/types/karyakarta.types';

interface Props { profiles: KaryakartaProfile[]; }

export default function ProfileStrip({ profiles }: Props) {
  // Show only critical/high threat profiles publicly
  const highlighted = profiles
    .filter(p => p.threatLevel === 'critical' || p.threatLevel === 'high')
    .sort((a, b) => (b.threatLevel === 'critical' ? 1 : 0) - (a.threatLevel === 'critical' ? 1 : 0));

  if (highlighted.length === 0) return null;

  return (
    <div className="bg-zinc-900/30 border border-zinc-800/40 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 border-b border-zinc-800/40 bg-zinc-900/60">
          <div className="flex items-center gap-2">
            <span className="text-xs">🕵️</span>
            <span className="text-[10px] sm:text-xs font-semibold text-zinc-400 uppercase tracking-widest">Adversary Monitor</span>
          </div>
          <span className="text-[10px] text-zinc-600">{highlighted.length} high-threat</span>
        </div>

      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-2.5 p-3 min-w-max">
          {highlighted.map(p => {
            const threat = THREAT_COLORS[p.threatLevel];
            const rank = RANK_LABELS[p.rank];
            return (
              <div key={p.$id} className={`flex-shrink-0 w-56 sm:w-64 bg-zinc-900/50 border rounded-xl p-3 ${
                p.threatLevel === 'critical' ? 'border-red-800/40' : 'border-zinc-800/40'
              }`}>
                {/* Header */}
                <div className="flex items-start gap-2.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0 ${
                    p.threatLevel === 'critical' ? 'bg-gradient-to-br from-red-600 to-red-800' : 'bg-gradient-to-br from-amber-600 to-amber-800'
                  }`}>
                    {p.fullName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-white truncate">{p.fullName}</p>
                    {p.aliases.length > 0 && <p className="text-[9px] text-zinc-500 truncate">aka {p.aliases[0]}</p>}
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${threat.bg} ${threat.text} ${threat.border}`}>
                        {threat.label.toUpperCase()}
                      </span>
                      <span className="text-[9px] text-zinc-500">{rank.label}</span>
                    </div>
                  </div>
                </div>

                {/* Affiliations */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {p.affiliations.slice(0, 2).map(aff => {
                    const a = AFFILIATION_LABELS[aff];
                    return <span key={aff} className={`text-[8px] ${a.color} bg-zinc-800/60 px-1 py-0.5 rounded`}>{a.icon} {a.label}</span>;
                  })}
                </div>

                {/* Activities */}
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {p.knownActivities.slice(0, 2).map(act => (
                    <span key={act} className="text-[8px] text-zinc-500 bg-zinc-800/30 px-1 py-0.5 rounded">
                      {ACTIVITY_LABELS[act].icon} {ACTIVITY_LABELS[act].label}
                    </span>
                  ))}
                </div>

                {/* Area */}
                <p className="text-[9px] text-zinc-600 mt-1.5">📍 {p.primaryArea.replace(/_/g, ' ')}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}



