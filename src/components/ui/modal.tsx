import { type ReactNode } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const modalContentVariants = cva(
  'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 rounded-lg border border-steel-700 bg-steel-900 shadow-xl focus:outline-none',
  {
    variants: {
      size: {
        sm: 'w-full max-w-sm p-4',
        md: 'w-full max-w-md p-6',
        lg: 'w-full max-w-lg p-6',
        full: 'h-[90vh] w-[90vw] p-6',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export type ModalSizeVariants = VariantProps<typeof modalContentVariants>;

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  size?: ModalSizeVariants['size'];
  className?: string;
}

export function Modal({
  open,
  onOpenChange,
  children,
  size,
  className,
}: ModalProps): React.ReactElement {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
        <Dialog.Content
          className={cn(modalContentVariants({ size }), className)}
        >
          {children}
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
      <Dialog.Title className="text-lg font-semibold text-steel-100">
        {children}
      </Dialog.Title>
      {onClose && (
        <Dialog.Close asChild>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-steel-400 hover:bg-steel-800 hover:text-steel-200"
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
  return <div className={cn('text-steel-300', className)}>{children}</div>;
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
