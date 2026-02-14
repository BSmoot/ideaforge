import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const textareaVariants = cva(
  'flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-tertiary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      state: {
        default: 'border-border-input',
        error: 'border-status-error focus-visible:ring-status-error',
      },
    },
    defaultVariants: {
      state: 'default',
    },
  }
);

export type TextareaVariants = VariantProps<typeof textareaVariants>;

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>,
    TextareaVariants {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, state, ...props }, ref) {
    return (
      <textarea
        className={cn(textareaVariants({ state, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
