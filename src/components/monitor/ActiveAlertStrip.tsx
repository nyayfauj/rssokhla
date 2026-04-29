// ─── Active Alert Strip (scrolling) ─────────────────────────

'use client';

import type { Alert } from '@/types/alert.types';

interface Props { alerts: Alert[]; }

const SEV_COLORS = {
  critical: 'text-red-400 bg-red-500/10 border-red-500/20',
  high: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  medium: 'text-yellow-300 bg-yellow-500/10 border-yellow-500/20',
  low: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
};

export default function ActiveAlertStrip({ alerts }: Props) {
  if (alerts.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800/40 bg-zinc-900/40">
      <div className="flex animate-[scroll_25s_linear_infinite] hover:[animation-play-state:paused]">
        {[...alerts, ...alerts].map((a, i) => (
          <div key={`${a.$id}-${i}`} className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 border-r border-zinc-800/30 ${SEV_COLORS[a.severity]}`}>
            <span className="text-xs font-semibold whitespace-nowrap">{a.title}</span>
            <span className="text-[10px] opacity-60 whitespace-nowrap hidden sm:inline">— {a.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}



