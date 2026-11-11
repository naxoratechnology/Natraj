import React from 'react';
import { InfoIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export function DemoNotice({ children, className, tone = 'neutral' }: {children: React.ReactNode;className?: string;tone?: 'neutral' | 'warning' | 'info';}) {
  const tones = {
    neutral: 'border-line bg-white text-muted',
    warning: 'border-warning/25 bg-warning-50 text-warning-700',
    info: 'border-brand-100 bg-brand-50 text-brand-700'
  };
  return (
    <div className={twMerge('flex items-start gap-2 rounded-lg border px-3 py-2.5 text-xs leading-relaxed', tones[tone], className)}>
      <InfoIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
      <div>{children}</div>
    </div>);

}