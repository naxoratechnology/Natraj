import React, { useEffect, useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Field, inputClass } from './Field';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  title: string;
  description: string;
  confirmLabel: string;
  tone?: 'primary' | 'danger';
  requireReason?: boolean;
  reasonLabel?: string;
  children?: React.ReactNode;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  tone = 'primary',
  requireReason = false,
  reasonLabel = 'Reason',
  children
}: ConfirmDialogProps) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setReason('');
      setError('');
      setLoading(false);
    }
  }, [open]);

  const submit = () => {
    if (requireReason && reason.trim().length < 10) {
      setError('Please provide a reason of at least 10 characters. It will be recorded in the history.');
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      onConfirm(reason.trim());
      setLoading(false);
      onClose();
    }, 600);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
      <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant={tone === 'danger' ? 'danger' : 'primary'} onClick={submit} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }>
      
      <p className="text-sm leading-relaxed text-muted">{description}</p>
      {children && <div className="mt-4">{children}</div>}
      {requireReason &&
      <Field label={reasonLabel} required error={error} className="mt-4" htmlFor="confirm-reason">
          <textarea
          id="confirm-reason"
          rows={3}
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            if (error) setError('');
          }}
          className={inputClass(!!error, 'h-auto py-2 resize-none')}
          placeholder="This will be visible in the status history" />
        
        </Field>
      }
    </Modal>);

}