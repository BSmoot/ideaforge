import type { StateCreator } from 'zustand';
import type { IAppStore, IIdeaSlice } from '@/types/store';

export const createIdeaSlice: StateCreator<IAppStore, [], [], IIdeaSlice> = (
  set
) => ({
  ideas: [],
  currentIdea: null,
  statusFilter: null,
  sortOrder: 'newest',

  loadIdeas: (ideas) => {
    set({ ideas });
  },

  addIdea: (idea) => {
    set((state) => ({ ideas: [idea, ...state.ideas] }));
  },

  updateIdea: (id, updates) => {
    set((state) => ({
      ideas: state.ideas.map((i) => (i.id === id ? { ...i, ...updates } : i)),
      currentIdea:
        state.currentIdea?.id === id
          ? { ...state.currentIdea, ...updates }
          : state.currentIdea,
    }));
  },

  removeIdea: (id) => {
    set((state) => ({
      ideas: state.ideas.filter((i) => i.id !== id),
      currentIdea: state.currentIdea?.id === id ? null : state.currentIdea,
    }));
  },

  setCurrentIdea: (idea) => {
    set({ currentIdea: idea });
  },

  setStatusFilter: (status) => {
    set({ statusFilter: status });
  },

  setSortOrder: (sort) => {
    set({ sortOrder: sort });
  },
});
