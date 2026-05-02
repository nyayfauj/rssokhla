'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CATEGORY_MARKERS } from '@/lib/map/config';

interface Props {
  incident: Record<string, unknown>;
  position: { x: number; y: number };
  onClose: () => void;
  onShare: () => void;
  onVerify?: () => void;
}

const SEV_BADGE: Record<string, string> = {
  critical: 'bg-red-500/15 text-red-400 border-red-500/25',
  high: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  low: 'bg-green-500/10 text-green-400 border-green-500/20',
};

export default function IncidentPopup({ incident, position, onClose, onShare, onVerify }: Props) {
  const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const maxWidth = 260;
    const left = Math.min(position.x, window.innerWidth - maxWidth - 16);
    setPopupStyle({ left, top: position.y + 12 });
  }, [position.x, position.y]);

  const category = (incident.category as string) || 'other';
  const severity = (incident.severity as string) || 'low';
  const cat = CATEGORY_MARKERS[category] || CATEGORY_MARKERS.other;
  const sev = SEV_BADGE[severity] || SEV_BADGE.low;

  return (
    <div className="absolute z-20 pointer-events-auto animate-fade-in" style={popupStyle}>
      <div className="bg-zinc-900/95 backdrop-blur-xl border border-zinc-800/60 rounded-2xl p-3 shadow-2xl w-64 max-w-[calc(100vw-2rem)]">
        <div className="flex items-start gap-2">
          <span className="text-lg" aria-hidden="true">{cat.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{(incident.title as string) || 'Untitled'}</p>
            <p className="text-xs text-zinc-500 truncate mt-0.5">{((incident.area as string) || '').replace(/_/g, ' ')}</p>
          </div>
          <button onClick={onClose} className="text-zinc-600 hover:text-white text-sm leading-none p-1" aria-label="Close popup">✕</button>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${sev}`}>
            {severity.toUpperCase()}
          </span>
          <span className="text-xs text-zinc-500 capitalize">{((incident.status as string) || '').replace(/_/g, ' ')}</span>
          {(incident.verificationCount as number) > 0 && (
            <span className="text-xs text-green-400">✓{incident.verificationCount as number}</span>
          )}
        </div>

        <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
          {incident.description as string}
        </p>

        <div className="flex gap-2 mt-3">
          <button onClick={onShare}
            className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded-lg transition-colors text-center">
            &#x1F4E4; Share
          </button>
          {onVerify ? (
            <button onClick={onVerify}
              className="flex-1 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 text-xs font-medium rounded-lg transition-colors text-center">
              &#x2713; Verify
            </button>
          ) : (
            <Link href={`/incidents/${incident.$id}`}
              className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded-lg transition-colors text-center">
              View Details
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
