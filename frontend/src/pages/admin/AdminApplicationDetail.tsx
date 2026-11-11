import React, { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { FileQuestionIcon, FileXIcon, RefreshCwIcon, StickyNoteIcon, UserCheckIcon } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Panel } from '../../components/ui/Panel';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Tabs } from '../../components/ui/Tabs';
import { Timeline } from '../../components/ui/Timeline';
import { DocumentList } from '../../components/ui/DocumentList';
import { Button, buttonClasses } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { FinanceBreakdown } from '../../components/shared/FinanceBreakdown';
import { NotesList } from '../../components/shared/NotesList';
import { CaseWorkspace } from '../../components/admin/CaseWorkspace';
import { ProgressTrack } from '../../components/shared/ProgressTrack';
import { ApplicationActions, type AppAction } from '../../components/admin/ApplicationActions';
import { useDemoData } from '../../contexts/DemoDataContext';
import { currentAdminUser } from '../../data/session';
import { applicationDocuments } from '../../utils/documents';
import { buildApplicationTimeline } from '../../utils/status';
import { ageLabel, formatDate, formatDateTime } from '../../utils/format';

export function AdminApplicationDetail() {
  const location = useLocation();
  const portalBase = location.pathname.startsWith('/super-admin') ? '/super-admin' : '/admin';
  const { id } = useParams();
  const { applications, customers, partners, dealers } = useDemoData();
  const app = applications.find((a) => a.id === id);
  const [tab, setTab] = useState('overview');
  const [action, setAction] = useState<AppAction>(null);

  if (!app) {
    return (
      <div className="rounded-xl border border-line bg-white">
        <EmptyState icon={FileXIcon} title="Application not found" description="Check the application ID." action={<Link to={`${portalBase}/applications`} className={buttonClasses('secondary')}>Back to applications</Link>} />
      </div>);

  }
  const customer = customers.find((c) => c.id === app.customerId);
  const partner = partners.find((p) => p.id === app.partnerId);
  const dealer = dealers.find((d) => d.id === app.dealerId);

  return (
    <div className="space-y-5">
      <PageHeader
        breadcrumbs={[{ label: 'Finance Applications', to: `${portalBase}/applications` }, { label: app.id }]}
        title={app.id}
        meta={<StatusBadge status={app.status} />}
        description={`${app.customerName} · ${app.dealerName} · Created ${formatDateTime(app.createdAt)}`}
        actions={
        <>
            <Button variant="secondary" size="sm" onClick={() => setAction('note')} icon={<StickyNoteIcon className="h-4 w-4" />}>Internal note</Button>
            <Button variant="secondary" size="sm" onClick={() => setAction('documents')} icon={<FileQuestionIcon className="h-4 w-4" />}>Request documents</Button>
            <Button variant="secondary" size="sm" onClick={() => setAction('assign')} icon={<UserCheckIcon className="h-4 w-4" />}>Assign</Button>
            <Button size="sm" onClick={() => setAction('status')} icon={<RefreshCwIcon className="h-4 w-4" />}>Update status</Button>
          </>
        } />
      

      <dl className="grid grid-cols-2 overflow-hidden rounded-xl border border-line bg-white shadow-card md:grid-cols-5">
        {[
        ['Age', ageLabel(app.createdAt)],
        ['Assigned to', app.assignedTo ?? 'Unassigned'],
        ['Lender reference', app.lenderRef ?? '—'],
        ['Follow-up', app.followUp ? formatDate(app.followUp) : '—'],
        ['Next action', app.nextAction]].
        map(([k, v], i) =>
        <div key={k} className={`px-4 py-3 ${i > 0 ? 'border-l border-line' : ''} ${i === 4 ? 'col-span-2 md:col-span-1' : ''}`}>
            <dt className="text-[11px] text-muted">{k}</dt>
            <dd className="num mt-0.5 truncate text-[13px] font-medium text-ink" title={v}>{v}</dd>
          </div>
        )}
      </dl>

      <section aria-label="Application progress" className="rounded-xl border border-line bg-white px-4 py-5 shadow-card sm:px-6">
        <ProgressTrack events={buildApplicationTimeline(app)} />
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.8fr_1fr]">
        <div className="min-w-0">
          <Tabs value={tab} onChange={setTab} className="mb-4" tabs={[{ id: 'overview', label: 'Overview' }, { id: 'processing', label: 'Manual processing' }, { id: 'documents', label: 'Documents' }, { id: 'notes', label: 'Notes' }]} />
          {tab === 'overview' &&
          <div className="grid gap-5 lg:grid-cols-2">
              <Panel title="Product & finance" className="lg:row-span-2">
                <p className="mb-1 text-sm font-medium text-ink">{app.product}</p>
                <p className="mb-5 text-xs text-muted">{app.category} · {app.financeType}</p>
                <FinanceBreakdown app={app} />
              </Panel>
              <Panel title="Customer">
                <p className="text-sm font-semibold text-ink">{app.customerName}</p>
                <p className="num mt-0.5 text-xs text-muted">{app.customerId} · {customer?.phone} · {customer?.city}</p>
                <p className="num mt-2 text-xs text-muted">PAN XXXXXX{customer?.panLast4}</p>
                {customer && <div className="mt-3"><StatusBadge status={customer.kycStatus === 'Verified' ? 'Verified' : customer.kycStatus} size="sm" /></div>}
              </Panel>
              <Panel title="Dealer & partner">
                <dl className="space-y-2 text-[13px]">
                  <div className="flex justify-between gap-3"><dt className="text-muted">Dealer</dt><dd className="text-right"><Link to={`${portalBase}/dealers/${app.dealerId}`} className="font-medium text-brand hover:underline">{app.dealerName}</Link></dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-muted">Dealer status</dt><dd>{dealer && <StatusBadge status={dealer.status} size="sm" />}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-muted">Partner</dt><dd className="font-medium text-ink">{app.partnerName}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-muted">Mode</dt><dd>{partner && <StatusBadge status={partner.mode} size="sm" />}</dd></div>
                </dl>
              </Panel>
            </div>
          }
          {tab === 'processing' &&
          <Panel>
              <CaseWorkspace app={app} showHeader={false} />
            </Panel>
          }
          {tab === 'documents' &&
          <Panel title="Application documents" description="Access-controlled · views are audit-logged">
              <DocumentList documents={applicationDocuments(app)} viewer={currentAdminUser.name} />
            </Panel>
          }
          {tab === 'notes' &&
          <Panel title="Notes" description="Internal notes are hidden from the dealer">
              <NotesList appId={app.id} viewer="admin" author={currentAdminUser.name} />
            </Panel>
          }
        </div>
        <Panel title="Timeline & status history">
          <Timeline events={buildApplicationTimeline(app)} />
        </Panel>
      </div>
      <ApplicationActions app={app} action={action} onClose={() => setAction(null)} />
    </div>);

}
