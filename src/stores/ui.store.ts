// ─── UI Store (Zustand) ─────────────────────────────────────

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface UIState {
  // Theme
  theme: 'dark' | 'light';

  // Navigation
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  activeTab: 'feed' | 'map' | 'report' | 'alerts' | 'profiles' | 'more';

  // Connectivity
  isOnline: boolean;
  showOfflineBanner: boolean;

  // Toasts
  toasts: Toast[];

  // Bottom sheet
  isBottomSheetOpen: boolean;
  bottomSheetContent: string | null;

  // Actions
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setActiveTab: (tab: UIState['activeTab']) => void;
  setOnline: (online: boolean) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  setBottomSheet: (open: boolean, content?: string) => void;
}

let toastCounter = 0;

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'dark',
      isSidebarOpen: false,
      isMobileMenuOpen: false,
      activeTab: 'feed',
      isOnline: true,
      showOfflineBanner: false,
      toasts: [],
      isBottomSheetOpen: false,
      bottomSheetContent: null,

      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

      setSidebarOpen: (open) => set({ isSidebarOpen: open }),

      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),

      setActiveTab: (tab) => set({ activeTab: tab }),

      setOnline: (online) =>
        set({ isOnline: online, showOfflineBanner: !online }),

      addToast: (toast) => {
        const id = `toast-${++toastCounter}`;
        set((state) => ({
          toasts: [...state.toasts, { ...toast, id }],
        }));

        // Auto-remove after duration
        const duration = toast.duration ?? 4000;
        setTimeout(() => {
          set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
          }));
        }, duration);
      },

      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),

      setBottomSheet: (open, content) =>
        set({ isBottomSheetOpen: open, bottomSheetContent: content ?? null }),
    }),
    {
      name: 'rssokhla-ui',
      partialize: (state) => ({
        theme: state.theme,
        activeTab: state.activeTab,
      }),
    }
  )
);
