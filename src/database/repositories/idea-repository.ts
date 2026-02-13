import type { Database } from 'sql.js';
import type { IIdea, IdeaStatus, SortOrder } from '@/types';
import type { CreateIdeaInput, UpdateIdeaInput } from '@/lib/validation';
import { BaseRepository } from './base-repository';
import { generateId } from '@/lib/id';
import { nowISO } from '@/lib/date';

interface IIdeaFilters {
  readonly status?: IdeaStatus;
}

function buildOrderClause(sort: SortOrder): string {
  switch (sort) {
    case 'newest':
      return 'ORDER BY created_at DESC';
    case 'oldest':
      return 'ORDER BY created_at ASC';
    case 'updated':
      return 'ORDER BY updated_at DESC';
    case 'alphabetical':
      return 'ORDER BY title ASC';
  }
}

function parseMetadata(raw: unknown): Record<string, unknown> {
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw) as Record<string, unknown>;
    } catch {
      return {};
    }
  }
  return {};
}

function toIdea(row: Record<string, unknown>): IIdea {
  return {
    id: row.id as string,
    title: row.title as string,
    content: (row.content as string) ?? '',
    status: row.status as IdeaStatus,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
    metadata: parseMetadata(row.metadata),
  };
}

export class IdeaRepository extends BaseRepository {
  constructor(db: Database) {
    super(db);
  }

  create(input: CreateIdeaInput): IIdea {
    const id = generateId();
    const now = nowISO();
    const metadata = JSON.stringify({});

    this.execRun(
      'INSERT INTO ideas (id, title, content, status, created_at, updated_at, metadata) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, input.title, input.content ?? '', 'spark', now, now, metadata]
    );

    return {
      id,
      title: input.title,
      content: input.content ?? '',
      status: 'spark',
      created_at: now,
      updated_at: now,
      metadata: {},
    };
  }

  getById(id: string): IIdea | null {
    const row = this.getOne<Record<string, unknown>>(
      'SELECT * FROM ideas WHERE id = ?',
      [id]
    );
    return row ? toIdea(row) : null;
  }

  getAll(filters?: IIdeaFilters, sort: SortOrder = 'newest'): IIdea[] {
    const orderClause = buildOrderClause(sort);

    if (filters?.status) {
      const rows = this.getMany<Record<string, unknown>>(
        `SELECT * FROM ideas WHERE status = ? ${orderClause}`,
        [filters.status]
      );
      return rows.map(toIdea);
    }

    const rows = this.getMany<Record<string, unknown>>(
      `SELECT * FROM ideas ${orderClause}`
    );
    return rows.map(toIdea);
  }

  update(id: string, input: UpdateIdeaInput): IIdea | null {
    const existing = this.getById(id);
    if (!existing) {
      return null;
    }

    const now = nowISO();
    const fields: string[] = ['updated_at = ?'];
    const params: unknown[] = [now];

    if (input.title !== undefined) {
      fields.push('title = ?');
      params.push(input.title);
    }
    if (input.content !== undefined) {
      fields.push('content = ?');
      params.push(input.content);
    }
    if (input.status !== undefined) {
      fields.push('status = ?');
      params.push(input.status);
    }
    if (input.metadata !== undefined) {
      fields.push('metadata = ?');
      params.push(JSON.stringify(input.metadata));
    }

    params.push(id);
    this.execRun(
      `UPDATE ideas SET ${fields.join(', ')} WHERE id = ?`,
      params
    );

    return this.getById(id);
  }

  delete(id: string): void {
    this.execRun('DELETE FROM ideas WHERE id = ?', [id]);
  }

  findByStatus(status: IdeaStatus): IIdea[] {
    const rows = this.getMany<Record<string, unknown>>(
      'SELECT * FROM ideas WHERE status = ? ORDER BY updated_at DESC',
      [status]
    );
    return rows.map(toIdea);
  }

  count(): number {
    return this.getScalar<number>('SELECT COUNT(*) FROM ideas') ?? 0;
  }
}

export type { IIdeaFilters };
