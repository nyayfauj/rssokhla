// ─── Incident Popup (Map) ───────────────────────────────────

'use client';

import { CATEGORY_MARKERS } from '@/lib/map/config';

interface Props {
  incident: Record<string, unknown>;
  position: { x: number; y: number };
  onClose: () => void;
  onShare: () => void;
}

const SEV_BADGE: Record<string, string> = {
  critical: 'bg-red-500/15 text-red-400 border-red-500/25',
  high: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  low: 'bg-green-500/10 text-green-400 border-green-500/20',
};

export default function IncidentPopup({ incident, position, onClose, onShare }: Props) {
  const category = incident.category as string;
  const severity = incident.severity as string;
  const cat = CATEGORY_MARKERS[category] || CATEGORY_MARKERS.other;
  const sev = SEV_BADGE[severity] || SEV_BADGE.low;

  return (
    <div className="absolute z-20 pointer-events-auto animate-fade-in"
      style={{ left: Math.min(position.x, window.innerWidth - 260), top: position.y + 12 }}>
      <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-800/60 rounded-2xl p-3 shadow-2xl w-60 max-w-[calc(100vw-2rem)]">
        {/* Header */}
        <div className="flex items-start gap-2">
          <span className="text-lg">{cat.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{incident.title as string}</p>
            <p className="text-[10px] text-zinc-500 truncate mt-0.5">{(incident.area as string).replace(/_/g, ' ')}</p>
          </div>
          <button onClick={onClose} className="text-zinc-600 hover:text-white text-sm leading-none p-0.5">✕</button>
        </div>

        {/* Severity + Status */}
        <div className="flex items-center gap-2 mt-2">
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${sev}`}>
            {severity.toUpperCase()}
          </span>
          <span className="text-[10px] text-zinc-500 capitalize">{(incident.status as string).replace(/_/g, ' ')}</span>
          {(incident.verificationCount as number) > 0 && (
            <span className="text-[10px] text-green-400">✓{incident.verificationCount as number}</span>
          )}
        </div>

        {/* Description */}
        <p className="text-[10px] text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
          {incident.description as string}
        </p>

        {/* Actions */}
        <div className="flex gap-2 mt-2.5">
          <button onClick={onShare}
            className="flex-1 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-medium rounded-lg transition-colors text-center">
            📤 Share
          </button>
          <button className="flex-1 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-[10px] font-medium rounded-lg transition-colors text-center">
            ✓ Verify
          </button>
        </div>
      </div>
    </div>
  );
}
