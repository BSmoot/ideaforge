import type { Database } from 'sql.js';
import type { ISettings } from '@/types';
import { BaseRepository } from './base-repository';
import { nowISO } from '@/lib/date';

export class SettingsRepository extends BaseRepository {
  constructor(db: Database) {
    super(db);
  }

  get(key: string): string | null {
    const row = this.getOne<ISettings>(
      'SELECT * FROM settings WHERE key = ?',
      [key]
    );
    return row?.value ?? null;
  }

  set(key: string, value: string): void {
    const now = nowISO();
    this.execRun(
      'INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at',
      [key, value, now]
    );
  }

  getAll(): Record<string, string> {
    const rows = this.getMany<ISettings>('SELECT * FROM settings');
    const result: Record<string, string> = {};
    for (const row of rows) {
      result[row.key] = row.value;
    }
    return result;
  }

  delete(key: string): void {
    this.execRun('DELETE FROM settings WHERE key = ?', [key]);
  }
}
