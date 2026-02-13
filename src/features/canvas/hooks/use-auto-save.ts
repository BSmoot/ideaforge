import { useEffect, useRef, useCallback, useReducer } from 'react';
import { IdeaRepository } from '@/database/repositories/idea-repository';
import { useDatabase } from '@/database/database-context';
import { DEBOUNCE_MS } from '@/lib/constants';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface IUseAutoSaveReturn {
  status: SaveStatus;
  lastSaved: string | null;
}

export function useAutoSave(
  ideaId: string,
  content: string,
  enabled = true
): IUseAutoSaveReturn {
  const { db, manager } = useDatabase();
  const statusRef = useRef<SaveStatus>('idle');
  const lastSavedRef = useRef<string | null>(null);
  const lastContentRef = useRef(content);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);

  const save = useCallback(
    async (newContent: string): Promise<void> => {
      if (newContent === lastContentRef.current && statusRef.current !== 'idle') {
        return;
      }
      statusRef.current = 'saving';
      forceUpdate();

      try {
        const repo = new IdeaRepository(db);
        repo.update(ideaId, { content: newContent });
        await manager.persist();
        lastContentRef.current = newContent;
        lastSavedRef.current = new Date().toISOString();
        statusRef.current = 'saved';
      } catch {
        statusRef.current = 'error';
      }
      forceUpdate();
    },
    [db, manager, ideaId, forceUpdate]
  );

  useEffect(() => {
    if (!enabled) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      void save(content);
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [content, save, enabled]);

  return {
    status: statusRef.current,
    lastSaved: lastSavedRef.current,
  };
}
