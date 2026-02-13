import type { StateCreator } from 'zustand';
import type { IAppStore, IAISlice } from '@/types/store';

export const createAISlice: StateCreator<IAppStore, [], [], IAISlice> = (
  set
) => ({
  messages: [],
  isStreaming: false,
  totalCost: 0,
  aiConfig: null,

  addMessage: (message) => {
    set((state) => ({ messages: [...state.messages, message] }));
  },

  clearMessages: () => {
    set({ messages: [] });
  },

  setStreaming: (streaming) => {
    set({ isStreaming: streaming });
  },

  addCost: (cost) => {
    set((state) => ({ totalCost: state.totalCost + cost }));
  },

  setAIConfig: (config) => {
    set({ aiConfig: config });
  },
});
