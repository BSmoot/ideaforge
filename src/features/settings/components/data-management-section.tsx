import { useState } from 'react';
import { Button, Input } from '@/components/ui';
import { useDatabase } from '@/database/database-context';
import { IdeaRepository } from '@/database/repositories/idea-repository';
import { TagRepository } from '@/database/repositories/tag-repository';
import { useToast } from '@/hooks/use-toast';
import { Download } from 'lucide-react';

export function DataManagementSection(): React.ReactElement {
  const { db, manager } = useDatabase();
  const { addToast } = useToast();
  const [confirmText, setConfirmText] = useState('');

  const handleExportJSON = (): void => {
    try {
      const ideaRepo = new IdeaRepository(db);
      const tagRepo = new TagRepository(db);
      const ideas = ideaRepo.getAll();
      const data = ideas.map((idea) => ({
        ...idea,
        tags: tagRepo.getForIdea(idea.id).map((t) => t.name),
      }));

      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ideaforge-export-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      addToast('Export downloaded', 'success');
    } catch {
      addToast('Export failed', 'error');
    }
  };

  const handleExportDB = (): void => {
    try {
      const data = manager.exportDatabase();
      const blob = new Blob([data.buffer as ArrayBuffer], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ideaforge-backup-${new Date().toISOString().slice(0, 10)}.sqlite`;
      a.click();
      URL.revokeObjectURL(url);
      addToast('Database backup downloaded', 'success');
    } catch {
      addToast('Backup failed', 'error');
    }
  };

  const handleClearAll = (): void => {
    if (confirmText !== 'DELETE') return;
    try {
      indexedDB.deleteDatabase('ideaforge');
      localStorage.clear();
      addToast('All data cleared. Reloading...', 'info');
      setTimeout(() => { window.location.reload(); }, 1500);
    } catch {
      addToast('Failed to clear data', 'error');
    }
  };

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Data Management</h2>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={handleExportJSON}>
          <Download className="mr-1.5 h-4 w-4" />
          Export JSON
        </Button>
        <Button variant="secondary" onClick={handleExportDB}>
          <Download className="mr-1.5 h-4 w-4" />
          Database Backup
        </Button>
      </div>

      <div className="mt-6 rounded-lg border border-status-error/20 bg-status-error-bg p-4">
        <h3 className="text-sm font-semibold text-status-error">Danger Zone</h3>
        <p className="mt-1 text-sm text-foreground-secondary">
          This will permanently delete all your ideas, settings, and backups.
        </p>
        <div className="mt-3 flex items-center gap-3">
          <Input
            value={confirmText}
            onChange={(e) => { setConfirmText(e.target.value); }}
            placeholder='Type "DELETE" to confirm'
            state={confirmText === 'DELETE' ? 'error' : 'default'}
            className="max-w-[200px]"
          />
          <Button
            variant="destructive"
            disabled={confirmText !== 'DELETE'}
            onClick={handleClearAll}
          >
            Clear All Data
          </Button>
        </div>
      </div>
    </section>
  );
}
