import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forge-500 focus-visible:ring-offset-2 focus-visible:ring-offset-steel-950 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-forge-500 text-white hover:bg-forge-600 active:bg-forge-700',
        secondary:
          'bg-steel-700 text-steel-100 hover:bg-steel-600 active:bg-steel-500',
        outline:
          'border border-steel-600 bg-transparent text-steel-200 hover:bg-steel-800 active:bg-steel-700',
        ghost:
          'bg-transparent text-steel-300 hover:bg-steel-800 hover:text-steel-100',
        destructive:
          'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
        forge:
          'bg-gradient-to-r from-forge-500 to-ember-500 text-white hover:from-forge-600 hover:to-ember-600',
        link: 'text-forge-400 underline-offset-4 hover:underline bg-transparent',
      },
      size: {
        sm: 'h-8 rounded-md px-3 text-xs',
        md: 'h-10 px-4 py-2',
        lg: 'h-12 rounded-lg px-6 text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariants {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ className, variant, size, asChild = false, ...props }, ref) {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
