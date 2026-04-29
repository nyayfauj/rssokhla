// ─── Alert Banner Component ─────────────────────────────────

'use client';

import type { Alert } from '@/types/alert.types';
import { SEVERITY_LEVELS } from '@/lib/utils/constants';
import { timeAgo } from '@/lib/utils/formatters';
import { useAlertsStore } from '@/stores/alerts.store';

interface AlertBannerProps {
  alert: Alert;
}

export default function AlertBanner({ alert }: AlertBannerProps) {
  const dismissAlert = useAlertsStore((s) => s.dismissAlert);
  const severity = SEVERITY_LEVELS[alert.severity];

  const bgMap = {
    critical: 'bg-red-950/80 border-red-800/50',
    high: 'bg-amber-950/80 border-amber-800/50',
    medium: 'bg-yellow-950/60 border-yellow-800/40',
    low: 'bg-blue-950/60 border-blue-800/40',
  };

  return (
    <div className={`${bgMap[alert.severity]} border rounded-xl p-3 relative`}>
      <button
        onClick={() => dismissAlert(alert.$id)}
        className="absolute top-2 right-2 text-zinc-500 hover:text-white p-1"
        aria-label="Dismiss alert"
      >
        ✕
      </button>

      <div className="flex items-start gap-2.5 pr-6">
        <span className="text-lg mt-0.5">
          {alert.severity === 'critical' ? '🚨' : alert.severity === 'high' ? '⚠️' : 'ℹ️'}
        </span>
        <div>
          <h4 className="text-sm font-semibold text-white">{alert.title}</h4>
          <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{alert.message}</p>
          <div className="flex items-center gap-3 mt-2 text-[10px]">
            <span style={{ color: severity.color }} className="font-semibold">
              {severity.label}
            </span>
            <span className="text-zinc-600">{timeAgo(alert.timestamp)}</span>
            <span className="text-zinc-600">
              {alert.affectedAreas.length} area{alert.affectedAreas.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
