'use client';

import { useEffect, useCallback } from 'react';
import { useUIStore } from '@/stores/ui.store';
import { useIncidentsStore } from '@/stores/incidents.store';
import { syncPendingReports, getPendingCount } from '@/lib/offline-queue';

export default function OfflineSyncManager() {
  const addToast = useUIStore((s) => s.addToast);
  const { createIncident } = useIncidentsStore();

  const handleSync = useCallback(async () => {
    if (!navigator.onLine) return;

    try {
      const count = await getPendingCount();
      if (count === 0) return;

      addToast({ type: 'info', message: `Syncing ${count} offline reports...` });

      const synced = await syncPendingReports(async (report) => {
        // Strip out the offline specific fields before sending to Appwrite
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { offlineId, submittedAt, syncStatus, ...payload } = report;
        
        try {
          await createIncident(payload, 'offline-sync', payload.isAnonymous);
          return true;
        } catch (error) {
          console.error('Failed to sync report:', error);
          return false;
        }
      });

      if (synced > 0) {
        addToast({ type: 'success', message: `Successfully synced ${synced} reports!` });
      }
    } catch (error) {
      console.error('Sync process failed:', error);
    }
  }, [addToast, createIncident]);

  useEffect(() => {
    // Listen for online events
    window.addEventListener('online', handleSync);
    
    // Listen for custom SW events
    window.addEventListener('sync-offline-reports', handleSync);

    // Initial check in case we came back online while app was closed
    if (navigator.onLine) {
      handleSync();
    }

    return () => {
      window.removeEventListener('online', handleSync);
      window.removeEventListener('sync-offline-reports', handleSync);
    };
  }, [handleSync]);

  return null; // This is a logic-only component
}
