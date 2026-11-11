import React from 'react';
import { CheckIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface StepperProps {
  steps: string[];
  current: number;
  onStepClick?: (index: number) => void;
}

export function Stepper({ steps, current, onStepClick }: StepperProps) {
  return (
    <nav aria-label="Progress">
      <p className="mb-3 flex items-center justify-between gap-3 text-xs font-medium text-muted md:hidden">
        <span className="text-ink">{steps[current]}</span> · Step {current + 1} of {steps.length}
      </p>
      <ol className="flex items-center gap-1 md:gap-0">
        {steps.map((label, i) => {
          const done = i < current;
          const active = i === current;
          const clickable = !!onStepClick && i < current;
          return (
            <li key={label} className="flex flex-1 items-center last:flex-none md:last:flex-1">
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onStepClick?.(i)}
                className={twMerge('group flex min-w-0 items-center gap-2.5', clickable ? 'cursor-pointer' : 'cursor-default')}
                aria-current={active ? 'step' : undefined}>
                
                <span
                  className={twMerge(
                    'num flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors duration-200',
                    done && 'border-brand bg-brand text-white',
                    active && 'border-brand bg-white text-brand ring-4 ring-brand-50',
                    !done && !active && 'border-line bg-white text-muted'
                  )}>
                  
                  {done ? <CheckIcon className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
                </span>
                <span
                  className={twMerge(
                    'hidden truncate text-[13px] font-medium md:block',
                    active ? 'text-ink' : done ? 'text-ink group-hover:text-brand' : 'text-muted'
                  )}>
                  
                  {label}
                </span>
              </button>
              {i < steps.length - 1 &&
              <span className={twMerge('mx-1 h-px flex-1 sm:mx-2 md:mx-3', i < current ? 'bg-brand' : 'bg-line')} aria-hidden />
              }
            </li>);

        })}
      </ol>
    </nav>);

}
