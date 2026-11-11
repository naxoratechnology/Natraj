import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface MultiFilterProps {
  label: string;
  options: string[];
  value: string[];
  onChange: (v: string[]) => void;
  counts?: Record<string, number>;
}

/** Checkbox multi-select filter with selection count and clear action. */
export function MultiFilter({ label, options, value, onChange, counts }: MultiFilterProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const toggle = (o: string) => onChange(value.includes(o) ? value.filter((x) => x !== o) : [...value, o]);
  const active = value.length > 0;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={twMerge(
          'flex h-9 items-center gap-2 whitespace-nowrap rounded-lg border bg-white pl-3 pr-2.5 text-[13px] transition-colors duration-150 focus:outline-none focus:ring-[3px] focus:ring-brand/15',
          active ? 'border-brand-200 bg-brand-50 font-medium text-brand-700' : 'border-line text-ink hover:border-[#CED7E3]'
        )}>
        
        {label}
        {active ?
        <span className="num flex h-5 min-w-[20px] items-center justify-center rounded bg-brand px-1 text-[11px] font-semibold text-white">{value.length}</span> :

        <span className="text-muted">All</span>
        }
        <ChevronDownIcon className={twMerge('h-3.5 w-3.5 text-muted transition-transform duration-150', open && 'rotate-180')} aria-hidden />
      </button>
      <AnimatePresence>
        {open &&
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -4 }}
          transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
          className="absolute left-0 z-50 mt-1.5 w-64 origin-top-left overflow-hidden rounded-lg border border-line bg-white shadow-pop">
          
            <ul role="listbox" aria-multiselectable aria-label={label} className="max-h-72 overflow-y-auto py-1">
              {options.map((o) => {
              const on = value.includes(o);
              return (
                <li key={o} role="option" aria-selected={on}>
                    <button type="button" onClick={() => toggle(o)} className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[13px] text-ink transition-colors duration-100 hover:bg-canvas">
                      <span className={twMerge('flex h-4 w-4 shrink-0 items-center justify-center rounded border', on ? 'border-brand bg-brand text-white' : 'border-[#C5CFDC] bg-white')}>
                        {on && <CheckIcon className="h-3 w-3" strokeWidth={3} />}
                      </span>
                      <span className="flex-1 truncate">{o}</span>
                      {counts && <span className="num text-xs text-muted">{counts[o] ?? 0}</span>}
                    </button>
                  </li>);

            })}
            </ul>
            <div className="flex items-center justify-between border-t border-line px-3 py-2">
              <button type="button" onClick={() => onChange([])} disabled={!active} className="text-[13px] font-medium text-brand hover:underline disabled:text-muted disabled:no-underline">
                Clear all
              </button>
              <button type="button" onClick={() => setOpen(false)} className="text-[13px] font-medium text-ink hover:text-brand">
                Done
              </button>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}