// ─── Auth Store (Zustand) ───────────────────────────────────

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserRole } from '@/types/user.types';
import { account, ID } from '@/lib/appwrite/client';
import type { Models } from 'appwrite';

interface AuthState {
  user: Models.User<Models.Preferences> | null;
  session: Models.Session | null;
  isAuthenticated: boolean;
  isAnonymous: boolean;
  isLoading: boolean;
  role: UserRole;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginAnonymous: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isAuthenticated: false,
      isAnonymous: false,
      isLoading: true,
      role: 'observer' as UserRole,
      error: null,

      initialize: async () => {
        try {
          set({ isLoading: true, error: null });
          const user = await account.get();
          const isAnon = !user.email;
          
          // Role mapping from Appwrite prefs or defaults
          const role = (user.prefs?.role as UserRole) || (isAnon ? 'observer' : 'operative');

          set({
            user,
            isAuthenticated: true,
            isAnonymous: isAnon,
            role,
            isLoading: false,
          });
        } catch {
          set({
            user: null,
            session: null,
            isAuthenticated: false,
            isAnonymous: false,
            role: 'observer',
            isLoading: false,
          });
        }
      },

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          const session = await account.createEmailPasswordSession(email, password);
          const user = await account.get();
          set({
            user,
            session,
            isAuthenticated: true,
            isAnonymous: false,
            role: 'operative',
            isLoading: false,
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      loginAnonymous: async () => {
        try {
          set({ isLoading: true, error: null });
          
          let user;
          let session;

          try {
            // Check if already logged in
            user = await account.get();
            session = await account.getSession('current').catch(() => null);
          } catch {
            // No active session, create anonymous one
            session = await account.createAnonymousSession();
            user = await account.get();
          }
          
          // Generate Magic Token if not exists
          let magicToken = localStorage.getItem('nf_magic_token');
          if (!magicToken) {
            magicToken = btoa(`${user.$id}:${Math.random().toString(36).substring(2)}`);
            localStorage.setItem('nf_magic_token', magicToken);
          }

          set({
            user,
            session,
            isAuthenticated: true,
            isAnonymous: !user.email,
            role: !user.email ? 'observer' : 'operative',
            isLoading: false,
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Anonymous login failed.';
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      register: async (email: string, password: string, name: string, inviteCode?: string) => {
        try {
          set({ isLoading: true, error: null });
          const user = await account.create(ID.unique(), email, password, name);
          
          // Determine role based on invite code
          let role: UserRole = 'operative';
          if (inviteCode === 'VERIFY-INTEL-99') role = 'verifier';
          if (inviteCode === 'COMMAND-OKHLA-1') role = 'commander';

          // Update user preferences with role and trust data
          await account.updatePrefs({
            role,
            trustScore: role === 'verifier' ? 50 : role === 'commander' ? 100 : 10,
            reputation: 0,
            joinedWithCode: !!inviteCode
          });

          // Auto-login after registration
          await get().login(email, password);
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Registration failed.';
          set({ isLoading: false, error: message });
          throw err;
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true });
          await account.deleteSession('current');
        } catch {
          // Session may already be expired
        } finally {
          set({
            user: null,
            session: null,
            isAuthenticated: false,
            isAnonymous: false,
            role: 'observer',
            isLoading: false,
            error: null,
          });
        }
      },

      refreshSession: async () => {
        try {
          const user = await account.get();
          const isAnon = !user.email;
          set({
            user,
            isAuthenticated: true,
            isAnonymous: isAnon,
            role: isAnon ? 'observer' : get().role,
          });
        } catch {
          await get().logout();
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'rssokhla-auth',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        isAnonymous: state.isAnonymous,
        role: state.role,
      }),
    }
  )
);
