export type IdeaStatus = 'spark' | 'developing' | 'refined' | 'parked' | 'archived';

export interface IIdea {
  readonly id: string;
  readonly title: string;
  readonly content: string;
  readonly status: IdeaStatus;
  readonly created_at: string;
  readonly updated_at: string;
  readonly metadata: Record<string, unknown>;
}

export interface ITag {
  readonly id: string;
  readonly name: string;
  readonly created_at: string;
}

export interface IIdeaTag {
  readonly idea_id: string;
  readonly tag_id: string;
}

export type ConnectionType = 'related' | 'builds_on' | 'contradicts' | 'merged_into';
export type ConnectionSource = 'manual' | 'ai_suggested' | 'ai_confirmed';

export interface IConnection {
  readonly id: string;
  readonly source_id: string;
  readonly target_id: string;
  readonly type: ConnectionType;
  readonly description: string | null;
  readonly source: ConnectionSource;
  readonly created_at: string;
}
