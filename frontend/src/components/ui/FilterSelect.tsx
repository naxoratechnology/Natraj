import React from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  allLabel?: string;
}

export function FilterSelect({ label, value, onChange, options, allLabel = 'All' }: FilterSelectProps) {
  const active = value !== '';
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className={twMerge(
          'h-9 cursor-pointer appearance-none rounded-lg border bg-white pl-3 pr-8 text-[13px] transition-colors duration-150 focus:outline-none focus:ring-[3px] focus:ring-brand/15',
          active ? 'border-brand-200 bg-brand-50 font-medium text-brand-700' : 'border-line text-ink hover:border-[#CED7E3]'
        )}>
        
        <option value="">
          {label}: {allLabel}
        </option>
        {options.map((o) =>
        <option key={o} value={o}>
            {label}: {o}
          </option>
        )}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" aria-hidden />
    </div>);

}