import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Field, inputClass } from '../ui/Field';
import { SelectInput } from '../ui/SelectInput';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { StatusBadge } from '../ui/StatusBadge';
import { useDemoData } from '../../contexts/DemoDataContext';
import { adminUsers } from '../../data/adminUsers';
import { currentAdminUser } from '../../data/session';
import { allApplicationStatuses, nextActionFor } from '../../utils/status';
import type { ApplicationStatus, FinanceApplication } from '../../types/finance';

export type AppAction = 'status' | 'documents' | 'note' | 'assign' | null;

interface Props {
  app: FinanceApplication | null;
  action: AppAction;
  onClose: () => void;
}

export function ApplicationActions({ app, action, onClose }: Props) {
  const { updateApplication, addNote } = useDemoData();
  const [status, setStatus] = useState<ApplicationStatus>('Processing');
  const [note, setNote] = useState('');
  const [noteErr, setNoteErr] = useState('');
  const [assignee, setAssignee] = useState('');
  const [confirmStatus, setConfirmStatus] = useState(false);

  useEffect(() => {
    if (app) {
      setStatus(app.status);
      setAssignee(app.assignedTo ?? currentAdminUser.name);
    }
    setNote('');
    setNoteErr('');
  }, [app, action]);

  if (!app) return null;

  return (
    <>
      <Modal
        open={action === 'status' && !confirmStatus}
        onClose={onClose}
        title="Update recorded status"
        description={`${app.id} · ${app.customerName}`}
        footer={
        <>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={status === app.status} onClick={() => setConfirmStatus(true)}>
              Continue
            </Button>
          </>
        }>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted">
            Current: <StatusBadge status={app.status} size="sm" />
          </div>
          <Field label="New status">
            <SelectInput value={status} onChange={(e) => setStatus(e.target.value as ApplicationStatus)} options={allApplicationStatuses} />
          </Field>
          <p className="rounded-lg bg-canvas p-3 text-xs leading-relaxed text-muted">
            Record only what the lender or dealer has actually communicated. Phase 1 has no lender API — this status is entered manually and shown to the dealer.
          </p>
        </div>
      </Modal>
      <ConfirmDialog
        open={action === 'status' && confirmStatus}
        onClose={() => {
          setConfirmStatus(false);
          onClose();
        }}
        title={`Change status to ${status}?`}
        description={`The dealer will see this status change on ${app.id} and it will be written to the audit log.`}
        confirmLabel="Record status"
        tone={status === 'Rejected' ? 'danger' : 'primary'}
        reasonLabel={status === 'Documents Required' ? 'Documents requested (visible to dealer)' : 'Reason (visible in history)'}
        onConfirm={(reason) => {
          updateApplication(app.id, { status, nextAction: nextActionFor[status], lenderRemarks: status === 'Rejected' ? reason : app.lenderRemarks });
          if (reason) addNote({ appId: app.id, author: currentAdminUser.name, body: `${status}: ${reason}`, internal: false });
          toast.success(`Status recorded as ${status}`);
        }} />
      
      <ConfirmDialog
        open={action === 'documents'}
        onClose={onClose}
        title="Request documents from dealer"
        description={`The application will move to “Documents Required” and ${app.dealerName} will be notified.`}
        confirmLabel="Send request"
        reasonLabel="Which documents are needed, and why?"
        onConfirm={(reason) => {
          updateApplication(app.id, { status: 'Documents Required', nextAction: 'Dealer to upload requested documents' });
          addNote({ appId: app.id, author: currentAdminUser.name, body: `Documents requested: ${reason || 'Additional documents requested for demo'}`, internal: false });
          toast.success('Document request sent to dealer (demo)');
        }} />
      
      <Modal
        open={action === 'note'}
        onClose={onClose}
        title="Add internal note"
        description="Internal notes are never shown to the dealer."
        footer={
        <>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
            onClick={() => {
              addNote({ appId: app.id, author: currentAdminUser.name, body: note.trim() || 'Demo internal note', internal: true });
              toast.success('Internal note saved');
              onClose();
            }}>
            
              Save note
            </Button>
          </>
        }>
        
        <Field label="Note" error={noteErr} htmlFor="int-note">
          <textarea id="int-note" rows={4} value={note} onChange={(e) => {setNote(e.target.value);setNoteErr('');}} className={inputClass(!!noteErr, 'h-auto resize-none py-2')} />
        </Field>
      </Modal>
      <Modal
        open={action === 'assign'}
        onClose={onClose}
        title="Assign for manual processing"
        description={`${app.id} · ${app.partnerName}`}
        footer={
        <>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
            onClick={() => {
              const patch: Partial<FinanceApplication> = { assignedTo: assignee };
              if (app.status === 'Pending') Object.assign(patch, { status: 'Processing', nextAction: nextActionFor.Processing });
              updateApplication(app.id, patch);
              toast.success(`Assigned to ${assignee}`, { description: app.status === 'Pending' ? 'Moved to Processing in the manual queue.' : undefined });
              onClose();
            }}>
            
              Assign
            </Button>
          </>
        }>
        
        <Field label="Assign to" hint="Only Finance Operations and Operations Admin roles can process cases">
          <SelectInput value={assignee} onChange={(e) => setAssignee(e.target.value)} options={adminUsers.filter((u) => u.status === 'Active' && ['Operations Admin', 'Finance Operations', 'Super Admin'].includes(u.role)).map((u) => ({ value: u.name, label: `${u.name} · ${u.role}` }))} />
        </Field>
        {app.status === 'Pending' && <p className="mt-3 text-xs text-muted">The case will move from New to Processing.</p>}
      </Modal>
    </>);

}
