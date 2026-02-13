import { forwardRef, type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const toastVariants = cva(
  'pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-lg border p-4 shadow-lg transition-all',
  {
    variants: {
      variant: {
        success: 'border-green-500/30 bg-green-500/10 text-green-400',
        error: 'border-red-500/30 bg-red-500/10 text-red-400',
        info: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
        warning: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
);

export type ToastVariants = VariantProps<typeof toastVariants>;

interface ToastProps extends HTMLAttributes<HTMLDivElement>, ToastVariants {
  onClose?: () => void;
}

export const Toast = forwardRef<HTMLDivElement, ToastProps>(
  function Toast({ className, variant, onClose, children, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(toastVariants({ variant, className }))}
        role="alert"
        {...props}
      >
        <div className="flex-1 text-sm">{children}</div>
        {onClose && (
          <button
            onClick={onClose}
            className="shrink-0 rounded p-0.5 opacity-70 hover:opacity-100"
            type="button"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);
