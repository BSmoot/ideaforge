import type { Database } from 'sql.js';
import type { IIdea, ISearchResult, IdeaStatus } from '@/types';
import { MIN_SEARCH_LENGTH, MAX_SEARCH_RESULTS } from '@/lib/constants';
import { truncateText } from '@/lib/markdown';

function rowToIdea(row: Record<string, unknown>): IIdea {
  return {
    id: row.id as string,
    title: row.title as string,
    content: typeof row.content === 'string' ? row.content : '',
    status: row.status as IdeaStatus,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
    metadata: typeof row.metadata === 'string' ? JSON.parse(row.metadata) as Record<string, unknown> : {},
  };
}

function parseRows(execResult: { columns: string[]; values: unknown[][] }[]): Record<string, unknown>[] {
  if (execResult.length === 0 || !execResult[0]) return [];
  const columns = execResult[0].columns;
  return execResult[0].values.map((values) => {
    const row: Record<string, unknown> = {};
    for (let i = 0; i < columns.length; i++) {
      const colName = columns[i];
      if (colName) row[colName] = values[i];
    }
    return row;
  });
}

export function createSearchService(getDb: () => Database): { search: (query: string, limit?: number) => ISearchResult[] } {
  function search(query: string, limit: number = MAX_SEARCH_RESULTS): ISearchResult[] {
    if (query.length < MIN_SEARCH_LENGTH) {
      return [];
    }

    const db = getDb();
    const results: ISearchResult[] = [];
    const seenIds = new Set<string>();
    const pattern = `%${query}%`;

    // Title matches (highest relevance)
    try {
      const titleRows = parseRows(
        db.exec(
          `SELECT * FROM ideas WHERE title LIKE ? ORDER BY updated_at DESC LIMIT ?`,
          [pattern, limit]
        )
      );
      for (const row of titleRows) {
        const idea = rowToIdea(row);
        seenIds.add(idea.id);
        results.push({
          idea,
          matchType: 'title',
          snippet: idea.title,
          rank: 1,
        });
      }
    } catch {
      // Title search failed
    }

    // Content matches
    try {
      const contentRows = parseRows(
        db.exec(
          `SELECT * FROM ideas WHERE content LIKE ? ORDER BY updated_at DESC LIMIT ?`,
          [pattern, limit]
        )
      );
      for (const row of contentRows) {
        const idea = rowToIdea(row);
        if (!seenIds.has(idea.id)) {
          seenIds.add(idea.id);
          results.push({
            idea,
            matchType: 'content',
            snippet: truncateText(idea.content, 120),
            rank: 10,
          });
        }
      }
    } catch {
      // Content search failed
    }

    // Tag matches
    try {
      const tagRows = parseRows(
        db.exec(
          `SELECT DISTINCT i.*
           FROM ideas i
           INNER JOIN idea_tags it ON it.idea_id = i.id
           INNER JOIN tags t ON t.id = it.tag_id
           WHERE t.name LIKE ?
           LIMIT ?`,
          [pattern, limit]
        )
      );
      for (const row of tagRows) {
        const idea = rowToIdea(row);
        if (!seenIds.has(idea.id)) {
          seenIds.add(idea.id);
          results.push({
            idea,
            matchType: 'tag',
            snippet: idea.title,
            rank: 50,
          });
        }
      }
    } catch {
      // Tag search failed
    }

    return results.slice(0, limit);
  }

  return { search };
}
