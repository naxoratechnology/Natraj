import React from 'react';
import { Loader2Icon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'subtle' | 'navy';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
}

const variants: Record<Variant, string> = {
  primary: 'bg-gradient-to-r from-brand to-brand-600 text-white hover:from-brand-600 hover:to-brand-700 shadow-[0_8px_20px_-10px_rgba(8,117,245,0.8)]',
  secondary: 'bg-white/90 text-ink border border-line shadow-sm hover:bg-white hover:border-brand-200 hover:text-brand-700',
  ghost: 'text-muted hover:text-ink hover:bg-canvas',
  danger: 'bg-danger text-white hover:bg-danger-700 shadow-sm',
  subtle: 'bg-brand-50 text-brand-700 hover:bg-brand-100',
  navy: 'bg-gradient-to-r from-navy to-navy-700 text-white hover:from-navy-700 hover:to-navy-600 shadow-sm'
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-[13px] gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-[15px] gap-2'
};

export function buttonClasses(variant: Variant = 'primary', size: Size = 'md', extra?: string): string {
  return twMerge(
    'inline-flex items-center justify-center rounded-xl font-semibold whitespace-nowrap select-none transition-[background-color,border-color,color,transform,box-shadow] duration-200 ease-out hover:-translate-y-px active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/35 focus-visible:ring-offset-2 disabled:translate-y-0 disabled:opacity-50 disabled:pointer-events-none',
    variants[variant],
    sizes[size],
    extra
  );
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className,
  children,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={buttonClasses(variant, size, className)} disabled={disabled || loading} aria-busy={loading} {...rest}>
      {loading ? <Loader2Icon className="h-4 w-4 animate-spin" aria-hidden /> : icon}
      {children}
    </button>);

}
