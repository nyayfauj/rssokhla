// ─── Alerts Store (Zustand) ─────────────────────────────────

import { create } from 'zustand';
import { databases, Query } from '@/lib/appwrite/client';
import { DATABASE_ID, COLLECTIONS } from '@/lib/appwrite/collections';
import type { Alert } from '@/types/alert.types';

interface AlertsState {
  alerts: Alert[];
  activeAlerts: Alert[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchAlerts: () => Promise<void>;
  fetchActiveAlerts: () => Promise<void>;
  dismissAlert: (id: string) => void;
  clearError: () => void;
}

export const useAlertsStore = create<AlertsState>()((set, get) => ({
  alerts: [],
  activeAlerts: [],
  isLoading: false,
  error: null,

  fetchAlerts: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.ALERTS,
        [Query.orderDesc('timestamp'), Query.limit(50)]
      );

      set({
        alerts: response.documents as unknown as Alert[],
        isLoading: false,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load alerts';
      set({ error: message, isLoading: false });
    }
  },

  fetchActiveAlerts: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.ALERTS,
        [
          Query.equal('isActive', true),
          Query.limit(100),
        ]
      );

      // Sort in-memory to avoid missing index errors on Appwrite
      const sorted = (response.documents as unknown as Alert[]).sort((a, b) => {
        // Priority by severity (critical > high > medium > low)
        const sevMap: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };
        const sevA = sevMap[a.severity] || 0;
        const sevB = sevMap[b.severity] || 0;
        
        if (sevA !== sevB) return sevB - sevA;
        
        // Then by timestamp
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }).slice(0, 20);

      set({
        activeAlerts: sorted,
        isLoading: false,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load active alerts';
      set({ error: message, isLoading: false });
    }
  },

  dismissAlert: (id: string) => {
    set((state) => ({
      activeAlerts: state.activeAlerts.filter((a) => a.$id !== id),
    }));
  },

  clearError: () => set({ error: null }),
}));
