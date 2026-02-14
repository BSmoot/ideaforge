import type { IdeaStatus } from '@/types';
import { Badge } from '@/components/ui';
import { IdeaRepository } from '@/database/repositories/idea-repository';
import { useDatabase } from '@/database/database-context';
import { useAppStore } from '@/store';
import { useToast } from '@/hooks/use-toast';
import { IDEA_STATUSES } from '@/lib/constants';

interface StatusDropdownProps {
  ideaId: string;
  currentStatus: IdeaStatus;
}

export function StatusDropdown({
  ideaId,
  currentStatus,
}: StatusDropdownProps): React.ReactElement {
  const { db, manager } = useDatabase();
  const updateIdea = useAppStore((s) => s.updateIdea);
  const { addToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const newStatus = e.target.value as IdeaStatus;
    if (newStatus === currentStatus) return;

    try {
      const repo = new IdeaRepository(db);
      repo.update(ideaId, { status: newStatus });
      void manager.persist();
      updateIdea(ideaId, { status: newStatus });
      addToast(`Status changed to ${newStatus}`, 'success');
    } catch {
      addToast('Failed to update status', 'error');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Badge variant={currentStatus} size="md">
        {currentStatus}
      </Badge>
      <select
        value={currentStatus}
        onChange={handleChange}
        className="rounded border border-border-input bg-background px-2 py-1 text-xs text-foreground-secondary focus:outline-none focus:ring-1 focus:ring-border-focus"
        aria-label="Change status"
      >
        {IDEA_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}
