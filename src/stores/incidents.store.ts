// ─── Incidents Store (Zustand) ──────────────────────────────

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { databases, client, ID, Query, storage } from '@/lib/appwrite/client';
import { DATABASE_ID, COLLECTIONS, STORAGE_BUCKET_ID } from '@/lib/appwrite/collections';
import type { Incident, CreateIncidentData, IncidentFilters, PendingIncident } from '@/types/incident.types';
import { v4 as uuidv4 } from 'uuid';

interface IncidentsState {
  incidents: Incident[];
  selectedIncident: Incident | null;
  filters: IncidentFilters;
  isLoading: boolean;
  error: string | null;
  offlineQueue: PendingIncident[];
  hasMore: boolean;
  page: number;

  // Actions
  fetchIncidents: (filters?: IncidentFilters) => Promise<void>;
  fetchMore: () => Promise<void>;
  getIncident: (id: string) => Promise<void>;
  createIncident: (data: CreateIncidentData, userId: string, isAnonymous: boolean) => Promise<void>;
  verifyIncident: (id: string, userId: string) => Promise<void>;
  setFilters: (filters: Partial<IncidentFilters>) => void;
  clearFilters: () => void;
  syncOfflineQueue: () => Promise<void>;
  clearError: () => void;
  subscribeToIncidents: () => () => void;
  setIncidents: (incidents: Incident[]) => void;
}

const PAGE_SIZE = 20;

