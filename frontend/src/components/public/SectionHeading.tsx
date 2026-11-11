import React from 'react';
import { twMerge } from 'tailwind-merge';

interface SectionHeadingProps {
  title: string;
  description?: string;
  align?: 'left' | 'center';
  tone?: 'dark' | 'light';
  className?: string;
}

export function SectionHeading({ title, description, align = 'left', tone = 'dark', className }: SectionHeadingProps) {
  return (
    <div className={twMerge(align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl', className)}>
      <h2
        className={twMerge(
          'font-display text-3xl font-extrabold tracking-tight sm:text-[40px] sm:leading-[1.1]',
          tone === 'dark' ? 'text-navy' : 'text-white'
        )}>
        
        {title}
      </h2>
      {description &&
      <p className={twMerge('mt-4 text-base leading-relaxed sm:text-lg', tone === 'dark' ? 'text-muted' : 'text-[#B4C1D4]')}>{description}</p>
      }
    </div>);

}