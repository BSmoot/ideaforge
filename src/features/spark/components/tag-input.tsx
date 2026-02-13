import { useState, useRef, type KeyboardEvent } from 'react';
import type { ITag } from '@/types';
import { Badge } from '@/components/ui';
import { Input } from '@/components/ui';
import { TagRepository } from '@/database/repositories/tag-repository';
import { TagSchema } from '@/lib/validation';
import { useDatabase } from '@/database/database-context';
import { useTagAutocomplete } from '../hooks/use-tag-autocomplete';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface TagInputProps {
  selectedTags: ITag[];
  onTagsChange: (tags: ITag[]) => void;
  maxTags?: number;
  className?: string;
}

export function TagInput({
  selectedTags,
  onTagsChange,
  maxTags = 10,
  className,
}: TagInputProps): React.ReactElement {
  const { db } = useDatabase();
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { suggestions, isOpen, search, close } = useTagAutocomplete();

  const addTag = (tag: ITag): void => {
    if (selectedTags.length >= maxTags) return;
    if (selectedTags.some((t) => t.id === tag.id)) return;
    onTagsChange([...selectedTags, tag]);
    setInputValue('');
    close();
    inputRef.current?.focus();
  };

  const removeTag = (tagId: string): void => {
    onTagsChange(selectedTags.filter((t) => t.id !== tagId));
  };

  const handleInputChange = (value: string): void => {
    setInputValue(value);
    search(value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const trimmed = inputValue.trim().toLowerCase();
      const validation = TagSchema.safeParse({ name: trimmed });
      if (!validation.success) return;

      const repo = new TagRepository(db);
      const existing = repo.getByName(trimmed);
      if (existing) {
        addTag(existing);
      } else {
        const newTag = repo.create(trimmed);
        addTag(newTag);
      }
    }

    if (e.key === 'Backspace' && inputValue === '' && selectedTags.length > 0) {
      const lastTag = selectedTags[selectedTags.length - 1];
      if (lastTag) {
        removeTag(lastTag.id);
      }
    }

    if (e.key === 'Escape') {
      close();
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {/* Selected tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedTags.map((tag) => (
            <Badge key={tag.id} variant="info" size="sm">
              {tag.name}
              <button
                type="button"
                onClick={() => { removeTag(tag.id); }}
                className="ml-1 rounded-full hover:text-white"
                aria-label={`Remove tag ${tag.name}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Input with autocomplete */}
      <div className="relative">
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => { handleInputChange(e.target.value); }}
          onKeyDown={handleKeyDown}
          onBlur={() => { setTimeout(close, 200); }}
          placeholder={
            selectedTags.length >= maxTags
              ? 'Max tags reached'
              : 'Add tags...'
          }
          disabled={selectedTags.length >= maxTags}
        />

        {/* Suggestions dropdown */}
        {isOpen && suggestions.length > 0 && (
          <div className="absolute top-full left-0 z-10 mt-1 w-full rounded-md border border-steel-700 bg-steel-800 py-1 shadow-lg">
            {suggestions
              .filter((s) => !selectedTags.some((t) => t.id === s.id))
              .map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  className="w-full px-3 py-1.5 text-left text-sm text-steel-200 hover:bg-steel-700"
                  onClick={() => { addTag(tag); }}
                >
                  {tag.name}
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
