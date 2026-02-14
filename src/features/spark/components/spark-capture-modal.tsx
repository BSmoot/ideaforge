import { useEffect, useRef } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/modal';
import { Button, Input, Textarea } from '@/components/ui';
import { TagInput } from './tag-input';
import { useSparkCapture } from '../hooks/use-spark-capture';

interface SparkCaptureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SparkCaptureModal({
  open,
  onOpenChange,
}: SparkCaptureModalProps): React.ReactElement {
  const {
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
  } = useSparkCapture();
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      reset();
      setTimeout(() => {
        titleRef.current?.focus();
      }, 100);
    }
  }, [open, reset]);

  const handleSubmit = async (): Promise<void> => {
    const success = await submit();
    if (success) {
      onOpenChange(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      void handleSubmit();
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange} size="lg">
      <div onKeyDown={handleKeyDown}>
        <ModalHeader onClose={() => { onOpenChange(false); }}>
          Capture a Spark
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="spark-title"
                className="mb-1 block text-sm font-medium text-foreground-secondary"
              >
                Title <span className="text-red-400">*</span>
              </label>
              <Input
                ref={titleRef}
                id="spark-title"
                value={title}
                onChange={(e) => { setTitle(e.target.value); }}
                placeholder="What's your idea?"
                state={errors.title ? 'error' : 'default'}
                maxLength={200}
              />
              {errors.title && (
                <p className="mt-1 text-xs text-red-400">{errors.title}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="spark-content"
                className="mb-1 block text-sm font-medium text-foreground-secondary"
              >
                Description
              </label>
              <Textarea
                id="spark-content"
                value={content}
                onChange={(e) => { setContent(e.target.value); }}
                placeholder="Add some details (optional)..."
                rows={3}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground-secondary">
                Tags
              </label>
              <TagInput selectedTags={tags} onTagsChange={setTags} />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="ghost"
            onClick={() => { onOpenChange(false); }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="accent"
            onClick={() => { void handleSubmit(); }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Capture Spark'}
          </Button>
        </ModalFooter>
      </div>
    </Modal>
  );
}
