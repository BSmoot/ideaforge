import { useState, useCallback, useRef, useEffect } from 'react';
import type { ITag } from '@/types';
import { TagRepository } from '@/database/repositories/tag-repository';
import { useDatabase } from '@/database/database-context';

interface IUseTagAutocompleteReturn {
  suggestions: ITag[];
  isOpen: boolean;
  search: (query: string) => void;
  close: () => void;
}

export function useTagAutocomplete(): IUseTagAutocompleteReturn {
  const { db } = useDatabase();
  const [suggestions, setSuggestions] = useState<ITag[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const search = useCallback(
    (query: string): void => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      if (query.length === 0) {
        setSuggestions([]);
        setIsOpen(false);
        return;
      }

      timerRef.current = setTimeout(() => {
        const repo = new TagRepository(db);
        const results = repo.search(query);
        setSuggestions(results);
        setIsOpen(results.length > 0);
      }, 200);
    },
    [db]
  );

  const close = useCallback((): void => {
    setSuggestions([]);
    setIsOpen(false);
  }, []);

  return { suggestions, isOpen, search, close };
}
