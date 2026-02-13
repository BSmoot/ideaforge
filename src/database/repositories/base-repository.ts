import type { Database } from 'sql.js';
import { DatabaseError } from '@/lib/errors';

export class BaseRepository {
  constructor(protected readonly db: Database) {}

  protected execRun(sql: string, params: unknown[] = []): void {
    try {
      this.db.run(sql, params as (string | number | null | Uint8Array)[]);
    } catch (error: unknown) {
      throw new DatabaseError(`SQL execution failed: ${sql.slice(0, 80)}`, {
        sql,
        params,
        error,
      });
    }
  }

  protected getOne<T>(sql: string, params: unknown[] = []): T | null {
    try {
      const stmt = this.db.prepare(sql);
      stmt.bind(params as (string | number | null | Uint8Array)[]);
      if (stmt.step()) {
        const columns = stmt.getColumnNames();
        const values = stmt.get();
        stmt.free();
        const row: Record<string, unknown> = {};
        for (let i = 0; i < columns.length; i++) {
          row[columns[i]!] = values[i];
        }
        return row as T;
      }
      stmt.free();
      return null;
    } catch (error: unknown) {
      throw new DatabaseError(`SQL query failed: ${sql.slice(0, 80)}`, {
        sql,
        params,
        error,
      });
    }
  }

  protected getMany<T>(sql: string, params: unknown[] = []): T[] {
    try {
      const results = this.db.exec(sql, params as (string | number | null | Uint8Array)[]);
      if (results.length === 0) {
        return [];
      }
      const result = results[0]!;
      const columns = result.columns;
      return result.values.map((values) => {
        const row: Record<string, unknown> = {};
        for (let i = 0; i < columns.length; i++) {
          row[columns[i]!] = values[i];
        }
        return row as T;
      });
    } catch (error: unknown) {
      throw new DatabaseError(`SQL query failed: ${sql.slice(0, 80)}`, {
        sql,
        params,
        error,
      });
    }
  }

  protected getScalar<T>(sql: string, params: unknown[] = []): T | null {
    try {
      const results = this.db.exec(sql, params as (string | number | null | Uint8Array)[]);
      if (results.length === 0 || results[0]!.values.length === 0) {
        return null;
      }
      return results[0]!.values[0]![0] as T;
    } catch (error: unknown) {
      throw new DatabaseError(`SQL scalar query failed: ${sql.slice(0, 80)}`, {
        sql,
        params,
        error,
      });
    }
  }
}
