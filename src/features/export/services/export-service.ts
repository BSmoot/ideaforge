import type { Database } from 'sql.js';
import { IdeaRepository } from '@/database/repositories/idea-repository';
import { TagRepository } from '@/database/repositories/tag-repository';
import { ConnectionRepository } from '@/database/repositories/connection-repository';
import { ExportError } from '@/lib/errors';

interface IExportIdea {
  readonly id: string;
  readonly title: string;
  readonly content: string;
  readonly status: string;
  readonly metadata: Record<string, unknown> | null;
  readonly created_at: string;
  readonly updated_at: string;
  readonly tags: Array<{ name: string }>;
  readonly connections: Array<{
    target_id: string;
    type: string;
    description: string | null;
  }>;
}

interface IExportPayload {
  readonly version: string;
  readonly exported_at: string;
  readonly idea_count: number;
  readonly ideas: readonly IExportIdea[];
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function exportAllAsJson(db: Database): void {
  try {
    const ideaRepo = new IdeaRepository(db);
    const tagRepo = new TagRepository(db);
    const connectionRepo = new ConnectionRepository(db);

    const ideas = ideaRepo.getAll();

    const exportIdeas: IExportIdea[] = ideas.map((idea) => {
      const tags = tagRepo.getForIdea(idea.id).map((t) => ({
        name: t.name,
      }));
      const connections = connectionRepo.getForIdea(idea.id).map((c) => ({
        target_id: c.target_id,
        type: c.type,
        description: c.description,
      }));

      return {
        id: idea.id,
        title: idea.title,
        content: idea.content,
        status: idea.status,
        metadata: idea.metadata,
        created_at: idea.created_at,
        updated_at: idea.updated_at,
        tags,
        connections,
      };
    });

    const payload: IExportPayload = {
      version: '1.0.0',
      exported_at: new Date().toISOString(),
      idea_count: exportIdeas.length,
      ideas: exportIdeas,
    };

    const json = JSON.stringify(payload, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const date = new Date().toISOString().slice(0, 10);
    triggerDownload(blob, `ideaforge-export-${date}.json`);
  } catch (error) {
    throw new ExportError('Failed to export ideas as JSON', {
      originalError: error instanceof Error ? error.message : String(error),
    });
  }
}

export function exportIdeaAsMarkdown(db: Database, ideaId: string): void {
  try {
    const ideaRepo = new IdeaRepository(db);
    const tagRepo = new TagRepository(db);
    const idea = ideaRepo.getById(ideaId);

    if (!idea) {
      throw new ExportError('Idea not found', { ideaId });
    }

    const tags = tagRepo.getForIdea(ideaId);
    const tagLine = tags.length > 0
      ? `\nTags: ${tags.map((t) => t.name).join(', ')}\n`
      : '';

    const markdown = [
      `# ${idea.title}`,
      '',
      `Status: ${idea.status}`,
      tagLine,
      `Created: ${idea.created_at}`,
      `Updated: ${idea.updated_at}`,
      '',
      '---',
      '',
      idea.content,
    ].join('\n');

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const slug = idea.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 50);
    triggerDownload(blob, `${slug}.md`);
  } catch (error) {
    if (error instanceof ExportError) throw error;
    throw new ExportError('Failed to export idea as Markdown', {
      ideaId,
      originalError: error instanceof Error ? error.message : String(error),
    });
  }
}

export function estimateExportSize(db: Database): string {
  const ideaRepo = new IdeaRepository(db);
  const ideas = ideaRepo.getAll();
  const totalChars = ideas.reduce(
    (sum, idea) => sum + idea.title.length + idea.content.length,
    0
  );
  const estimatedBytes = totalChars * 2; // rough JSON overhead
  if (estimatedBytes < 1024) return `${estimatedBytes} B`;
  if (estimatedBytes < 1024 * 1024) return `${Math.round(estimatedBytes / 1024)} KB`;
  return `${(estimatedBytes / (1024 * 1024)).toFixed(1)} MB`;
}
