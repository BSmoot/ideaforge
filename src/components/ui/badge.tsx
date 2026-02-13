import { type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full font-medium transition-colors',
  {
    variants: {
      variant: {
        spark: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
        developing: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
        refined: 'bg-green-500/20 text-green-400 border border-green-500/30',
        parked: 'bg-steel-500/20 text-steel-400 border border-steel-500/30',
        archived: 'bg-steel-600/20 text-steel-500 border border-steel-600/30',
        success: 'bg-green-500/20 text-green-400 border border-green-500/30',
        warning: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
        destructive: 'bg-red-500/20 text-red-400 border border-red-500/30',
        info: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'spark',
      size: 'sm',
    },
  }
);

export type BadgeVariants = VariantProps<typeof badgeVariants>;

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    BadgeVariants {}

export function Badge({
  className,
  variant,
  size,
  ...props
}: BadgeProps): React.ReactElement {
  return (
    <span
      className={cn(badgeVariants({ variant, size, className }))}
      {...props}
    />
  );
}
