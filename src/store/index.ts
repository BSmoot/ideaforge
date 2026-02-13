import { create } from 'zustand';
import type { IAppStore } from '@/types/store';
import { createIdeaSlice } from './slices/idea-slice';
import { createAISlice } from './slices/ai-slice';
import { createUISlice } from './slices/ui-slice';

export const useAppStore = create<IAppStore>()((...a) => ({
  ...createIdeaSlice(...a),
  ...createAISlice(...a),
  ...createUISlice(...a),
}));
