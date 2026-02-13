import type { IIdea, ITag } from '@/types';
import { formatDate } from '@/lib/date';
import { countWords } from '@/lib/markdown';
import { TagInput } from '@/features/spark/components/tag-input';
import { TagRepository } from '@/database/repositories/tag-repository';
import { useDatabase } from '@/database/database-context';
import { useEffect, useState } from 'react';

interface MetadataPanelProps {
  idea: IIdea;
  editorContent: string;
}

export function MetadataPanel({
  idea,
  editorContent,
}: MetadataPanelProps): React.ReactElement {
  const { db, manager } = useDatabase();
  const [tags, setTags] = useState<ITag[]>([]);

  useEffect(() => {
    const repo = new TagRepository(db);
    setTags(repo.getForIdea(idea.id));
  }, [db, idea.id]);

  const handleTagsChange = (newTags: ITag[]): void => {
    const repo = new TagRepository(db);

    // Remove tags that were deselected
    for (const oldTag of tags) {
      if (!newTags.some((t) => t.id === oldTag.id)) {
        repo.removeFromIdea(idea.id, oldTag.id);
      }
    }

    // Add tags that were selected
    for (const newTag of newTags) {
      if (!tags.some((t) => t.id === newTag.id)) {
        repo.addToIdea(idea.id, newTag.id);
      }
    }

    void manager.persist();
    setTags(newTags);
  };

  const words = countWords(editorContent);
  const chars = editorContent.length;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-steel-500">
          Details
        </h3>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-steel-400">Created</dt>
            <dd className="text-steel-200">{formatDate(idea.created_at)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-steel-400">Updated</dt>
            <dd className="text-steel-200">{formatDate(idea.updated_at)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-steel-400">Words</dt>
            <dd className="text-steel-200">{words}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-steel-400">Characters</dt>
            <dd className="text-steel-200">{chars}</dd>
          </div>
        </dl>
      </div>

      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-steel-500">
          Tags
        </h3>
        <TagInput selectedTags={tags} onTagsChange={handleTagsChange} />
      </div>
    </div>
  );
}
