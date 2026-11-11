import React from 'react';
import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

interface MetricCardProps {
  label: string;
  value: string | number;
  hint?: string;
  to?: string;
  accent?: string;
  className?: string;
}

export function MetricCard({ label, value, hint, to, accent, className }: MetricCardProps) {
  const body =
  <>
      <div className="flex items-center gap-2">
        {accent && <span className="h-2 w-2 rounded-full" style={{ background: accent }} aria-hidden />}
        <p className="text-[13px] text-muted">{label}</p>
      </div>
      <p className="num mt-2 font-display text-2xl font-bold tracking-tight text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </>;

  const cls = twMerge('block rounded-xl border border-line bg-white p-4 shadow-card', className);
  return to ?
  <Link to={to} className={twMerge(cls, 'transition-colors duration-150 hover:border-brand-200')}>
      {body}
    </Link> :

  <div className={cls}>{body}</div>;

}