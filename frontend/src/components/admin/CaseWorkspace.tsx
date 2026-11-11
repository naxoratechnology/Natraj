import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ClockIcon, ExternalLinkIcon, InfoIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Field, inputClass } from '../ui/Field';
import { TextField } from '../ui/TextField';
import { SelectInput } from '../ui/SelectInput';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { Timeline } from '../ui/Timeline';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { NotesList } from '../shared/NotesList';
import { useDemoData } from '../../contexts/DemoDataContext';
import { currentAdminUser } from '../../data/session';
import { ageLabel, formatINR, relativeTime } from '../../utils/format';
import { buildApplicationTimeline, nextActionFor } from '../../utils/status';
import { applicationDocuments } from '../../utils/documents';
import type { ApplicationStatus, FinanceApplication } from '../../types/finance';

const workflowStatuses: ApplicationStatus[] = ['Pending', 'Documents Required', 'Processing', 'Awaiting Lender', 'Approved', 'Rejected', 'Disbursement Pending', 'Disbursed'];

export function CaseWorkspace({ app, showHeader = true }: {app: FinanceApplication;showHeader?: boolean;}) {
  const location = useLocation();
  const portalBase = location.pathname.startsWith('/super-admin') ? '/super-admin' : '/admin';
  const { updateApplication, addNote } = useDemoData();
  const [form, setForm] = useState({ lenderRef: '', status: app.status, remarks: '', followUp: '', disbAmount: '', disbRef: '', disbDate: '' });
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [confirm, setConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      lenderRef: app.lenderRef ?? '',
      status: app.status,
      remarks: app.lenderRemarks ?? '',
      followUp: app.followUp ?? '',
      disbAmount: app.disbursedAmount ? String(app.disbursedAmount) : String(app.amount),
      disbRef: app.disbursementRef ?? '',
      disbDate: app.disbursementDate ?? ''
    });
    setChecked(Object.fromEntries(applicationDocuments(app).map((d) => [d.id, d.verification === 'Verified'])));
  }, [app]);

  const docs = applicationDocuments(app);
  const showDisb = ['Approved', 'Disbursement Pending', 'Disbursed'].includes(form.status);
  const statusChanged = form.status !== app.status;

  const persist = (reason?: string) => {
    setSaving(true);
    window.setTimeout(() => {
      updateApplication(app.id, {
        lenderRef: form.lenderRef.trim() || undefined,
        status: form.status,
        lenderRemarks: form.remarks.trim() || reason || undefined,
        followUp: form.followUp || undefined,
        nextAction: nextActionFor[form.status],
        assignedTo: app.assignedTo ?? currentAdminUser.name,
        disbursedAmount: showDisb && form.disbAmount ? Number(form.disbAmount) : undefined,
        disbursementRef: form.disbRef.trim() || undefined,
        disbursementDate: form.disbDate || undefined
      });
      if (reason) addNote({ appId: app.id, author: currentAdminUser.name, body: `${form.status}: ${reason}`, internal: false });
      setSaving(false);
      toast.success(statusChanged ? `Recorded: ${form.status}` : 'Case details saved');
    }, 500);
  };

  const save = () => {
    if (statusChanged) setConfirm(true);else
    persist();
  };

  return (
    <div className="space-y-5">
      {showHeader &&
      <div className="flex flex-col gap-3 border-b border-line pb-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Link to={`${portalBase}/applications/${app.id}`} className="num text-base font-semibold text-navy hover:underline">
                {app.id}
              </Link>
              <ExternalLinkIcon className="h-3.5 w-3.5 text-muted" />
            </div>
            <p className="mt-0.5 text-[13px] text-muted">
              {app.customerName} · {app.dealerName} · <span className="num">{formatINR(app.amount)}</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
            <span className="flex items-center gap-1">
              <ClockIcon className="h-3.5 w-3.5" /> Age {ageLabel(app.createdAt)}
            </span>
            <span>· Updated {relativeTime(app.updatedAt)}</span>
            <StatusBadge status={app.status} size="sm" />
          </div>
        </div>
      }

      <div className="flex items-start gap-2 rounded-lg border border-warning/25 bg-warning-50 px-3 py-2 text-xs text-warning-700">
        <InfoIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        Manual workflow: {app.partnerName} has no configured API. Submit the case through the partner’s agreed channel, then record each outcome here.
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Lender reference number" value={form.lenderRef} onChange={(v) => setForm({ ...form, lenderRef: v })} placeholder="As issued by the lender" />
        <Field label="Current recorded status">
          <SelectInput value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ApplicationStatus })} options={workflowStatuses} />
        </Field>
        <Field label="Lender remarks" className="sm:col-span-2" htmlFor={`rem-${app.id}`} hint="Summarize what the lender communicated">
          <textarea id={`rem-${app.id}`} rows={2} value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} className={inputClass(false, 'h-auto resize-none py-2')} />
        </Field>
        <TextField label="Follow-up date" type="date" value={form.followUp} onChange={(v) => setForm({ ...form, followUp: v })} />
        <Field label="Next action">
          <div className="flex h-10 items-center rounded-lg border border-line bg-canvas px-3 text-[13px] text-ink">{nextActionFor[form.status]}</div>
        </Field>
      </div>

      <section>
        <h3 className="text-[13px] font-semibold text-ink">Required documents</h3>
        <ul className="mt-2 divide-y divide-line rounded-lg border border-line">
          {docs.map((d) =>
          <li key={d.id} className="flex items-center gap-3 px-3 py-2">
              <input type="checkbox" id={`doc-${app.id}-${d.id}`} checked={!!checked[d.id]} onChange={(e) => setChecked({ ...checked, [d.id]: e.target.checked })} className="h-4 w-4 accent-brand" />
              <label htmlFor={`doc-${app.id}-${d.id}`} className="flex-1 text-[13px] text-ink">
                {d.label}
              </label>
              <StatusBadge status={d.uploadStatus === 'Missing' ? 'Missing' : checked[d.id] ? 'Verified' : d.verification} size="sm" />
            </li>
          )}
        </ul>
      </section>

      {showDisb &&
      <section className="rounded-lg border border-line p-4">
          <h3 className="text-[13px] font-semibold text-ink">Disbursement information</h3>
          <p className="mt-0.5 text-xs text-muted">Record only after the lender confirms. Funds flow directly from lender — not via the platform.</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            <TextField label="Disbursed amount" prefix="₹" inputMode="numeric" value={form.disbAmount} onChange={(v) => setForm({ ...form, disbAmount: v.replace(/\D/g, '') })} />
            <TextField label="Disbursement / UTR ref." value={form.disbRef} onChange={(v) => setForm({ ...form, disbRef: v })} />
            <TextField label="Disbursement date" type="date" value={form.disbDate} onChange={(v) => setForm({ ...form, disbDate: v })} />
          </div>
        </section>
      }

      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={() => setForm({ ...form, status: app.status })} disabled={!statusChanged}>
          Reset
        </Button>
        <Button onClick={save} loading={saving}>
          {statusChanged ? 'Record status change' : 'Save case details'}
        </Button>
      </div>

      <div className="grid gap-5 border-t border-line pt-5 lg:grid-cols-2">
        <section>
          <h3 className="mb-3 text-[13px] font-semibold text-ink">Notes</h3>
          <NotesList appId={app.id} viewer="admin" author={currentAdminUser.name} />
        </section>
        <section>
          <h3 className="mb-3 text-[13px] font-semibold text-ink">Full status history</h3>
          <Timeline events={buildApplicationTimeline(app)} compact />
        </section>
      </div>

      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        title={`Record status as ${form.status}?`}
        description={`This changes the status the dealer sees from “${app.status}” to “${form.status}” and is written to the audit log.`}
        confirmLabel="Record"
        tone={form.status === 'Rejected' ? 'danger' : 'primary'}
        reasonLabel={form.status === 'Documents Required' ? 'Documents needed (visible to dealer)' : 'Rejection reason as communicated by lender'}
        onConfirm={(reason) => persist(reason || undefined)} />
      
    </div>);

}
