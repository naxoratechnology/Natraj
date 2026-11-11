import React from 'react';
import { AlertTriangleIcon, CheckIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { formatDate } from '../../utils/format';
import type { TimelineEvent } from '../../types/finance';

interface ProgressTrackProps {
  events: TimelineEvent[];
  compact?: boolean;
  className?: string;
}

/** Horizontal stage tracker for recorded application events. */
export function ProgressTrack({ events, compact = false, className }: ProgressTrackProps) {
  return (
    <div className={twMerge('overflow-x-auto', className)}>
      <ol className={twMerge('flex', compact ? 'min-w-[520px]' : 'min-w-[720px]')} aria-label="Application progress">
        {events.map((e, i) => {
          const done = e.state === 'done';
          const current = e.state === 'current';
          const alert = e.state === 'alert';
          const nextDone = events[i + 1] && events[i + 1].state !== 'upcoming';
          return (
            <li key={`${e.label}-${i}`} className="relative flex flex-1 flex-col items-center text-center" aria-current={current || alert ? 'step' : undefined}>
              {i < events.length - 1 &&
              <span
                aria-hidden
                className={twMerge('absolute left-1/2 h-0.5 w-full', compact ? 'top-[11px]' : 'top-[15px]', nextDone ? 'bg-navy' : 'bg-line')} />

              }
              <span
                className={twMerge(
                  'relative z-10 flex shrink-0 items-center justify-center rounded-full border-2',
                  compact ? 'h-6 w-6' : 'h-8 w-8',
                  done && 'border-navy bg-navy text-white',
                  current && 'border-brand bg-white text-brand',
                  alert && 'border-warning bg-warning-50 text-warning-700',
                  e.state === 'upcoming' && 'border-line bg-white text-[#A5B1C2]'
                )}>
                
                {done ?
                <CheckIcon className={compact ? 'h-3 w-3' : 'h-4 w-4'} strokeWidth={3} /> :
                alert ?
                <AlertTriangleIcon className={compact ? 'h-3 w-3' : 'h-3.5 w-3.5'} /> :

                <span className={twMerge('rounded-full', compact ? 'h-1.5 w-1.5' : 'h-2 w-2', current ? 'bg-brand' : 'bg-line')} />
                }
              </span>
              <span
                className={twMerge(
                  'mt-2 px-1 font-medium leading-tight',
                  compact ? 'text-[10.5px]' : 'text-[12px]',
                  e.state === 'upcoming' ? 'text-muted' : alert ? 'text-warning-700' : 'text-ink'
                )}>
                
                {e.label}
              </span>
              {!compact && <span className="num mt-0.5 text-[11px] text-muted">{e.date ? formatDate(e.date) : 'Pending'}</span>}
            </li>);

        })}
      </ol>
    </div>);

}