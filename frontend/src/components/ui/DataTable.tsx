import React, { useEffect, useMemo, useState } from 'react';
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { Pagination } from './Pagination';
import { Skeleton } from './Skeleton';

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  sortValue?: (row: T) => string | number;
  align?: 'left' | 'right';
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  pageSize?: number;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  empty?: React.ReactNode;
  dense?: boolean;
  defaultSort?: {key: string;dir: 'asc' | 'desc';};
  minWidth?: number;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  pageSize = 10,
  onRowClick,
  loading = false,
  empty,
  dense = false,
  defaultSort,
  minWidth = 760
}: DataTableProps<T>) {
  const [sort, setSort] = useState(defaultSort ?? null);
  const [page, setPage] = useState(1);

  useEffect(() => setPage(1), [rows.length]);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.sortValue) return rows;
    return [...rows].sort((a, b) => {
      const va = col.sortValue!(a);
      const vb = col.sortValue!(b);
      const r = va < vb ? -1 : va > vb ? 1 : 0;
      return sort.dir === 'asc' ? r : -r;
    });
  }, [rows, sort, columns]);

  const paged = sorted.slice((page - 1) * pageSize, page * pageSize);
  const cellPad = dense ? 'px-4 py-2.5' : 'px-4 py-3.5';

  const toggleSort = (key: string) =>
  setSort((s) => s?.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' });

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm" style={{ minWidth }}>
          <thead>
            <tr className="border-b border-line bg-gradient-to-r from-[#F8FAFD] to-brand-50/40">
              {columns.map((c) => {
                const active = sort?.key === c.key;
                return (
                  <th
                    key={c.key}
                    scope="col"
                    className={twMerge('whitespace-nowrap px-4 py-2.5 text-xs font-medium text-muted', c.align === 'right' && 'text-right', c.className)}
                    aria-sort={active ? sort!.dir === 'asc' ? 'ascending' : 'descending' : undefined}>
                    
                    {c.sortValue ?
                    <button
                      onClick={() => toggleSort(c.key)}
                      className={twMerge('inline-flex items-center gap-1 transition-colors duration-150 hover:text-ink', active && 'text-ink')}>
                      
                        {c.header}
                        {active ?
                      sort!.dir === 'asc' ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" /> :

                      <ArrowUpDownIcon className="h-3 w-3 opacity-50" />
                      }
                      </button> :

                    c.header
                    }
                  </th>);

              })}
            </tr>
          </thead>
          <tbody>
            {loading ?
            Array.from({ length: 6 }).map((_, i) =>
            <tr key={i} className="border-b border-line last:border-0">
                    {columns.map((c) =>
              <td key={c.key} className={cellPad}>
                        <Skeleton className="h-4 w-full max-w-[140px]" />
                      </td>
              )}
                  </tr>
            ) :
            paged.map((row) =>
            <tr
              key={rowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              onKeyDown={onRowClick ? (e) => e.key === 'Enter' && onRowClick(row) : undefined}
              tabIndex={onRowClick ? 0 : undefined}
              className={twMerge(
                'border-b border-line/80 last:border-0',
                onRowClick && 'cursor-pointer transition-colors duration-150 hover:bg-brand-50/55 focus-visible:bg-brand-50 focus-visible:outline-none'
              )}>
              
                    {columns.map((c) =>
              <td key={c.key} className={twMerge(cellPad, 'align-middle text-ink', c.align === 'right' && 'text-right', c.className)}>
                        {c.render(row)}
                      </td>
              )}
                  </tr>
            )}
          </tbody>
        </table>
      </div>
      {!loading && rows.length === 0 && empty}
      {!loading && rows.length > pageSize && <Pagination page={page} pageSize={pageSize} total={rows.length} onChange={setPage} />}
    </div>);

}
