import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, pageSize, total, onChange }: PaginationProps) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-line px-4 py-3 sm:flex-row">
      <p className="num text-xs text-muted">
        Showing <span className="font-medium text-ink">{from}–{to}</span> of <span className="font-medium text-ink">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-line text-muted transition-colors duration-150 hover:bg-canvas hover:text-ink disabled:opacity-40"
          aria-label="Previous page">
          
          <ChevronLeftIcon className="h-4 w-4" />
        </button>
        {Array.from({ length: pages }, (_, i) => i + 1).map((p) =>
        <button
          key={p}
          onClick={() => onChange(p)}
          aria-current={p === page ? 'page' : undefined}
          className={twMerge(
            'num h-8 min-w-[2rem] rounded-md px-2 text-xs font-medium transition-colors duration-150',
            p === page ? 'bg-navy text-white' : 'text-muted hover:bg-canvas hover:text-ink'
          )}>
          
            {p}
          </button>
        )}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page >= pages}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-line text-muted transition-colors duration-150 hover:bg-canvas hover:text-ink disabled:opacity-40"
          aria-label="Next page">
          
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>);

}