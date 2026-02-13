import type { IIdea, IdeaStatus, IAIMessage, IAIConfig, SortOrder } from '@/types';

export interface IIdeaSlice {
  ideas: IIdea[];
  currentIdea: IIdea | null;
  statusFilter: IdeaStatus | null;
  sortOrder: SortOrder;
  loadIdeas: (ideas: IIdea[]) => void;
  addIdea: (idea: IIdea) => void;
  updateIdea: (id: string, updates: Partial<IIdea>) => void;
  removeIdea: (id: string) => void;
  setCurrentIdea: (idea: IIdea | null) => void;
  setStatusFilter: (status: IdeaStatus | null) => void;
  setSortOrder: (sort: SortOrder) => void;
}

export interface IAISlice {
  messages: IAIMessage[];
  isStreaming: boolean;
  totalCost: number;
  aiConfig: IAIConfig | null;
  addMessage: (message: IAIMessage) => void;
  clearMessages: () => void;
  setStreaming: (streaming: boolean) => void;
  addCost: (cost: number) => void;
  setAIConfig: (config: IAIConfig | null) => void;
}

export interface IToast {
  readonly id: string;
  readonly message: string;
  readonly variant: 'success' | 'error' | 'info' | 'warning';
  readonly duration?: number;
}

export interface IUISlice {
  sidebarOpen: boolean;
  theme: 'dark' | 'light' | 'system';
  toasts: IToast[];
  isLoading: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
  addToast: (toast: IToast) => void;
  removeToast: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

export type IAppStore = IIdeaSlice & IAISlice & IUISlice;
