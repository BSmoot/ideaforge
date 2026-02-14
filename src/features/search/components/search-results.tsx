import { Link } from 'react-router';
import type { ISearchResult } from '@/types';
import { Badge } from '@/components/ui';
import { formatRelativeTime } from '@/lib/date';

interface SearchResultsProps {
  results: ISearchResult[];
  query: string;
}

export function SearchResults({
  results,
  query,
}: SearchResultsProps): React.ReactElement {
  if (results.length === 0 && query.length >= 2) {
    return (
      <div className="py-12 text-center">
        <p className="text-foreground-secondary">No results found for "{query}"</p>
        <p className="mt-1 text-sm text-foreground-tertiary">
          Try a different search term
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {query.length >= 2 && (
        <p className="text-sm text-foreground-secondary">
          {results.length} {results.length === 1 ? 'result' : 'results'} for "{query}"
        </p>
      )}
      {results.map((result) => (
        <Link
          key={result.idea.id}
          to={`/ideas/${result.idea.id}`}
          className="block rounded-lg border border-border bg-surface p-4 transition-colors hover:border-border-strong"
        >
          <div className="mb-1 flex items-center gap-2">
            <h3 className="font-semibold text-foreground">{result.idea.title}</h3>
            <Badge variant={result.idea.status} size="sm">
              {result.idea.status}
            </Badge>
            <Badge variant="info" size="sm">
              {result.matchType}
            </Badge>
          </div>
          <p
            className="text-sm text-foreground-secondary [&>mark]:bg-highlight-bg [&>mark]:text-highlight-text"
            dangerouslySetInnerHTML={{ __html: result.snippet }}
          />
          <p className="mt-2 text-xs text-foreground-tertiary">
            {formatRelativeTime(result.idea.updated_at)}
          </p>
        </Link>
      ))}
    </div>
  );
}
