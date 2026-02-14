import { type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full font-medium transition-colors',
  {
    variants: {
      variant: {
        spark: 'bg-status-warning-bg text-status-warning border border-status-warning/30',
        developing: 'bg-status-info-bg text-status-info border border-status-info/30',
        refined: 'bg-status-success-bg text-status-success border border-status-success/30',
        parked: 'bg-background-muted text-foreground-tertiary border border-border',
        archived: 'bg-background-muted text-foreground-disabled border border-border-subtle',
        success: 'bg-status-success-bg text-status-success border border-status-success/30',
        warning: 'bg-status-warning-bg text-status-warning border border-status-warning/30',
        destructive: 'bg-status-error-bg text-status-error border border-status-error/30',
        info: 'bg-status-info-bg text-status-info border border-status-info/30',
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
