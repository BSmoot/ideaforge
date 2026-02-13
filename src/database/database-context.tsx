import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import type { Database } from 'sql.js';
import {
  createDatabaseManager,
  type IDatabaseManager,
} from '@/database/database-manager';
import { LoadingSkeleton } from '@/components/layouts/loading-skeleton';

interface IDatabaseContext {
  db: Database;
  manager: IDatabaseManager;
}

const DatabaseContext = createContext<IDatabaseContext | null>(null);

export function DatabaseProvider({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  const [ctx, setCtx] = useState<IDatabaseContext | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let manager: IDatabaseManager | null = null;

    void createDatabaseManager()
      .then((m) => {
        manager = m;
        setCtx({ db: m.getDb(), manager: m });
      })
      .catch((err: unknown) => {
        setError(
          err instanceof Error ? err.message : 'Failed to initialize database'
        );
      });

    return () => {
      manager?.close();
    };
  }, []);

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-steel-950 text-red-400">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Database Error</h1>
          <p className="mt-2 text-steel-400">{error}</p>
          <button
            onClick={() => {
              window.location.reload();
            }}
            className="mt-4 rounded-lg bg-forge-500 px-4 py-2 text-white hover:bg-forge-600"
            type="button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!ctx) {
    return <LoadingSkeleton />;
  }

  return (
    <DatabaseContext.Provider value={ctx}>{children}</DatabaseContext.Provider>
  );
}

export function useDatabase(): IDatabaseContext {
  const ctx = useContext(DatabaseContext);
  if (!ctx) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return ctx;
}
