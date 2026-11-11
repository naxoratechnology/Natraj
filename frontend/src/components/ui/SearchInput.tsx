import React from 'react';
import { SearchIcon, XIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface SearchInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({ value, onChange, placeholder = 'Search', className }: SearchInputProps) {
  return (
    <div className={twMerge('relative', className)}>
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-9 w-full rounded-lg border border-line bg-white pl-9 pr-8 text-sm text-ink placeholder:text-[#93A0B3] transition-[border-color,box-shadow] duration-150 focus:border-brand focus:outline-none focus:ring-[3px] focus:ring-brand/15 [&::-webkit-search-cancel-button]:hidden" />
      
      {value &&
      <button onClick={() => onChange('')} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted hover:text-ink" aria-label="Clear search">
          <XIcon className="h-3.5 w-3.5" />
        </button>
      }
    </div>);

}