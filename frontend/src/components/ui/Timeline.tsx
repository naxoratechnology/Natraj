import React from 'react';
import { AlertTriangleIcon, CheckIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { formatDateTime } from '../../utils/format';
import type { TimelineEvent } from '../../types/finance';

export function Timeline({ events, compact = false }: {events: TimelineEvent[];compact?: boolean;}) {
  return (
    <ol className="relative">
      {events.map((e, i) => {
        const last = i === events.length - 1;
        return (
          <li key={`${e.label}-${i}`} className={twMerge('relative flex gap-3', !last && (compact ? 'pb-4' : 'pb-6'))}>
            {!last &&
            <span
              className={twMerge('absolute left-[11px] top-6 bottom-0 w-px', e.state === 'done' ? 'bg-brand-200' : 'bg-line')}
              aria-hidden />

            }
            <span
              className={twMerge(
                'relative z-10 mt-0.5 flex h-[23px] w-[23px] shrink-0 items-center justify-center rounded-full border',
                e.state === 'done' && 'border-brand bg-brand text-white',
                e.state === 'current' && 'border-brand bg-white',
                e.state === 'alert' && 'border-warning bg-warning-50 text-warning-700',
                e.state === 'upcoming' && 'border-dashed border-[#C8D2DF] bg-white'
              )}>
              
              {e.state === 'done' && <CheckIcon className="h-3 w-3" strokeWidth={3} />}
              {e.state === 'current' && <span className="h-2 w-2 rounded-full bg-brand" />}
              {e.state === 'alert' && <AlertTriangleIcon className="h-3 w-3" />}
            </span>
            <div className="min-w-0 flex-1">
              <p className={twMerge('text-sm font-medium', e.state === 'upcoming' ? 'text-muted' : 'text-ink')}>{e.label}</p>
              {(e.date || e.actor) &&
              <p className="mt-0.5 text-xs text-muted">
                  {e.date && formatDateTime(e.date)}
                  {e.date && e.actor && ' · '}
                  {e.actor}
                </p>
              }
              {e.note && !compact && <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{e.note}</p>}
            </div>
          </li>);

      })}
    </ol>);

}