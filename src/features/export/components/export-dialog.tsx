import { useState } from 'react';
import { Download, FileJson, FileText } from 'lucide-react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/modal';
import { Button } from '@/components/ui';
import { useDatabase } from '@/database/database-context';
import { useToast } from '@/hooks/use-toast';
import { exportAllAsJson, exportIdeaAsMarkdown, estimateExportSize } from '../services/export-service';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentIdeaId?: string;
  currentIdeaTitle?: string;
}

export function ExportDialog({
  open,
  onOpenChange,
  currentIdeaId,
  currentIdeaTitle,
}: ExportDialogProps): React.ReactElement {
  const { db } = useDatabase();
  const { addToast } = useToast();
  const [exporting, setExporting] = useState(false);

  const handleExportJson = (): void => {
    setExporting(true);
    try {
      exportAllAsJson(db);
      addToast('Ideas exported as JSON', 'success');
      onOpenChange(false);
    } catch {
      addToast('Failed to export ideas', 'error');
    } finally {
      setExporting(false);
    }
  };

  const handleExportMarkdown = (): void => {
    if (!currentIdeaId) return;
    setExporting(true);
    try {
      exportIdeaAsMarkdown(db, currentIdeaId);
      addToast('Idea exported as Markdown', 'success');
      onOpenChange(false);
    } catch {
      addToast('Failed to export idea', 'error');
    } finally {
      setExporting(false);
    }
  };

  let sizeEstimate = '';
  try {
    sizeEstimate = estimateExportSize(db);
  } catch {
    sizeEstimate = 'unknown';
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} size="sm">
      <ModalHeader>
        <div className="flex items-center gap-2">
          <Download className="h-5 w-5 text-forge-400" />
          <span>Export Ideas</span>
        </div>
      </ModalHeader>
      <ModalBody>
        <div className="space-y-3">
          <button
            type="button"
            disabled={exporting}
            onClick={handleExportJson}
            className="flex w-full items-center gap-3 rounded-lg border border-steel-700 bg-steel-800/50 p-4 text-left transition-colors hover:border-forge-500/50 hover:bg-steel-800 disabled:opacity-50"
          >
            <FileJson className="h-8 w-8 text-forge-400" />
            <div>
              <p className="font-medium text-steel-100">Export All as JSON</p>
              <p className="text-xs text-steel-400">
                All ideas, tags, and connections ({sizeEstimate})
              </p>
            </div>
          </button>

          {currentIdeaId && (
            <button
              type="button"
              disabled={exporting}
              onClick={handleExportMarkdown}
              className="flex w-full items-center gap-3 rounded-lg border border-steel-700 bg-steel-800/50 p-4 text-left transition-colors hover:border-forge-500/50 hover:bg-steel-800 disabled:opacity-50"
            >
              <FileText className="h-8 w-8 text-forge-400" />
              <div>
                <p className="font-medium text-steel-100">
                  Export Current Idea as Markdown
                </p>
                <p className="text-xs text-steel-400">
                  {currentIdeaTitle ?? 'Current idea'} as .md file
                </p>
              </div>
            </button>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => { onOpenChange(false); }}
        >
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
