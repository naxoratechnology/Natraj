import React from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { inputClass } from './Field';

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
  options: {value: string;label: string;}[] | string[];
  placeholder?: string;
}

export function SelectInput({ invalid, options, placeholder, className, ...rest }: SelectInputProps) {
  const normalized = options.map((o) => typeof o === 'string' ? { value: o, label: o } : o);
  return (
    <div className="relative">
      <select className={inputClass(invalid, `appearance-none pr-9 cursor-pointer ${className ?? ''}`)} {...rest}>
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {normalized.map((o) =>
        <option key={o.value} value={o.value}>
            {o.label}
          </option>
        )}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
    </div>);

}