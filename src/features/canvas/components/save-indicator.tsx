import { Check, Loader2, AlertCircle } from 'lucide-react';
import { formatRelativeTime } from '@/lib/date';

interface SaveIndicatorProps {
  status: 'idle' | 'saving' | 'saved' | 'error';
  lastSaved: string | null;
}

export function SaveIndicator({
  status,
  lastSaved,
}: SaveIndicatorProps): React.ReactElement {
  if (status === 'saving') {
    return (
      <span className="flex items-center gap-1 text-xs text-steel-400">
        <Loader2 className="h-3 w-3 animate-spin" />
        Saving...
      </span>
    );
  }

  if (status === 'error') {
    return (
      <span className="flex items-center gap-1 text-xs text-red-400">
        <AlertCircle className="h-3 w-3" />
        Save failed
      </span>
    );
  }

  if (status === 'saved' && lastSaved) {
    return (
      <span className="flex items-center gap-1 text-xs text-green-400">
        <Check className="h-3 w-3" />
        Saved {formatRelativeTime(lastSaved)}
      </span>
    );
  }

  return <span className="text-xs text-steel-500">Ready</span>;
}
