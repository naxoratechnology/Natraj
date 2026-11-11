import React from 'react';
import { twMerge } from 'tailwind-merge';

interface TabItem {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: TabItem[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, value, onChange, className }: TabsProps) {
  return (
    <div className={twMerge('no-scrollbar -mb-px flex gap-1 overflow-x-auto border-b border-line', className)} role="tablist">
      {tabs.map((t) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.id)}
            className={twMerge(
              'relative flex shrink-0 items-center gap-2 whitespace-nowrap px-3 pb-3 pt-2 text-sm font-medium transition-colors duration-150',
              active ? 'text-brand' : 'text-muted hover:text-ink'
            )}>
            
            {t.label}
            {t.count !== undefined &&
            <span
              className={twMerge(
                'num rounded px-1.5 py-0.5 text-[11px] font-semibold',
                active ? 'bg-brand-50 text-brand-700' : 'bg-[#EEF1F6] text-muted'
              )}>
              
                {t.count}
              </span>
            }
            <span className={twMerge('absolute inset-x-2 bottom-0 h-0.5 rounded-full', active ? 'bg-brand' : 'bg-transparent')} />
          </button>);

      })}
    </div>);

}