import { type HTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  'rounded-lg border border-steel-800 bg-steel-900 text-steel-100',
  {
    variants: {
      variant: {
        default: '',
        interactive:
          'cursor-pointer transition-all hover:border-steel-600 hover:shadow-md active:scale-[0.99]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export type CardVariants = VariantProps<typeof cardVariants>;

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    CardVariants {}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  function Card({ className, variant, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, className }))}
        {...props}
      />
    );
  }
);

export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return <div className={cn('flex flex-col space-y-1.5 p-4', className)} {...props} />;
}

export function CardContent({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return <div className={cn('p-4 pt-0', className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>): React.ReactElement {
  return (
    <div
      className={cn('flex items-center p-4 pt-0', className)}
      {...props}
    />
  );
}
