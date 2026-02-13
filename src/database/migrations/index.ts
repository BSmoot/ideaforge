import { V001_INITIAL_SCHEMA } from './v001-initial-schema';

export interface IMigration {
  readonly version: number;
  readonly description: string;
  readonly sql: string;
}

export const MIGRATIONS: readonly IMigration[] = [
  {
    version: 1,
    description: 'Initial schema with FTS5',
    sql: V001_INITIAL_SCHEMA,
  },
];
