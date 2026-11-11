import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Field, inputClass } from '../ui/Field';
import { TextField } from '../ui/TextField';
import { SelectInput } from '../ui/SelectInput';
import { FileUploader } from '../ui/FileUploader';
import { useDemoData } from '../../contexts/DemoDataContext';
import { currentDealerUser } from '../../data/session';
import { TODAY, demoId } from '../../utils/format';
import type { SupportTicket, UploadedFile } from '../../types/finance';

interface NewTicketModalProps {
  open: boolean;
  onClose: () => void;
  onCreate?: (t: SupportTicket) => void;
  defaultApplicationId?: string;
}

export function NewTicketModal({ open, onClose, onCreate, defaultApplicationId }: NewTicketModalProps) {
  const { dealerApplications } = useDemoData();
  const [subject, setSubject] = useState('');
  const [appId, setAppId] = useState(defaultApplicationId ?? '');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [errors, setErrors] = useState<{subject?: string;message?: string;}>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setSubject('');
      setMessage('');
      setFile(null);
      setErrors({});
      setAppId(defaultApplicationId ?? '');
    }
  }, [open, defaultApplicationId]);

  const submit = () => {
    const e: typeof errors = {};
    if (subject.trim().length < 5) e.subject = 'Add a short subject (at least 5 characters)';
    if (message.trim().length < 15) e.message = 'Describe the issue in at least 15 characters';
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    window.setTimeout(() => {
      const ticket: SupportTicket = {
        id: demoId('TK'),
        subject: subject.trim(),
        dealerName: currentDealerUser.business,
        applicationId: appId || undefined,
        status: 'Open',
        priority: 'Medium',
        assignedTo: 'Unassigned',
        createdAt: TODAY.toISOString(),
        messages: [{ from: 'dealer', author: currentDealerUser.name, body: message.trim(), time: TODAY.toISOString(), attachment: file?.name }],
        internalNotes: []
      };
      onCreate?.(ticket);
      setLoading(false);
      onClose();
      toast.success(`Ticket ${ticket.id} raised`, { description: 'The support team will respond in the conversation.' });
    }, 700);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Raise a support ticket"
      description="Our support team will reply in the ticket conversation."
      footer={
      <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} loading={loading}>
            Submit ticket
          </Button>
        </>
      }>
      
      <div className="space-y-4">
        <TextField label="Subject" required value={subject} onChange={(v) => {setSubject(v);setErrors((x) => ({ ...x, subject: undefined }));}} error={errors.subject} />
        <Field label="Related application" hint="Optional — link the ticket to one of your applications">
          <SelectInput placeholder="None" value={appId} onChange={(e) => setAppId(e.target.value)} options={dealerApplications.map((a) => ({ value: a.id, label: `${a.id} · ${a.customerName}` }))} />
        </Field>
        <Field label="Message" required error={errors.message} htmlFor="tk-msg">
          <textarea id="tk-msg" rows={4} value={message} onChange={(e) => {setMessage(e.target.value);setErrors((x) => ({ ...x, message: undefined }));}} className={inputClass(!!errors.message, 'h-auto resize-none py-2')} />
        </Field>
        <FileUploader label="Attachment" value={file} onChange={setFile} />
      </div>
    </Modal>);

}