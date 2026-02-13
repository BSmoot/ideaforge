import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const textareaVariants = cva(
  'flex min-h-[80px] w-full rounded-md border bg-steel-800 px-3 py-2 text-sm text-steel-100 placeholder:text-steel-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forge-500 focus-visible:ring-offset-2 focus-visible:ring-offset-steel-950 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      state: {
        default: 'border-steel-700',
        error: 'border-red-500 focus-visible:ring-red-500',
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