export const useIncidentsStore = create<IncidentsState>()(
  persist(
    (set, get) => ({
      incidents: [],
      selectedIncident: null,
      filters: {},
      isLoading: false,
      error: null,
      offlineQueue: [],
      hasMore: true,
      page: 0,

      fetchIncidents: async (filters?: IncidentFilters) => {
        try {
          set({ isLoading: true, error: null, page: 0 });

          const queries = buildQueries(filters || get().filters, 0);
          const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.INCIDENTS,
            queries
          );

          set({
            incidents: response.documents as unknown as Incident[],
            hasMore: response.documents.length === PAGE_SIZE,
            page: 1,
            isLoading: false,
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to load incidents';
          set({ error: message, isLoading: false });
        }
      },

      fetchMore: async () => {
        const { hasMore, isLoading, page, filters, incidents } = get();
        if (!hasMore || isLoading) return;

        try {
          set({ isLoading: true });
          const queries = buildQueries(filters, page);
          const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.INCIDENTS,
            queries
          );

          set({
            incidents: [...incidents, ...(response.documents as unknown as Incident[])],
            hasMore: response.documents.length === PAGE_SIZE,
            page: page + 1,
            isLoading: false,
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to load more';
          set({ error: message, isLoading: false });
        }
      },

      getIncident: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          const doc = await databases.getDocument(
            DATABASE_ID,
            COLLECTIONS.INCIDENTS,
            id
          );
          set({ selectedIncident: doc as unknown as Incident, isLoading: false });
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Incident not found';
          set({ error: message, isLoading: false });
        }
      },

      createIncident: async (data: CreateIncidentData, userId: string, isAnonymous: boolean) => {
        try {
          set({ isLoading: true, error: null });

          const uploadedMediaUrls: string[] = [...(data.mediaUrls || [])];

          // 1. Upload media files if present
          if (data.media && data.media.length > 0) {
            const uploadPromises = data.media.map(async (blob) => {
              const fileId = ID.unique();
              const file = new File([blob], `media-${Date.now()}`, { type: blob.type });
              await storage.createFile(STORAGE_BUCKET_ID, fileId, file);
              
              // Get view URL (publicly accessible since we set bucket perms to 'Any')
              const url = `https://sgp.cloud.appwrite.io/v1/storage/buckets/${STORAGE_BUCKET_ID}/files/${fileId}/view?project=${client.config.project}`;
              return url;
            });

            const results = await Promise.all(uploadPromises);
            uploadedMediaUrls.push(...results);
          }

          const incidentData = {
            ...data,
            reporterId: userId,
            timestamp: new Date().toISOString(),
            status: 'reported',
            isAnonymous,
            verifiedBy: [],
            verificationCount: 0,
            mediaUrls: uploadedMediaUrls,
            coordinates: data.coordinates || [],
            tags: data.tags || [],
          };

          // Remove the raw media blobs before sending to database
          delete (incidentData as any).media;

          await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.INCIDENTS,
            ID.unique(),
            incidentData
          );

          // Refresh the list
          await get().fetchIncidents();
        } catch (err) {
          console.error('[IncidentsStore] Error creating incident:', err);
          
          // Queue for offline sync (without media blobs for now as they are too large for localStorage)
          const pending: PendingIncident = {
            ...data,
            offlineId: uuidv4(),
            submittedAt: new Date().toISOString(),
            syncStatus: 'pending',
          };
          delete (pending as any).media;

          set((state) => ({
            offlineQueue: [...state.offlineQueue, pending],
            isLoading: false,
            error: 'Saved offline. Will sync when connection is restored.',
          }));
        }
      },

      verifyIncident: async (id: string, userId: string) => {
        try {
          const incident = get().incidents.find((i) => i.$id === id);
          if (!incident) return;

          if (incident.verifiedBy.includes(userId)) return;

          await databases.updateDocument(
            DATABASE_ID,
            COLLECTIONS.INCIDENTS,
            id,
            {
              verifiedBy: [...incident.verifiedBy, userId],
              verificationCount: incident.verificationCount + 1,
              status: incident.verificationCount + 1 >= 3 ? 'verified' : incident.status,
            }
          );

          await get().fetchIncidents();
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Verification failed';
          set({ error: message });
        }
      },

      setFilters: (filters: Partial<IncidentFilters>) => {
        set((state) => ({ filters: { ...state.filters, ...filters } }));
      },

      clearFilters: () => set({ filters: {} }),

      syncOfflineQueue: async () => {
        const queue = get().offlineQueue.filter((p) => p.syncStatus === 'pending');
        if (queue.length === 0) return;

        for (const pending of queue) {
          try {
            set((state) => ({
              offlineQueue: state.offlineQueue.map((p) =>
                p.offlineId === pending.offlineId ? { ...p, syncStatus: 'syncing' as const } : p
              ),
            }));

            await databases.createDocument(
              DATABASE_ID,
              COLLECTIONS.INCIDENTS,
              ID.unique(),
              {
                ...pending,
                timestamp: pending.submittedAt,
                status: 'reported',
                verifiedBy: [],
                verificationCount: 0,
              }
            );

            set((state) => ({
              offlineQueue: state.offlineQueue.filter((p) => p.offlineId !== pending.offlineId),
            }));
          } catch {
            set((state) => ({
              offlineQueue: state.offlineQueue.map((p) =>
                p.offlineId === pending.offlineId ? { ...p, syncStatus: 'failed' as const } : p
              ),
            }));
          }
        }

        await get().fetchIncidents();
      },

      clearError: () => set({ error: null }),

      subscribeToIncidents: () => {
        const unsubscribe = client.subscribe(
          `databases.${DATABASE_ID}.collections.${COLLECTIONS.INCIDENTS}.documents`,
          (response) => {
            if (response.events.includes('databases.*.collections.*.documents.*.create')) {
              const newIncident = response.payload as unknown as Incident;
              set((state) => ({
                incidents: [newIncident, ...state.incidents].slice(0, PAGE_SIZE),
              }));
            }
            if (response.events.includes('databases.*.collections.*.documents.*.update')) {
              const updatedIncident = response.payload as unknown as Incident;
              set((state) => ({
                incidents: state.incidents.map((i) =>
                  i.$id === updatedIncident.$id ? updatedIncident : i
                ),
              }));
            }
          }
        );
        return unsubscribe;
      },
      setIncidents: (incidents) => set({ incidents }),
    }),
    {
      name: 'rssokhla-incidents',
      partialize: (state) => ({
        offlineQueue: state.offlineQueue,
      }),
    }
  )
);

// ─── Query Builder ──────────────────────────────────────────

function buildQueries(filters: IncidentFilters, page: number): string[] {
  const queries: string[] = [
    Query.orderDesc('timestamp'),
    Query.limit(PAGE_SIZE),
    Query.offset(page * PAGE_SIZE),
  ];

  if (filters.category) queries.push(Query.equal('category', filters.category));
  if (filters.severity) queries.push(Query.equal('severity', filters.severity));
  if (filters.status) queries.push(Query.equal('status', filters.status));
  if (filters.dateFrom) queries.push(Query.greaterThanEqual('timestamp', filters.dateFrom));
  if (filters.dateTo) queries.push(Query.lessThanEqual('timestamp', filters.dateTo));
  if (filters.search) queries.push(Query.search('title', filters.search));

  return queries;
}
