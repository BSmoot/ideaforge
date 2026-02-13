import { useState, useCallback } from 'react';
import type { ITag } from '@/types';
import { CreateIdeaSchema } from '@/lib/validation';
import { IdeaRepository } from '@/database/repositories/idea-repository';
import { TagRepository } from '@/database/repositories/tag-repository';
import { useDatabase } from '@/database/database-context';
import { useAppStore } from '@/store';
import { useToast } from '@/hooks/use-toast';

interface IUseSparkCaptureReturn {
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  tags: ITag[];
  setTags: (tags: ITag[]) => void;
  errors: Record<string, string>;
  isSubmitting: boolean;
  submit: () => Promise<boolean>;
  reset: () => void;
}

export function useSparkCapture(): IUseSparkCaptureReturn {
  const { db, manager } = useDatabase();
  const addIdea = useAppStore((s) => s.addIdea);
  const { addToast } = useToast();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<ITag[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reset = useCallback((): void => {
    setTitle('');
    setContent('');
    setTags([]);
    setErrors({});
    setIsSubmitting(false);
  }, []);

  const submit = useCallback(async (): Promise<boolean> => {
    setErrors({});
    setIsSubmitting(true);

    const result = CreateIdeaSchema.safeParse({
      title: title.trim(),
      content,
      tags: tags.map((t) => t.name),
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (typeof field === 'string') {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return false;
    }

    try {
      const ideaRepo = new IdeaRepository(db);
      const tagRepo = new TagRepository(db);
      const idea = ideaRepo.create(result.data);

      for (const tag of tags) {
        tagRepo.addToIdea(idea.id, tag.id);
      }

      await manager.persist();
      addIdea(idea);
      addToast('Spark captured!', 'success');
      reset();
      return true;
    } catch (error: unknown) {
      addToast(
        error instanceof Error ? error.message : 'Failed to save spark',
        'error'
      );
      setIsSubmitting(false);
      return false;
    }
  }, [title, content, tags, db, manager, addIdea, addToast, reset]);

  return {
    title,
    setTitle,
    content,
    setContent,
    tags,
    setTags,
    errors,
    isSubmitting,
    submit,
    reset,
  };
}
