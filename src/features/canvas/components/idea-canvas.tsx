import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { ArrowLeft, Trash2, MessageSquare } from 'lucide-react';
import type { IIdea } from '@/types';
import { Button } from '@/components/ui';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { IdeaRepository } from '@/database/repositories/idea-repository';
import { useDatabase } from '@/database/database-context';
import { useAppStore } from '@/store';
import { useToast } from '@/hooks/use-toast';
import { AIChatPanel } from '@/features/ai-chat';
import { MarkdownEditor } from './markdown-editor';
import { TitleEditor } from './title-editor';
import { StatusDropdown } from './status-dropdown';
import { SaveIndicator } from './save-indicator';
import { MetadataPanel } from './metadata-panel';
import { useMarkdownEditor } from '../hooks/use-editor';
import { useAutoSave } from '../hooks/use-auto-save';

export function IdeaCanvas(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { db, manager } = useDatabase();
  const removeIdea = useAppStore((s) => s.removeIdea);
  const { addToast } = useToast();
  const [idea, setIdea] = useState<IIdea | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [editorContent, setEditorContent] = useState('');

  useEffect(() => {
    if (!id) return;
    const repo = new IdeaRepository(db);
    const found = repo.getById(id);
    setIdea(found);
    if (found) {
      setEditorContent(found.content);
    }
  }, [db, id]);

  const handleContentChange = useCallback((markdown: string): void => {
    setEditorContent(markdown);
  }, []);

  const editor = useMarkdownEditor({
    content: idea?.content ?? '',
    onUpdate: handleContentChange,
  });

  const { status, lastSaved } = useAutoSave(
    id ?? '',
    editorContent,
    !!idea
  );

  const handleDelete = (): void => {
    if (!id) return;
    try {
      const repo = new IdeaRepository(db);
      repo.delete(id);
      void manager.persist();
      removeIdea(id);
      addToast('Idea deleted', 'success');
      void navigate('/ideas');
    } catch {
      addToast('Failed to delete idea', 'error');
    }
  };

  if (!idea) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-steel-300">Idea not found</h1>
          <Link to="/ideas" className="mt-4 inline-block">
            <Button variant="primary">Back to Ideas</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Main editor area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Canvas header */}
        <div className="flex items-center justify-between border-b border-steel-800 px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              to="/ideas"
              className="rounded-lg p-1 text-steel-400 hover:bg-steel-800 hover:text-steel-200"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <StatusDropdown ideaId={idea.id} currentStatus={idea.status} />
            <SaveIndicator status={status} lastSaved={lastSaved} />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setChatOpen((prev) => !prev); }}
              aria-label="Toggle AI chat"
            >
              <MessageSquare className="h-4 w-4 text-forge-400" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setDeleteOpen(true); }}
            >
              <Trash2 className="h-4 w-4 text-steel-400" />
            </Button>
          </div>
        </div>

        {/* Title + Editor */}
        <div className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-5xl">
            <TitleEditor ideaId={idea.id} initialTitle={idea.title} />
            <div className="mt-4">
              <MarkdownEditor editor={editor} />
            </div>
          </div>
        </div>
      </div>

      {/* AI Chat panel */}
      {chatOpen && (
        <aside className="w-80 border-l border-steel-800 bg-steel-900/50">
          <AIChatPanel ideaId={idea.id} />
        </aside>
      )}

      {/* Metadata sidebar */}
      <aside className="hidden w-72 border-l border-steel-800 bg-steel-900/50 p-4 lg:block">
        <MetadataPanel idea={idea} editorContent={editorContent} />
      </aside>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Idea"
        message={`Delete "${idea.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
}
