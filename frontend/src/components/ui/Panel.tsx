import React from 'react';
import { twMerge } from 'tailwind-merge';

interface PanelProps {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  flush?: boolean;
}

export function Panel({ title, description, actions, children, className, bodyClassName, flush = false }: PanelProps) {
  return (
    <section className={twMerge('overflow-hidden rounded-2xl border border-white/80 bg-white shadow-card ring-1 ring-line/70', className)}>
      {(title || actions) &&
      <header className="flex items-start justify-between gap-3 border-b border-line/80 bg-gradient-to-r from-white to-brand-50/30 px-5 py-4">
          <div className="min-w-0">
            {title && <h2 className="font-display text-[15px] font-bold text-navy">{title}</h2>}
            {description && <p className="mt-0.5 text-xs text-muted">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </header>
      }
      <div className={twMerge(flush ? '' : 'p-5', bodyClassName)}>{children}</div>
    </section>);

}
