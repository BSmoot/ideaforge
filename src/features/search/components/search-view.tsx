import { useState, useRef, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import type { ISearchResult } from '@/types';
import { useDatabase } from '@/database/database-context';
import { createSearchService } from '../services/search-service';
import { SearchInput } from './search-input';
import { SearchResults } from './search-results';
import { SEARCH_DEBOUNCE_MS } from '@/lib/constants';

export function SearchView(): React.ReactElement {
  const { db } = useDatabase();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ISearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const performSearch = useCallback(
    (q: string): void => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        const service = createSearchService(() => db);
        setResults(service.search(q));
      }, SEARCH_DEBOUNCE_MS);
    },
    [db]
  );

  const handleChange = (value: string): void => {
    setQuery(value);
    performSearch(value);
  };

  return (
    <div className="mx-auto max-w-5xl p-6">
      <SearchInput
        ref={inputRef}
        value={query}
        onValueChange={handleChange}
        placeholder="Search ideas, content, and tags..."
      />

      <div className="mt-6">
        {query.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-background-muted">
              <Search className="h-8 w-8 text-foreground-tertiary" />
            </div>
            <p className="text-foreground-secondary">Search your ideas</p>
            <p className="mt-1 text-sm text-foreground-tertiary">
              Find ideas by title, content, or tags
            </p>
          </div>
        ) : (
          <SearchResults results={results} query={query} />
        )}
      </div>
    </div>
  );
}
