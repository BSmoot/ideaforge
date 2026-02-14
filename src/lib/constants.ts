import type { IdeaStatus } from '@/types';

export const IDEA_STATUSES: readonly IdeaStatus[] = [
  'spark',
  'developing',
  'refined',
  'parked',
  'archived',
] as const;

export const STATUS_COLORS: Record<IdeaStatus, string> = {
  spark: 'bg-status-warning-bg text-status-warning',
  developing: 'bg-status-info-bg text-status-info',
  refined: 'bg-status-success-bg text-status-success',
  parked: 'bg-background-muted text-foreground-tertiary',
  archived: 'bg-background-muted text-foreground-disabled',
};

export const MAX_TITLE_LENGTH = 200;
export const MAX_TAG_LENGTH = 50;
export const MAX_TAGS_PER_IDEA = 10;

export const DEBOUNCE_MS = 1000;
export const SEARCH_DEBOUNCE_MS = 200;
export const PERSIST_DEBOUNCE_MS = 2000;
export const BACKUP_INTERVAL_MS = 300_000;
export const MAX_BACKUPS = 3;
export const TOAST_DURATION_MS = 5000;
export const MAX_VISIBLE_TOASTS = 3;

export const MAX_CONTENT_PREVIEW_LENGTH = 120;
export const MAX_AI_CONTEXT_LENGTH = 5000;

export const MIN_SEARCH_LENGTH = 2;
export const MAX_SEARCH_RESULTS = 20;
