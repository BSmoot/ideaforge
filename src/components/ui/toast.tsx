import { forwardRef, type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const toastVariants = cva(
  'pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-lg border p-4 shadow-lg transition-all',
  {
    variants: {
      variant: {
        success: 'border-status-success/30 bg-status-success-bg text-status-success',
        error: 'border-status-error/30 bg-status-error-bg text-status-error',
        info: 'border-status-info/30 bg-status-info-bg text-status-info',
        warning: 'border-status-warning/30 bg-status-warning-bg text-status-warning',
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
