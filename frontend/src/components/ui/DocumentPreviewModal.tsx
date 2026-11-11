import React from 'react';
import { LockIcon, ShieldCheckIcon } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { TODAY, formatDateTime } from '../../utils/format';
import type { DocumentRecord } from '../../types/finance';

export function DocumentPreviewModal({ doc, viewer, onClose }: {doc: DocumentRecord | null;viewer: string;onClose: () => void;}) {
  return (
    <Modal
      open={!!doc}
      onClose={onClose}
      title={doc?.label ?? ''}
      description={doc?.fileName}
      size="lg"
      footer={
      <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      }>
      
      <div className="relative overflow-hidden rounded-lg border border-line bg-canvas">
        <div className="space-y-3 p-8 opacity-60 blur-[3px]" aria-hidden>
          <div className="h-5 w-1/3 rounded bg-[#CFD8E4]" />
          <div className="h-3 w-2/3 rounded bg-[#DCE3EC]" />
          <div className="h-3 w-1/2 rounded bg-[#DCE3EC]" />
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="h-20 rounded bg-[#DCE3EC]" />
            <div className="col-span-2 space-y-2">
              <div className="h-3 rounded bg-[#DCE3EC]" />
              <div className="h-3 w-4/5 rounded bg-[#DCE3EC]" />
              <div className="h-3 w-3/5 rounded bg-[#DCE3EC]" />
            </div>
          </div>
          <div className="h-3 w-3/4 rounded bg-[#DCE3EC]" />
          <div className="h-3 w-2/5 rounded bg-[#DCE3EC]" />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-navy text-white">
            <LockIcon className="h-5 w-5" />
          </span>
          <p className="mt-3 text-sm font-semibold text-ink">Protected document</p>
          <p className="mt-1 max-w-sm text-xs leading-relaxed text-muted">
            Document contents are access-controlled. In production, the file is served through a time-limited signed link after a permission check. No real document is stored in this prototype.
          </p>
        </div>
        <div className="pointer-events-none absolute bottom-3 right-3 rotate-0 text-[10px] font-medium uppercase tracking-wider text-muted/70">
          Viewed by {viewer} · {formatDateTime(TODAY.toISOString())}
        </div>
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted">
        <ShieldCheckIcon className="h-3.5 w-3.5 text-teal-700" /> This view will be recorded in the audit log.
      </p>
    </Modal>);

}