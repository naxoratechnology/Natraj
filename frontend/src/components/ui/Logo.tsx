import React from 'react';
import { twMerge } from 'tailwind-merge';

export function Logo({ variant = 'dark', className, compact = false }: {variant?: 'dark' | 'light';className?: string;compact?: boolean;}) {
  return (
    <span className={twMerge('inline-flex shrink-0 items-center', variant === 'light' && 'rounded-md bg-white px-1.5 py-1', className)}>
      <img
        src={compact ? '/icon-logo.png' : '/logo-rectangle.png'}
        alt="Natraj Mobile & Electronics"
        className={compact ? 'h-8 w-8 rounded object-cover' : 'h-10 w-auto max-w-[190px] object-contain'} />
    </span>);

}
