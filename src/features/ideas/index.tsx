import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Plus, Lightbulb } from 'lucide-react';
import type { IIdea, IdeaStatus } from '@/types';
import { Badge, Button } from '@/components/ui';
import { useDatabase } from '@/database/database-context';
import { IdeaRepository } from '@/database/repositories/idea-repository';
import { useAppStore } from '@/store';
import { SparkCaptureModal } from '@/features/spark';
import { formatRelativeTime } from '@/lib/date';
import { truncateText, stripMarkdown } from '@/lib/markdown';
import { IDEA_STATUSES } from '@/lib/constants';
import { cn } from '@/lib/utils';

const STATUS_LABELS: Record<IdeaStatus, string> = {
  spark: 'Spark',
  developing: 'Developing',
  refined: 'Refined',
  parked: 'Parked',
  archived: 'Archived',
};

export function IdeasDashboard(): React.ReactElement {
  const { db } = useDatabase();
  const ideas = useAppStore((s) => s.ideas);
  const loadIdeas = useAppStore((s) => s.loadIdeas);
  const statusFilter = useAppStore((s) => s.statusFilter);
  const setStatusFilter = useAppStore((s) => s.setStatusFilter);
  const sortOrder = useAppStore((s) => s.sortOrder);
  const setSortOrder = useAppStore((s) => s.setSortOrder);
  const [sparkOpen, setSparkOpen] = useState(false);

  // Load ideas from DB on mount
  useEffect(() => {
    const repo = new IdeaRepository(db);
    const filters = statusFilter ? { status: statusFilter } : undefined;
    const all = repo.getAll(filters, sortOrder);
    loadIdeas(all);
  }, [db, loadIdeas, statusFilter, sortOrder]);

  const filtered = statusFilter
    ? ideas.filter((i) => i.status === statusFilter)
    : ideas;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Ideas</h1>
          <p className="mt-1 text-sm text-foreground-secondary">
            {filtered.length} {filtered.length === 1 ? 'idea' : 'ideas'}
          </p>
        </div>
        <Button variant="accent" size="sm" onClick={() => { setSparkOpen(true); }}>
          <Plus className="mr-1.5 h-4 w-4" />
          New Spark
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => { setStatusFilter(null); }}
          className={cn(
            'rounded-full px-3 py-1 text-xs font-medium transition-colors',
            statusFilter === null
              ? 'bg-accent-subtle text-accent-text'
              : 'text-foreground-secondary hover:bg-surface-hover hover:text-foreground'
          )}
        >
          All
        </button>
        {IDEA_STATUSES.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => { setStatusFilter(status === statusFilter ? null : status); }}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-colors',
              status === statusFilter
                ? 'bg-accent-subtle text-accent-text'
                : 'text-foreground-secondary hover:bg-surface-hover hover:text-foreground'
            )}
          >
            {STATUS_LABELS[status]}
          </button>
        ))}

        <div className="ml-auto">
          <select
            value={sortOrder}
            onChange={(e) => { setSortOrder(e.target.value as typeof sortOrder); }}
            className="rounded-lg border border-border-input bg-background px-3 py-1 text-xs text-foreground-secondary focus:border-border-focus focus:outline-none"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="updated">Recently updated</option>
            <option value="alphabetical">A-Z</option>
          </select>
        </div>
      </div>

      {/* Ideas grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-background-muted">
            <Lightbulb className="h-8 w-8 text-foreground-tertiary" />
          </div>
          <h2 className="text-lg font-semibold text-foreground-secondary">No ideas yet</h2>
          <p className="mt-1 text-sm text-foreground-tertiary">
            Capture your first spark to get started.
          </p>
          <Button
            variant="accent"
            size="sm"
            className="mt-4"
            onClick={() => { setSparkOpen(true); }}
          >
            <Plus className="mr-1.5 h-4 w-4" />
            New Spark
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      )}

      <SparkCaptureModal open={sparkOpen} onOpenChange={setSparkOpen} />
    </div>
  );
}

function IdeaCard({ idea }: { idea: IIdea }): React.ReactElement {
  const preview = truncateText(stripMarkdown(idea.content), 120);

  return (
    <Link
      to={`/ideas/${idea.id}`}
      className="block rounded-lg border border-border bg-surface p-4 transition-all hover:border-accent/50 hover:shadow-md"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="line-clamp-1 font-semibold text-foreground">
          {idea.title}
        </h3>
        <Badge variant={idea.status} size="sm">
          {STATUS_LABELS[idea.status]}
        </Badge>
      </div>
      {preview && (
        <p className="mb-3 line-clamp-2 text-sm text-foreground-secondary">{preview}</p>
      )}
      <p className="text-xs text-foreground-tertiary">
        {formatRelativeTime(idea.updated_at)}
      </p>
    </Link>
  );
}
