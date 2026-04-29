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
          Query.orderDesc('severity'),
          Query.orderDesc('timestamp'),
          Query.limit(20),
        ]
      );

      set({
        activeAlerts: response.documents as unknown as Alert[],
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
