import React from 'react';
import { twMerge } from 'tailwind-merge';

export function Skeleton({ className }: {className?: string;}) {
  return <div className={twMerge('animate-pulse rounded-md bg-[#EDF1F6]', className)} aria-hidden />;
}