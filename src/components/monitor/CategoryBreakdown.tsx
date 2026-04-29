// ─── Category Breakdown ─────────────────────────────────────

'use client';

import type { Incident } from '@/types/incident.types';

interface Props { incidents: Incident[]; }

const CAT_META: Record<string, { icon: string; label: string; color: string }> = {
  recruitment: { icon: '🎯', label: 'Recruitment', color: 'bg-red-500' },
  propaganda: { icon: '📢', label: 'Propaganda', color: 'bg-orange-500' },
  meeting: { icon: '🤝', label: 'Meetings', color: 'bg-yellow-500' },
  surveillance: { icon: '👁️', label: 'Surveillance', color: 'bg-purple-500' },
  harassment: { icon: '⚠️', label: 'Harassment', color: 'bg-pink-500' },
  other: { icon: '📋', label: 'Other', color: 'bg-zinc-500' },
};

export default function CategoryBreakdown({ incidents }: Props) {
  const counts = incidents.reduce<Record<string, number>>((acc, i) => {
    acc[i.category] = (acc[i.category] || 0) + 1;
    return acc;
  }, {});

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const max = Math.max(...Object.values(counts), 1);

  return (
    <div className="bg-zinc-900/30 border border-zinc-800/40 rounded-2xl overflow-hidden">
      <div className="px-3 sm:px-4 py-2.5 border-b border-zinc-800/40 bg-zinc-900/60">
        <div className="flex items-center gap-2">
          <span className="text-xs">📊</span>
          <span className="text-[10px] sm:text-xs font-semibold text-zinc-400 uppercase tracking-widest">By Category</span>
        </div>
      </div>
      <div className="p-3 sm:p-4 space-y-2.5">
        {sorted.map(([cat, count]) => {
          const meta = CAT_META[cat] || CAT_META.other;
          const pct = (count / max) * 100;
          return (
            <div key={cat}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs">{meta.icon}</span>
                  <span className="text-[11px] sm:text-xs text-zinc-300">{meta.label}</span>
                </div>
                <span className="text-[11px] font-bold text-white">{count}</span>
              </div>
              <div className="h-1.5 bg-zinc-800/60 rounded-full overflow-hidden">
                <div className={`h-full ${meta.color} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}



