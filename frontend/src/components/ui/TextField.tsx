import React, { useId, useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Field, inputClass } from './Field';

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  hint?: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  maxLength?: number;
  autoComplete?: string;
  prefix?: string;
  disabled?: boolean;
  className?: string;
  uppercase?: boolean;
  showPasswordToggle?: boolean;
}

export function TextField({
  label,
  value,
  onChange,
  error,
  hint,
  required,
  type = 'text',
  placeholder,
  inputMode,
  maxLength,
  autoComplete,
  prefix,
  disabled,
  className,
  uppercase,
  showPasswordToggle = false
}: TextFieldProps) {
  const id = useId();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const hasPasswordToggle = type === 'password' && showPasswordToggle;
  return (
    <Field label={label} htmlFor={id} required={required} error={error} hint={hint} className={className}>
      <div className="relative">
        {prefix && <span className="pointer-events-none absolute inset-y-px left-px z-10 flex w-12 items-center justify-center rounded-l-[11px] border-r border-line bg-canvas text-sm font-medium text-ink">{prefix}</span>}
        <input
          id={id}
          type={hasPasswordToggle && passwordVisible ? 'text' : type}
          value={value}
          onChange={(e) => onChange(uppercase ? e.target.value.toUpperCase() : e.target.value)}
          placeholder={placeholder}
          inputMode={inputMode}
          maxLength={maxLength}
          autoComplete={autoComplete}
          disabled={disabled}
          aria-invalid={!!error}
          aria-required={required}
          className={inputClass(!!error, `${prefix ? 'pl-16' : ''} ${hasPasswordToggle ? 'pr-11' : ''} ${uppercase ? 'uppercase tracking-wide' : ''}`)} />
        {hasPasswordToggle &&
        <button
          type="button"
          onClick={() => setPasswordVisible((visible) => !visible)}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted transition-colors hover:bg-canvas hover:text-ink focus:outline-none focus:ring-2 focus:ring-brand/20"
          aria-label={passwordVisible ? 'Hide password' : 'Show password'}
          aria-pressed={passwordVisible}>
          {passwordVisible ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
        </button>}
        
      </div>
    </Field>);

}
