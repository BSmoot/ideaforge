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
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-steel-500" />
        <input
          ref={ref}
          type="text"
          className="w-full rounded-lg border border-steel-700 bg-steel-800 py-3 pl-11 pr-4 text-lg text-steel-100 placeholder:text-steel-500 focus:border-forge-500 focus:outline-none focus:ring-2 focus:ring-forge-500/20"
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
