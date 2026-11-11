import React from 'react';
import { AlertOctagonIcon, RotateCwIcon } from 'lucide-react';
import { Button } from './Button';

export function ErrorState({ title = 'Something went wrong', message, onRetry }: {title?: string;message: string;onRetry?: () => void;}) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center" role="alert">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-danger-50 text-danger">
        <AlertOctagonIcon className="h-5 w-5" />
      </span>
      <h3 className="mt-4 text-sm font-semibold text-ink">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted">{message}</p>
      {onRetry &&
      <Button variant="secondary" size="sm" className="mt-5" icon={<RotateCwIcon className="h-3.5 w-3.5" />} onClick={onRetry}>
          Try again
        </Button>
      }
    </div>);

}