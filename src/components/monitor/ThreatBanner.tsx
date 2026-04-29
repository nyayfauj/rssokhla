// ─── Threat Level Banner ────────────────────────────────────

'use client';

interface Props {
  level: 'CRITICAL' | 'ELEVATED' | 'GUARDED';
  critical: number;
  high: number;
  total: number;
}

const CONFIG = {
  CRITICAL: { bg: 'from-red-950/80 to-red-900/40', border: 'border-red-800/60', bar: 'bg-red-500', text: 'text-red-400', glow: 'shadow-red-900/40' },
  ELEVATED: { bg: 'from-amber-950/60 to-amber-900/30', border: 'border-amber-800/50', bar: 'bg-amber-500', text: 'text-amber-400', glow: 'shadow-amber-900/30' },
  GUARDED: { bg: 'from-green-950/40 to-green-900/20', border: 'border-green-800/40', bar: 'bg-green-500', text: 'text-green-400', glow: 'shadow-green-900/20' },
};

export default function ThreatBanner({ level, critical, high, total }: Props) {
  const c = CONFIG[level];

  return (
    <div className={`bg-gradient-to-r ${c.bg} border ${c.border} rounded-2xl p-3 sm:p-4 mt-3 shadow-lg ${c.glow}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className={`animate-ping absolute h-full w-full rounded-full ${c.bar} opacity-75`} />
            <span className={`relative rounded-full h-3 w-3 ${c.bar}`} />
          </span>
          <span className={`text-xs sm:text-sm font-bold ${c.text} uppercase tracking-widest`}>
            Threat Level: {level}
          </span>
        </div>
        <span className="text-[10px] text-zinc-500 font-mono">{total} incidents tracked</span>
      </div>

      {/* Threat bar visualization */}
      <div className="flex gap-0.5 h-2 rounded-full overflow-hidden bg-zinc-900/60 mb-2">
        {total > 0 && (
          <>
            <div className="bg-red-500 transition-all duration-1000" style={{ width: `${(critical / total) * 100}%` }} />
            <div className="bg-amber-500 transition-all duration-1000" style={{ width: `${(high / total) * 100}%` }} />
            <div className="bg-yellow-500/60 transition-all duration-1000" style={{ width: `${((total - critical - high) / total) * 100}%` }} />
          </>
        )}
      </div>

      <div className="flex gap-4 text-[10px]">
        <span className="text-red-400">● {critical} Critical</span>
        <span className="text-amber-400">● {high} High</span>
        <span className="text-zinc-500">● {total - critical - high} Other</span>
      </div>
    </div>
  );
}
