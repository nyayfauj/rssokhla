import { create } from 'zustand';
import { databases } from '@/lib/appwrite/client';
import { DATABASE_ID, COLLECTIONS } from '@/lib/appwrite/collections';
import type { KaryakartaProfile } from '@/types/karyakarta.types';

interface KaryakartaState {
  profiles: KaryakartaProfile[];
  isLoading: boolean;
  error: string | null;
  fetchProfiles: () => Promise<void>;
}

export const useKaryakartaStore = create<KaryakartaState>((set) => ({
  profiles: [],
  isLoading: false,
  error: null,
  fetchProfiles: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await databases.listDocuments(DATABASE_ID, COLLECTIONS.PROFILES);
      set({ profiles: response.documents as unknown as KaryakartaProfile[], isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },
}));
