import { forwardRef, type InputHTMLAttributes } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onValueChange?: (value: string) => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput({ className, onValueChange, onChange, ...props }, ref) {
    return (
      <div className={cn('relative', className)}>
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground-tertiary" />
        <input
          ref={ref}
          type="text"
          className="w-full rounded-lg border border-border-input bg-background py-3 pl-11 pr-4 text-lg text-foreground placeholder:text-foreground-tertiary focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-border-focus/20"
          onChange={(e) => {
            onChange?.(e);
            onValueChange?.(e.target.value);
          }}
          {...props}
        />
      </div>
    );
  }
);
