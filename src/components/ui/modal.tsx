import { type ReactNode } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const SIZE_CLASSES: Record<string, string> = {
  sm: 'max-w-sm p-4',
  md: 'max-w-md p-6',
  lg: 'max-w-lg p-6',
  full: 'max-w-[90vw] max-h-[90vh] p-6',
};

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
  className?: string;
}

export function Modal({
  open,
  onOpenChange,
  children,
  size = 'md',
  className,
}: ModalProps): React.ReactElement {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ pointerEvents: 'none' }}
        >
          <div
            className={cn(
              'w-[92vw] rounded-lg border border-border bg-surface shadow-xl focus:outline-none',
              SIZE_CLASSES[size],
              className
            )}
            style={{ pointerEvents: 'auto' }}
          >
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

interface ModalHeaderProps {
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}

export function ModalHeader({
  children,
  onClose,
  className,
}: ModalHeaderProps): React.ReactElement {
  return (
    <div className={cn('mb-4 flex items-center justify-between', className)}>
      <Dialog.Title className="text-lg font-semibold text-foreground">
        {children}
      </Dialog.Title>
      {onClose && (
        <Dialog.Close asChild>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-foreground-secondary hover:bg-surface-hover hover:text-foreground"
            type="button"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </Dialog.Close>
      )}
    </div>
  );
}

export function ModalBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}): React.ReactElement {
  return <div className={cn('text-foreground-secondary', className)}>{children}</div>;
}

export function ModalFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}): React.ReactElement {
  return (
    <div className={cn('mt-6 flex items-center justify-end gap-3', className)}>
      {children}
    </div>
  );
}
