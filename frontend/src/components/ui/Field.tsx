import React from 'react';
import { AlertCircleIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface FieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}

export function inputClass(invalid?: boolean, extra?: string): string {
  return twMerge(
    'h-11 w-full rounded-xl border bg-white/90 px-3.5 text-sm text-ink shadow-sm placeholder:text-[#93A0B3] transition-[border-color,box-shadow,background-color] duration-200 focus:bg-white focus:outline-none focus:ring-[4px] disabled:bg-canvas disabled:text-muted',
    invalid ? 'border-danger focus:ring-danger/15' : 'border-line hover:border-brand-200 focus:border-brand focus:ring-brand/10',
    extra
  );
}

export function Field({ label, htmlFor, required, hint, error, className, children }: FieldProps) {
  return (
    <div className={twMerge('flex flex-col gap-1.5', className)}>
      <label htmlFor={htmlFor} className="text-[13px] font-medium text-ink">
        {label}{required && <span className="ml-0.5 text-danger" aria-hidden>*</span>}
      </label>
      {children}
      {error ?
      <p className="flex items-center gap-1 text-xs text-danger-700" role="alert">
          <AlertCircleIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {error}
        </p> :
      hint ?
      <p className="text-xs text-muted">{hint}</p> :
      null}
    </div>);

}
