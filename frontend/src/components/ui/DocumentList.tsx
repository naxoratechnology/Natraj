import React, { useState } from 'react';
import { EyeIcon, FileTextIcon, LockIcon, RefreshCwIcon, UploadIcon } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { DocumentPreviewModal } from './DocumentPreviewModal';
import { formatDate } from '../../utils/format';
import type { DocumentRecord } from '../../types/finance';

interface DocumentListProps {
  documents: DocumentRecord[];
  viewer: string;
  onReupload?: (doc: DocumentRecord) => void;
}

export function DocumentList({ documents, viewer, onReupload }: DocumentListProps) {
  const [preview, setPreview] = useState<DocumentRecord | null>(null);
  return (
    <>
      <ul className="divide-y divide-line">
        {documents.map((d) => {
          const needsAction = d.uploadStatus === 'Missing' || d.verification === 'Rejected';
          return (
            <li key={d.id} className="flex flex-col gap-3 py-3.5 first:pt-0 last:pb-0 sm:flex-row sm:items-center">
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-canvas text-muted">
                  <FileTextIcon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink">{d.label}</p>
                  <p className="mt-0.5 truncate text-xs text-muted">
                    {d.fileName ?
                    <>
                        <LockIcon className="mr-1 inline h-3 w-3 -translate-y-px" />
                        {d.fileName} · {d.sizeKb} KB{d.uploadedAt ? ` · ${formatDate(d.uploadedAt)}` : ''}
                      </> :

                    'Not uploaded'
                    }
                  </p>
                  {d.note && <p className="mt-1 text-xs text-warning-700">{d.note}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2 pl-12 sm:pl-0">
                <StatusBadge status={d.uploadStatus === 'Missing' ? 'Missing' : d.verification} size="sm" />
                {d.fileName &&
                <button
                  onClick={() => setPreview(d)}
                  className="inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium text-brand transition-colors duration-150 hover:bg-brand-50">
                  
                    <EyeIcon className="h-3.5 w-3.5" /> View
                  </button>
                }
                {onReupload && needsAction &&
                <button
                  onClick={() => onReupload(d)}
                  className="inline-flex h-8 items-center gap-1.5 rounded-md border border-line px-2.5 text-xs font-medium text-ink transition-colors duration-150 hover:bg-canvas">
                  
                    {d.uploadStatus === 'Missing' ? <UploadIcon className="h-3.5 w-3.5" /> : <RefreshCwIcon className="h-3.5 w-3.5" />}
                    {d.uploadStatus === 'Missing' ? 'Upload' : 'Re-upload'}
                  </button>
                }
              </div>
            </li>);

        })}
      </ul>
      <DocumentPreviewModal doc={preview} viewer={viewer} onClose={() => setPreview(null)} />
    </>);

}