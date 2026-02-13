import type { StateCreator } from 'zustand';
import type { IAppStore, IUISlice } from '@/types/store';
import { MAX_VISIBLE_TOASTS } from '@/lib/constants';

export const createUISlice: StateCreator<IAppStore, [], [], IUISlice> = (
  set
) => ({
  sidebarOpen: true,
  theme: 'dark',
  toasts: [],
  isLoading: false,

  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },

  setSidebarOpen: (open) => {
    set({ sidebarOpen: open });
  },

  setTheme: (theme) => {
    set({ theme });
  },

  addToast: (toast) => {
    set((state) => {
      const updated = [...state.toasts, toast];
      if (updated.length > MAX_VISIBLE_TOASTS) {
        return { toasts: updated.slice(-MAX_VISIBLE_TOASTS) };
      }
      return { toasts: updated };
    });
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },
});
