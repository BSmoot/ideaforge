import type { Database } from 'sql.js';
import type { IConnection, ConnectionType, ConnectionSource } from '@/types';
import { BaseRepository } from './base-repository';
import { generateId } from '@/lib/id';
import { nowISO } from '@/lib/date';

export interface ICreateConnectionInput {
  readonly source_id: string;
  readonly target_id: string;
  readonly type: ConnectionType;
  readonly description?: string;
  readonly source: ConnectionSource;
}

export class ConnectionRepository extends BaseRepository {
  constructor(db: Database) {
    super(db);
  }

  create(input: ICreateConnectionInput): IConnection {
    const id = generateId();
    const now = nowISO();

    this.execRun(
      `INSERT INTO connections (id, source_id, target_id, type, description, source, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        input.source_id,
        input.target_id,
        input.type,
        input.description ?? null,
        input.source,
        now,
      ]
    );

    return {
      id,
      source_id: input.source_id,
      target_id: input.target_id,
      type: input.type,
      description: input.description ?? null,
      source: input.source,
      created_at: now,
    };
  }

  getForIdea(ideaId: string): IConnection[] {
    return this.getMany<IConnection>(
      `SELECT * FROM connections
       WHERE source_id = ? OR target_id = ?
       ORDER BY created_at DESC`,
      [ideaId, ideaId]
    );
  }

  delete(connectionId: string): void {
    this.execRun('DELETE FROM connections WHERE id = ?', [connectionId]);
  }
}
