import React, { useEffect, useId, useRef, useState } from 'react';
import { CheckCircle2Icon, FileTextIcon, LockIcon, UploadCloudIcon, XIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import type { UploadedFile } from '../../types/finance';

interface FileUploaderProps {
  label: string;
  hint?: string;
  required?: boolean;
  value: UploadedFile | null;
  onChange: (file: UploadedFile | null) => void;
  error?: string;
}

const MAX_KB = 5120;

export function FileUploader({ label, hint = 'PDF, JPG or PNG · up to 5 MB', value, onChange, error }: FileUploaderProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [localError, setLocalError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (progress === null || progress >= 100) return;
    const t = window.setTimeout(() => setProgress((p) => p === null ? null : Math.min(100, p + 25)), 140);
    return () => window.clearTimeout(t);
  }, [progress]);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    const sizeKb = Math.round(file.size / 1024);
    if (!/\.(pdf|jpe?g|png)$/i.test(file.name)) {
      setLocalError('Unsupported file type. Upload a PDF, JPG or PNG.');
      return;
    }
    if (sizeKb > MAX_KB) {
      setLocalError('File is larger than 5 MB.');
      return;
    }
    setLocalError('');
    setProgress(0);
    onChange({ name: file.name, sizeKb: Math.max(sizeKb, 1), file });
  };

  const shownError = localError || error;
  const uploading = progress !== null && progress < 100;

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[13px] font-medium text-ink">
          {label}
        </span>
        <span className="flex items-center gap-1 text-[11px] text-muted">
          <LockIcon className="h-3 w-3" /> Private
        </span>
      </div>
      {value ?
      <div className="flex items-center gap-3 rounded-lg border border-line bg-white p-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand">
            <FileTextIcon className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink">{value.name}</p>
            {uploading ?
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-line">
                <div className="h-full rounded-full bg-brand transition-[width] duration-150 ease-out" style={{ width: `${progress}%` }} />
              </div> :

          <p className="mt-0.5 flex items-center gap-1 text-xs text-success-700">
                <CheckCircle2Icon className="h-3 w-3" /> Attached · {value.sizeKb} KB · uploads securely on submit
              </p>
          }
          </div>
          <button
          type="button"
          onClick={() => {
            onChange(null);
            setProgress(null);
          }}
          className="rounded-md p-1.5 text-muted hover:bg-canvas hover:text-danger"
          aria-label={`Remove ${value.name}`}>
          
            <XIcon className="h-4 w-4" />
          </button>
        </div> :

      <label
        htmlFor={id}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={twMerge(
          'flex cursor-pointer items-center gap-3 rounded-lg border border-dashed bg-white p-3 transition-colors duration-150',
          dragOver ? 'border-brand bg-brand-50' : shownError ? 'border-danger' : 'border-[#CBD5E2] hover:border-brand hover:bg-canvas'
        )}>
        
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-canvas text-muted">
            <UploadCloudIcon className="h-4 w-4" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm text-ink">
              <span className="font-medium text-brand">Choose file</span> or drag it here
            </span>
            <span className="block text-xs text-muted">{hint}</span>
          </span>
          <input
          ref={inputRef}
          id={id}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="sr-only"
          onChange={(e) => {
            handleFile(e.target.files?.[0]);
            if (inputRef.current) inputRef.current.value = '';
          }} />
        
        </label>
      }
      {shownError && <p className="mt-1.5 text-xs text-danger-700">{shownError}</p>}
    </div>);

}
