import type { Database } from 'sql.js';
import type { ITag } from '@/types';
import { BaseRepository } from './base-repository';
import { generateId } from '@/lib/id';
import { nowISO } from '@/lib/date';

export class TagRepository extends BaseRepository {
  constructor(db: Database) {
    super(db);
  }

  create(name: string): ITag {
    const id = generateId();
    const now = nowISO();

    this.execRun(
      'INSERT INTO tags (id, name, created_at) VALUES (?, ?, ?)',
      [id, name, now]
    );

    return { id, name, created_at: now };
  }

  getAll(): ITag[] {
    return this.getMany<ITag>('SELECT * FROM tags ORDER BY name ASC');
  }

  getByName(name: string): ITag | null {
    return this.getOne<ITag>('SELECT * FROM tags WHERE name = ?', [name]);
  }

  getById(id: string): ITag | null {
    return this.getOne<ITag>('SELECT * FROM tags WHERE id = ?', [id]);
  }

  getForIdea(ideaId: string): ITag[] {
    return this.getMany<ITag>(
      `SELECT t.* FROM tags t
       INNER JOIN idea_tags it ON it.tag_id = t.id
       WHERE it.idea_id = ?
       ORDER BY t.name ASC`,
      [ideaId]
    );
  }

  addToIdea(ideaId: string, tagId: string): void {
    this.execRun(
      'INSERT OR IGNORE INTO idea_tags (idea_id, tag_id) VALUES (?, ?)',
      [ideaId, tagId]
    );
  }

  removeFromIdea(ideaId: string, tagId: string): void {
    this.execRun(
      'DELETE FROM idea_tags WHERE idea_id = ? AND tag_id = ?',
      [ideaId, tagId]
    );
  }

  search(partial: string): ITag[] {
    return this.getMany<ITag>(
      'SELECT * FROM tags WHERE name LIKE ? ORDER BY name ASC LIMIT 10',
      [`%${partial}%`]
    );
  }

  delete(tagId: string): void {
    this.execRun('DELETE FROM tags WHERE id = ?', [tagId]);
  }
}
