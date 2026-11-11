import React from 'react';
import { twMerge } from 'tailwind-merge';
import { statusTone, type Tone } from '../../utils/status';

const tones: Record<Tone, {pill: string;dot: string;}> = {
  neutral: { pill: 'bg-[#EEF1F6] text-[#4A586E]', dot: 'bg-[#8B98AB]' },
  info: { pill: 'bg-brand-50 text-brand-700', dot: 'bg-brand' },
  warning: { pill: 'bg-warning-50 text-warning-700', dot: 'bg-warning' },
  success: { pill: 'bg-success-50 text-success-700', dot: 'bg-success' },
  danger: { pill: 'bg-danger-50 text-danger-700', dot: 'bg-danger' },
  teal: { pill: 'bg-teal-50 text-teal-700', dot: 'bg-teal' }
};

export function StatusBadge({ status, className, size = 'md' }: {status: string;className?: string;size?: 'sm' | 'md';}) {
  const t = tones[statusTone(status)];
  return (
    <span
      className={twMerge(
        'inline-flex items-center gap-1.5 rounded-md font-medium whitespace-nowrap',
        size === 'sm' ? 'px-1.5 py-0.5 text-[11px]' : 'px-2 py-1 text-xs',
        t.pill,
        className
      )}>
      
      <span className={twMerge('h-1.5 w-1.5 rounded-full', t.dot)} aria-hidden />
      {status}
    </span>);

}