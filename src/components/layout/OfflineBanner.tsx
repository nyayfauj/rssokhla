// ─── Offline Banner ─────────────────────────────────────────

'use client';

import { useUIStore } from '@/stores/ui.store';
import { useIncidentsStore } from '@/stores/incidents.store';

export default function OfflineBanner() {
  const isOnline = useUIStore((s) => s.isOnline);
  const offlineCount = useIncidentsStore((s) => s.offlineQueue.length);

  if (isOnline) return null;

  return (
    <div className="fixed top-14 left-0 right-0 z-30 bg-amber-900/90 backdrop-blur-sm border-b border-amber-700/50 px-4 py-2.5 text-center">
      <div className="flex items-center justify-center gap-2 text-sm">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
        </span>
        <span className="text-amber-200 font-medium">You are offline</span>
        {offlineCount > 0 && (
          <span className="text-amber-400/80 text-xs">
            • {offlineCount} report{offlineCount !== 1 ? 's' : ''} queued
          </span>
        )}
      </div>
    </div>
  );
}
