import type { IIdea } from './idea';

export interface ISettings {
  readonly key: string;
  readonly value: string;
  readonly updated_at: string;
}

export interface ISearchResult {
  readonly idea: IIdea;
  readonly matchType: 'title' | 'content' | 'tag';
  readonly snippet: string;
  readonly rank: number;
}

export type SortOrder = 'newest' | 'oldest' | 'updated' | 'alphabetical';
