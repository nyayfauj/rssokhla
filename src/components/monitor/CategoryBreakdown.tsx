'use client';

import { useMemo } from 'react';
import type { Incident } from '@/types/incident.types';

interface Props { incidents: Incident[]; }

const CAT_META: Record<string, { icon: string; label: string; color: string }> = {
  recruitment: { icon: '&#x1F3AF;', label: 'Recruitment', color: 'bg-red-500' },
  propaganda: { icon: '&#x1F4E2;', label: 'Propaganda', color: 'bg-orange-500' },
  meeting: { icon: '&#x1F91D;', label: 'Meetings', color: 'bg-yellow-500' },
  surveillance: { icon: '&#x1F441;&#xFE0F;', label: 'Surveillance', color: 'bg-purple-500' },
  harassment: { icon: '&#x26A0;&#xFE0F;', label: 'Harassment', color: 'bg-pink-500' },
  other: { icon: '&#x1F4CB;', label: 'Other', color: 'bg-zinc-500' },
};

export default function CategoryBreakdown({ incidents }: Props) {
  const { sorted, max } = useMemo(() => {
    const counts = incidents.reduce<Record<string, number>>((acc, i) => {
      acc[i.category] = (acc[i.category] || 0) + 1;
      return acc;
    }, {});
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const max = Math.max(...Object.values(counts), 1);
    return { sorted, max };
  }, [incidents]);

  return (
    <div className="bg-zinc-900/30 border border-zinc-800/40 rounded-2xl overflow-hidden" role="img" aria-label="Category breakdown of reports">
      <div className="px-4 py-3 border-b border-zinc-800/40 bg-zinc-900/60">
        <div className="flex items-center gap-2">
          <span className="text-sm" aria-hidden="true">&#x1F4CA;</span>
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">By Category</span>
        </div>
      </div>
      <div className="p-4 space-y-3">
        {sorted.map(([cat, count]) => {
          const meta = CAT_META[cat] || CAT_META.other;
          const pct = (count / max) * 100;
          return (
            <div key={cat}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm" aria-hidden="true" dangerouslySetInnerHTML={{ __html: meta.icon }} />
                  <span className="text-sm text-zinc-300">{meta.label}</span>
                </div>
                <span className="text-sm font-bold text-white">{count}</span>
              </div>
              <div
                className="h-2 bg-zinc-800/60 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={count}
                aria-valuemin={0}
                aria-valuetext={`${Math.round(pct)}% of max category`}
              >
                <div
                  className={`h-full ${meta.color} rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
