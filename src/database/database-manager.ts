import initSqlJs, { type Database } from 'sql.js';
import { DatabaseError } from '@/lib/errors';
import { MIGRATIONS, type IMigration } from './migrations';
import {
  PERSIST_DEBOUNCE_MS,
  BACKUP_INTERVAL_MS,
  MAX_BACKUPS,
} from '@/lib/constants';

const DB_NAME = 'ideaforge-db';
const BACKUP_PREFIX = 'ideaforge-backup-';

interface IDatabaseManager {
  getDb(): Database;
  persist(): Promise<void>;
  exportDatabase(): Uint8Array;
  close(): void;
}

// IndexedDB helpers
function openIDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ideaforge', 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('data')) {
        db.createObjectStore('data');
      }
    };
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      reject(new DatabaseError('Failed to open IndexedDB', { error: request.error }));
    };
  });
}

function loadFromIndexedDB(key: string): Promise<Uint8Array | null> {
  return new Promise((resolve, reject) => {
    void openIDB().then((idb) => {
      const tx = idb.transaction('data', 'readonly');
      const store = tx.objectStore('data');
      const request = store.get(key);
      request.onsuccess = () => {
        const result = request.result as Uint8Array | undefined;
        resolve(result ?? null);
      };
      request.onerror = () => {
        reject(new DatabaseError('Failed to load from IndexedDB', { key, error: request.error }));
      };
      tx.oncomplete = () => {
        idb.close();
      };
    }).catch(reject);
  });
}

function saveToIndexedDB(key: string, data: Uint8Array): Promise<void> {
  return new Promise((resolve, reject) => {
    void openIDB().then((idb) => {
      const tx = idb.transaction('data', 'readwrite');
      const store = tx.objectStore('data');
      const request = store.put(data, key);
      request.onsuccess = () => {
        resolve();
      };
      request.onerror = () => {
        reject(new DatabaseError('Failed to save to IndexedDB', { key, error: request.error }));
      };
      tx.oncomplete = () => {
        idb.close();
      };
    }).catch(reject);
  });
}

function deleteFromIndexedDB(key: string): Promise<void> {
  return new Promise((resolve, reject) => {
    void openIDB().then((idb) => {
      const tx = idb.transaction('data', 'readwrite');
      const store = tx.objectStore('data');
      const request = store.delete(key);
      request.onsuccess = () => {
        resolve();
      };
      request.onerror = () => {
        reject(new DatabaseError('Failed to delete from IndexedDB', { key, error: request.error }));
      };
      tx.oncomplete = () => {
        idb.close();
      };
    }).catch(reject);
  });
}

async function getAllKeys(): Promise<string[]> {
  const idb = await openIDB();
  return new Promise((resolve, reject) => {
    const tx = idb.transaction('data', 'readonly');
    const store = tx.objectStore('data');
    const request = store.getAllKeys();
    request.onsuccess = () => {
      resolve(request.result.map(String));
    };
    request.onerror = () => {
      reject(new DatabaseError('Failed to get keys from IndexedDB'));
    };
    tx.oncomplete = () => {
      idb.close();
    };
  });
}

async function pruneOldBackups(): Promise<void> {
  const keys = await getAllKeys();
  const backupKeys = keys
    .filter((k) => k.startsWith(BACKUP_PREFIX))
    .sort()
    .reverse();

  const toDelete = backupKeys.slice(MAX_BACKUPS);
  for (const key of toDelete) {
    await deleteFromIndexedDB(key);
  }
}

// Migration runner
function getCurrentVersion(db: Database): number {
  try {
    const result = db.exec(
      'SELECT MAX(version) as v FROM schema_version'
    );
    if (result.length > 0 && result[0]?.values[0]?.[0] != null) {
      return result[0].values[0][0] as number;
    }
    return 0;
  } catch {
    return 0;
  }
}

function applyMigrations(db: Database): void {
  // Ensure schema_version table exists for fresh databases
  db.run(`CREATE TABLE IF NOT EXISTS schema_version (
    version INTEGER PRIMARY KEY,
    applied_at TEXT NOT NULL DEFAULT (datetime('now')),
    description TEXT
  )`);

  const currentVersion = getCurrentVersion(db);
  const pending = MIGRATIONS.filter(
    (m: IMigration) => m.version > currentVersion
  );

  for (const migration of pending) {
    db.run('BEGIN TRANSACTION');
    try {
      db.run(migration.sql);
      db.run(
        'INSERT OR REPLACE INTO schema_version (version, description) VALUES (?, ?)',
        [migration.version, migration.description]
      );
      db.run('COMMIT');
    } catch (error: unknown) {
      db.run('ROLLBACK');
      throw new DatabaseError(
        `Migration v${migration.version} failed: ${migration.description}`,
        { version: migration.version, error }
      );
    }
  }
}

// Debounced persist
function createDebouncedPersist(
  db: Database,
  delayMs: number
): () => Promise<void> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let pendingResolvers: Array<{
    resolve: () => void;
    reject: (error: unknown) => void;
  }> = [];

  return function persist(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      pendingResolvers.push({ resolve, reject });

      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        timeoutId = null;
        const resolvers = [...pendingResolvers];
        pendingResolvers = [];

        const data = db.export();
        const uint8 = new Uint8Array(data);

        saveToIndexedDB(DB_NAME, uint8).then(
          () => {
            for (const r of resolvers) {
              r.resolve();
            }
          },
          (error: unknown) => {
            for (const r of resolvers) {
              r.reject(error);
            }
          }
        );
      }, delayMs);
    });
  };
}

// Public factory function (no async constructor)
export async function createDatabaseManager(): Promise<IDatabaseManager> {
  const SQL = await initSqlJs({
    locateFile: (file: string) => `/sql.js/${file}`,
  });

  // Try to load existing database from IndexedDB
  const existing = await loadFromIndexedDB(DB_NAME);
  const db = existing ? new SQL.Database(existing) : new SQL.Database();

  // PRAGMA foreign_keys=ON on every open
  db.run('PRAGMA foreign_keys = ON');

  // NO PRAGMA journal_mode=WAL (WARN-02: sql.js is in-memory)

  // Apply pending migrations
  applyMigrations(db);

  // Create debounced persist
  const persist = createDebouncedPersist(db, PERSIST_DEBOUNCE_MS);

  // Auto-backup interval
  const backupInterval = setInterval(() => {
    const data = db.export();
    const uint8 = new Uint8Array(data);
    const backupKey = `${BACKUP_PREFIX}${new Date().toISOString().replace(/[:.]/g, '-')}`;

    void saveToIndexedDB(backupKey, uint8)
      .then(() => pruneOldBackups())
      .catch((error: unknown) => {
        console.error('Auto-backup failed:', error);
      });
  }, BACKUP_INTERVAL_MS);

  return {
    getDb(): Database {
      return db;
    },

    persist,

    exportDatabase(): Uint8Array {
      return new Uint8Array(db.export());
    },

    close(): void {
      clearInterval(backupInterval);
      db.close();
    },
  };
}

export type { IDatabaseManager };
