import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BanIcon, CheckIcon, FileQuestionIcon, PlayIcon, ShieldAlertIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '../../components/ui/PageHeader';
import { Panel } from '../../components/ui/Panel';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DocumentList } from '../../components/ui/DocumentList';
import { Timeline } from '../../components/ui/Timeline';
import { Button, buttonClasses } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { EmptyState } from '../../components/ui/EmptyState';
import { currentAdminUser } from '../../data/session';
import { formatDate, formatDateTime } from '../../utils/format';
import { dealerAdminAction, getBackendDealer, toUiDealer, type BackendDealer } from '../../services/dealers';
import type { DealerStatus } from '../../types/finance';
import { useDemoData } from '../../contexts/DemoDataContext';
import { useAuth } from '../../contexts/AuthContext';

const checklist = [
'GSTIN is active on the GST portal',
'PAN matches characters 3–12 of GSTIN',
'Business name matches GST certificate',
'Address proof matches registered address',
'Cancelled cheque matches business name',
'Owner identity verified'];


type Action = 'approve' | 'documents' | 'reject' | 'suspend' | 'activate' | 'review' | null;

export function AdminDealerDetail() {
  const { id } = useParams();
  const { dealers: demoDealers, updateDealer } = useDemoData();
  const { user } = useAuth();
  const [remoteDealer, setRemoteDealer] = useState<BackendDealer | null>(null);
  const [loadingRemote, setLoadingRemote] = useState(true);
  const dealer = remoteDealer ? toUiDealer(remoteDealer) : demoDealers.find((record) => record.id === id);
  const portalBase = user?.role === 'super_admin' ? '/super-admin' : '/admin';
  const [checks, setChecks] = useState<boolean[]>(checklist.map(() => false));
  const [action, setAction] = useState<Action>(null);

  useEffect(() => {
    if (!id) return;
    setLoadingRemote(true);
    getBackendDealer(id).then(({ dealer: result }) => setRemoteDealer(result)).catch(() => setRemoteDealer(null)).finally(() => setLoadingRemote(false));
  }, [id]);

  useEffect(() => {
    if (dealer) setChecks(checklist.map(() => ['Verified', 'Agreement Pending', 'Approved', 'Active', 'Suspended'].includes(dealer.status)));
  }, [dealer?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!dealer) {
    return (
      <div className="rounded-xl border border-line bg-white">
        <EmptyState icon={FileQuestionIcon} title={loadingRemote ? 'Loading dealer…' : 'Dealer not found'} description={loadingRemote ? 'Loading the registered dealer profile.' : 'Check the dealer ID and try again.'} action={<Link to={`${portalBase}/dealers`} className={buttonClasses('secondary')}>Back to dealers</Link>} />
      </div>);

  }

  const inReview = ['Submitted', 'Under Review', 'Documents Required'].includes(dealer.status);
  const allChecked = checks.every(Boolean);

  const remoteAction = async (name: string, body?: object) => {
    if (!id) return;
    if (!remoteDealer) {
      const statusByAction: Record<string, DealerStatus> = { review: 'Under Review', verify: 'Agreement Pending', 'request-documents': 'Documents Required', reject: 'Rejected', suspend: 'Suspended', activate: 'Active' };
      updateDealer(id, { status: statusByAction[name] || dealer.status });
      toast.success(`Dealer status: ${statusByAction[name] || dealer.status} (demo)`);
      return;
    }
    try {
      const result = await dealerAdminAction(id, name, body);
      setRemoteDealer(result.dealer);
      toast.success(`Dealer status: ${toUiDealer(result.dealer).status}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to update dealer');
    }
  };

  const dialogs: Record<Exclude<Action, null>, {title: string;description: string;label: string;tone?: 'danger';reason?: boolean;reasonLabel?: string;run: (r: string) => void;}> = {
    review: { title: 'Start verification review?', description: 'The dealer will see their status change to Under Review.', label: 'Start review', run: () => void remoteAction('review') },
    approve: { title: 'Approve verification?', description: 'Documents are marked verified and the dealer is asked to accept the dealer agreement before activation.', label: 'Approve', run: () => void remoteAction('verify', { checklist: checklist.filter((_, index) => checks[index]) }) },
    documents: { title: 'Request documents', description: 'The dealer will be notified and their status set to Documents Required.', label: 'Send request', reason: true, reasonLabel: 'Documents needed (visible to dealer)', run: (r) => void remoteAction('request-documents', { documentTypes: ['gst', 'pan', 'shop', 'cheque', 'owner', 'address'], note: r }) },
    reject: { title: 'Reject registration?', description: 'The dealer will not be able to access the portal. This reason is recorded and shared with the applicant.', label: 'Reject', tone: 'danger', reason: true, reasonLabel: 'Rejection reason', run: (r) => void remoteAction('reject', { reason: r }) },
    suspend: { title: 'Suspend dealer?', description: 'The dealer will be unable to create new applications. Existing applications continue to be processed.', label: 'Suspend', tone: 'danger', reason: true, reasonLabel: 'Suspension reason', run: (r) => void remoteAction('suspend', { reason: r }) },
    activate: { title: dealer.status === 'Suspended' ? 'Reactivate dealer?' : 'Activate dealer?', description: dealer.status === 'Suspended' ? 'The dealer regains full portal access.' : 'Confirms the dealer has accepted the agreement. The dealer can start submitting applications.', label: 'Activate', run: () => void remoteAction('activate') }
  };
  const dlg = action ? dialogs[action] : null;

  return (
    <div className="space-y-5">
      <PageHeader
        breadcrumbs={[{ label: 'Dealers', to: `${portalBase}/dealers` }, { label: 'Verification', to: `${portalBase}/dealers?view=verification` }, { label: dealer.businessName }]}
        title={dealer.businessName}
        meta={<StatusBadge status={dealer.status} />}
        description={<span className="num">{dealer.id} · {dealer.category} · Submitted {formatDateTime(dealer.submittedAt)}</span>}
        actions={
        <>
            {dealer.status === 'Submitted' && <Button variant="secondary" onClick={() => setAction('review')} icon={<PlayIcon className="h-4 w-4" />}>Start review</Button>}
            {inReview &&
          <>
                <Button variant="secondary" onClick={() => setAction('documents')} icon={<FileQuestionIcon className="h-4 w-4" />}>Request documents</Button>
                <Button variant="secondary" className="text-danger-700" onClick={() => setAction('reject')} icon={<XIcon className="h-4 w-4" />}>Reject</Button>
                <Button onClick={() => setAction('approve')} icon={<CheckIcon className="h-4 w-4" />}>Approve</Button>
              </>
          }
            {(dealer.status === 'Agreement Pending' || dealer.status === 'Suspended') && <Button onClick={() => setAction('activate')} icon={<CheckIcon className="h-4 w-4" />}>{dealer.status === 'Suspended' ? 'Reactivate' : 'Mark agreement accepted & activate'}</Button>}
            {dealer.status === 'Active' && <Button variant="secondary" className="text-danger-700" onClick={() => setAction('suspend')} icon={<BanIcon className="h-4 w-4" />}>Suspend</Button>}
          </>
        } />
      

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-5">
          <div className="grid gap-5 lg:grid-cols-2">
            <Panel title="Business information">
              <dl className="space-y-2.5 text-[13px]">
                {[['Registered name', dealer.businessName], ['Category', dealer.category], ['City / State', `${dealer.city}, ${dealer.state}`], ['Customers · Applications', `${dealer.customers} · ${dealer.applications}`]].map(([k, v]) =>
                <div key={k} className="flex justify-between gap-4"><dt className="text-muted">{k}</dt><dd className="text-right font-medium text-ink">{v}</dd></div>
                )}
              </dl>
            </Panel>
            <Panel title="Owner & contact">
              <dl className="space-y-2.5 text-[13px]">
                {[['Owner', dealer.ownerName], ['Mobile', dealer.phone], ['Email', dealer.email]].map(([k, v]) =>
                <div key={k} className="flex justify-between gap-4"><dt className="text-muted">{k}</dt><dd className="num truncate text-right font-medium text-ink">{v}</dd></div>
                )}
              </dl>
            </Panel>
            <Panel title="GST & PAN" className="lg:col-span-2">
              <dl className="grid gap-4 text-[13px] sm:grid-cols-3">
                <div><dt className="text-muted">GSTIN</dt><dd className="num mt-1 font-medium text-ink">{dealer.gstin}</dd></div>
                <div><dt className="text-muted">Business PAN</dt><dd className="num mt-1 font-medium text-ink">{dealer.panMasked}</dd></div>
                <div><dt className="text-muted">Verification method</dt><dd className="mt-1 font-medium text-ink">Manual (Phase 1)</dd></div>
              </dl>
            </Panel>
          </div>
          <Panel title="Submitted documents" description="Access-controlled · every view is logged" actions={<span className="flex items-center gap-1 text-[11px] text-muted"><ShieldAlertIcon className="h-3.5 w-3.5" /> Private</span>}>
            <DocumentList documents={dealer.documents} viewer={currentAdminUser.name} />
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel title="Verification checklist" description={`${checks.filter(Boolean).length} of ${checklist.length} complete`}>
            <ul className="space-y-2.5">
              {checklist.map((c, i) =>
              <li key={c}>
                  <label className="flex items-start gap-2.5 text-[13px] text-ink">
                    <input type="checkbox" checked={checks[i]} disabled={!inReview} onChange={(e) => setChecks(checks.map((x, j) => j === i ? e.target.checked : x))} className="mt-0.5 h-4 w-4 accent-brand" />
                    {c}
                  </label>
                </li>
              )}
            </ul>
            {inReview && !allChecked && <p className="mt-3 text-xs text-muted">Approve is enabled once every item is checked.</p>}
          </Panel>
          <Panel title="Previous correction requests">
            {dealer.corrections.length === 0 ?
            <p className="text-[13px] text-muted">No corrections requested.</p> :

            <ul className="space-y-2">
                {dealer.corrections.map((c, i) =>
              <li key={i} className="rounded-lg bg-warning-50/70 p-3">
                    <p className="text-[13px] text-ink">{c.body}</p>
                    <p className="mt-1 text-[11px] text-muted">{c.author} · {formatDate(c.time)}</p>
                  </li>
              )}
              </ul>
            }
          </Panel>
          <Panel title="Internal notes" description="Not visible to the dealer">
            <ul className="space-y-2">
              {dealer.notes.map((n, i) =>
              <li key={i} className="rounded-lg bg-canvas p-3">
                  <p className="text-[13px] text-ink">{n.body}</p>
                  <p className="mt-1 text-[11px] text-muted">{n.author} · {formatDateTime(n.time)}</p>
                </li>
              )}
            </ul>
          </Panel>
          <Panel title="Status history">
            <Timeline compact events={[...dealer.history].reverse().map((h) => ({ label: h.note ? `${h.status} — ${h.note}` : h.status, date: h.date, actor: h.by, state: 'done' as const }))} />
          </Panel>
        </div>
      </div>

      {dlg &&
      <ConfirmDialog open={!!action} onClose={() => setAction(null)} title={dlg.title} description={dlg.description} confirmLabel={dlg.label} tone={dlg.tone} reasonLabel={dlg.reasonLabel} onConfirm={dlg.run} />
      }
    </div>);

}
