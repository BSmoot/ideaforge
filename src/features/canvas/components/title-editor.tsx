import { useState, useRef, useEffect } from 'react';
import { IdeaRepository } from '@/database/repositories/idea-repository';
import { useDatabase } from '@/database/database-context';
import { useAppStore } from '@/store';
import { MAX_TITLE_LENGTH } from '@/lib/constants';

interface TitleEditorProps {
  ideaId: string;
  initialTitle: string;
}

export function TitleEditor({
  ideaId,
  initialTitle,
}: TitleEditorProps): React.ReactElement {
  const { db, manager } = useDatabase();
  const updateIdea = useAppStore((s) => s.updateIdea);
  const [title, setTitle] = useState(initialTitle);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);

  const handleBlur = (): void => {
    const trimmed = title.trim();
    if (trimmed && trimmed !== initialTitle) {
      const repo = new IdeaRepository(db);
      repo.update(ideaId, { title: trimmed });
      void manager.persist();
      updateIdea(ideaId, { title: trimmed });
    } else if (!trimmed) {
      setTitle(initialTitle);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
    }
  };

  return (
    <input
      ref={inputRef}
      value={title}
      onChange={(e) => { setTitle(e.target.value.slice(0, MAX_TITLE_LENGTH)); }}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className="w-full bg-transparent text-2xl font-bold text-steel-100 placeholder:text-steel-600 focus:outline-none"
      placeholder="Untitled idea"
    />
  );
}
