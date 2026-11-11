import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon } from 'lucide-react';

interface PageHeaderProps {
  breadcrumbs?: {label: string;to?: string;}[];
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  meta?: React.ReactNode;
}

export function PageHeader({ breadcrumbs, title, description, actions, meta }: PageHeaderProps) {
  return (
    <div className="mb-6">
      {breadcrumbs && breadcrumbs.length > 0 &&
      <nav aria-label="Breadcrumb" className="mb-2">
          <ol className="flex flex-wrap items-center gap-1 text-xs text-muted">
            {breadcrumbs.map((b, i) =>
          <li key={b.label} className="flex items-center gap-1">
                {b.to ?
            <Link to={b.to} className="hover:text-ink">
                    {b.label}
                  </Link> :

            <span className="text-ink" aria-current="page">
                    {b.label}
                  </span>
            }
                {i < breadcrumbs.length - 1 && <ChevronRightIcon className="h-3 w-3" aria-hidden />}
              </li>
          )}
          </ol>
        </nav>
      }
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-2xl font-bold tracking-tight text-ink">{title}</h1>
            {meta}
          </div>
          {description && <p className="mt-1 text-sm text-muted">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
      </div>
    </div>);

}