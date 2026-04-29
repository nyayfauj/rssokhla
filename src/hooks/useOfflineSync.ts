// ─── useOfflineSync Hook ────────────────────────────────────

'use client';

import { useEffect, useCallback } from 'react';
import { useIncidentsStore } from '@/stores/incidents.store';
import { useUIStore } from '@/stores/ui.store';

/**
 * Monitors connectivity and triggers offline queue sync when back online.
 */
export function useOfflineSync() {
  const syncOfflineQueue = useIncidentsStore((s) => s.offlineQueue.length > 0 ? s.syncOfflineQueue : null);
  const offlineCount = useIncidentsStore((s) => s.offlineQueue.length);
  const setOnline = useUIStore((s) => s.setOnline);
  const addToast = useUIStore((s) => s.addToast);

  const handleOnline = useCallback(() => {
    setOnline(true);
    addToast({ type: 'success', message: 'Back online!' });

    if (syncOfflineQueue) {
      syncOfflineQueue().then(() => {
        addToast({ type: 'success', message: `Synced ${offlineCount} offline reports` });
      });
    }
  }, [setOnline, addToast, syncOfflineQueue, offlineCount]);

  const handleOffline = useCallback(() => {
    setOnline(false);
    addToast({ type: 'warning', message: 'You are offline. Reports will be queued.' });
  }, [setOnline, addToast]);

  useEffect(() => {
    setOnline(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnline, handleOffline, setOnline]);

  return { offlineCount };
}
