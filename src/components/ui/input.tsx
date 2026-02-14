import { forwardRef, type InputHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const inputVariants = cva(
  'flex w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-tertiary transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
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

export type InputVariants = VariantProps<typeof inputVariants>;

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    InputVariants {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ className, state, type, ...props }, ref) {
    return (
      <input
        type={type}
        className={cn(inputVariants({ state, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
