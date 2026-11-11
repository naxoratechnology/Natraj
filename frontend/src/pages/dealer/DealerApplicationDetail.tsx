import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AlertTriangleIcon, FileXIcon, LifeBuoyIcon, SendIcon, UploadIcon } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '../../components/ui/PageHeader';
import { Panel } from '../../components/ui/Panel';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Tabs } from '../../components/ui/Tabs';
import { Timeline } from '../../components/ui/Timeline';
import { DocumentList } from '../../components/ui/DocumentList';
import { Button, buttonClasses } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { FileUploader } from '../../components/ui/FileUploader';
import { EmptyState } from '../../components/ui/EmptyState';
import { FinanceBreakdown } from '../../components/shared/FinanceBreakdown';
import { NotesList } from '../../components/shared/NotesList';
import { NewTicketModal } from '../../components/shared/NewTicketModal';
import { ProgressTrack } from '../../components/shared/ProgressTrack';
import { useDemoData } from '../../contexts/DemoDataContext';
import { currentDealerUser } from '../../data/session';
import { applicationDocuments } from '../../utils/documents';
import { buildApplicationTimeline } from '../../utils/status';
import { formatDate, formatDateTime } from '../../utils/format';
import type { UploadedFile } from '../../types/finance';

export function DealerApplicationDetail() {
  const { id } = useParams();
  const { dealerApplications, dealerCustomers, partners, updateApplication } = useDemoData();
  const app = dealerApplications.find((a) => a.id === id);
  const [tab, setTab] = useState('overview');
  const [ticketOpen, setTicketOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [fileErr, setFileErr] = useState('');

  if (!app) {
    return (
      <div className="rounded-xl border border-line bg-white">
        <EmptyState icon={FileXIcon} title="Application not found" description="This application doesn’t exist or belongs to another dealer." action={<Link to="/dealer/applications" className={buttonClasses('secondary')}>Back to applications</Link>} />
      </div>);

  }

  const customer = dealerCustomers.find((c) => c.id === app.customerId);
  const partner = partners.find((p) => p.id === app.partnerId);
  const timeline = buildApplicationTimeline(app);
  const history = timeline.filter((e) => e.state !== 'upcoming');

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: 'Finance Applications', to: '/dealer/applications' }, { label: app.id }]}
        title={app.id}
        meta={<StatusBadge status={app.status} />}
        description={`${app.customerName} · ${app.product} · Created ${formatDate(app.createdAt)}`}
        actions={
        <>
            <Button variant="secondary" onClick={() => setTicketOpen(true)} icon={<LifeBuoyIcon className="h-4 w-4" />}>
              Raise support ticket
            </Button>
            {app.status === 'Draft' &&
          <Button onClick={() => setSubmitOpen(true)} icon={<SendIcon className="h-4 w-4" />}>
                Submit application
              </Button>
          }
            {app.status === 'Documents Required' &&
          <Button onClick={() => setUploadOpen(true)} icon={<UploadIcon className="h-4 w-4" />}>
                Upload requested document
              </Button>
          }
          </>
        } />
      

      <section aria-label="Application progress" className="rounded-xl border border-line bg-white px-4 py-5 shadow-card sm:px-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-ink">Application progress</h2>
          <p className="text-xs text-muted">Recorded events · not real-time lender data</p>
        </div>
        <ProgressTrack events={timeline} />
      </section>

      {app.status === 'Documents Required' &&
      <div className="flex items-start gap-3 rounded-xl border border-warning/30 bg-warning-50 p-4">
          <AlertTriangleIcon className="mt-0.5 h-5 w-5 shrink-0 text-warning-700" />
          <div>
            <p className="text-sm font-semibold text-warning-700">Action needed: {app.nextAction}</p>
            <p className="mt-0.5 text-[13px] text-warning-700/90">The application will return to review once the document is uploaded.</p>
          </div>
        </div>
      }
      {app.status === 'Rejected' && app.lenderRemarks &&
      <div className="rounded-xl border border-danger/20 bg-danger-50 p-4 text-sm text-danger-700">
          <span className="font-semibold">Lender decision recorded:</span> {app.lenderRemarks}
        </div>
      }

      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <div className="min-w-0">
          <Tabs value={tab} onChange={setTab} className="mb-5" tabs={[{ id: 'overview', label: 'Overview' }, { id: 'documents', label: 'Documents' }, { id: 'history', label: 'Status history', count: history.length }]} />
          {tab === 'overview' &&
          <div className="grid gap-6 lg:grid-cols-2">
              <Panel title="Product & finance details" className="lg:row-span-2">
                <dl className="mb-5 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-xs text-muted">Category</dt>
                    <dd className="mt-0.5 font-medium text-ink">{app.category}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Finance type</dt>
                    <dd className="mt-0.5 font-medium text-ink">{app.financeType}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-xs text-muted">Product / model</dt>
                    <dd className="mt-0.5 font-medium text-ink">{app.product}</dd>
                  </div>
                </dl>
                <FinanceBreakdown app={app} />
              </Panel>
              <Panel title="Customer" actions={customer && <Link to={`/dealer/customers/${customer.id}`} className="text-xs font-medium text-brand hover:underline">View record</Link>}>
                <p className="text-sm font-semibold text-ink">{app.customerName}</p>
                <p className="num mt-0.5 text-xs text-muted">{app.customerId}{customer ? ` · ${customer.phone}` : ''}</p>
                {customer &&
              <div className="mt-3">
                    <StatusBadge status={customer.kycStatus === 'Verified' ? 'Verified' : customer.kycStatus} size="sm" />
                  </div>
              }
              </Panel>
              <Panel title="Finance partner">
                <p className="text-sm font-semibold text-ink">{app.partnerName}</p>
                <p className="text-xs text-muted">{partner?.type} · Demo partner</p>
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted">Processing mode</dt>
                    <dd>{partner && <StatusBadge status={partner.mode} size="sm" />}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted">Lender reference</dt>
                    <dd className="num font-medium text-ink">{app.lenderRef ?? 'Not yet assigned'}</dd>
                  </div>
                  {app.disbursementRef &&
                <div className="flex justify-between gap-3">
                      <dt className="text-muted">Disbursement ref.</dt>
                      <dd className="num font-medium text-ink">{app.disbursementRef}</dd>
                    </div>
                }
                </dl>
              </Panel>
            </div>
          }
          {tab === 'documents' &&
          <Panel title="Application documents" description="Private · shared only with operations and the selected partner">
              <DocumentList documents={applicationDocuments(app)} viewer={currentDealerUser.name} onReupload={() => setUploadOpen(true)} />
            </Panel>
          }
          {tab === 'history' &&
          <Panel title="Status history" description="Recorded events only — not real-time lender data" flush>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-sm">
                  <thead>
                    <tr className="border-b border-line bg-[#F9FAFC] text-left text-xs text-muted">
                      <th className="px-5 py-2.5 font-medium">Event</th>
                      <th className="px-5 py-2.5 font-medium">Recorded</th>
                      <th className="px-5 py-2.5 font-medium">By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...history].reverse().map((h, i) =>
                  <tr key={i} className="border-b border-line last:border-0">
                        <td className="px-5 py-3 font-medium text-ink">{h.label}</td>
                        <td className="num px-5 py-3 text-muted">{h.date ? formatDateTime(h.date) : '—'}</td>
                        <td className="px-5 py-3 text-muted">{h.actor ?? '—'}</td>
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>
            </Panel>
          }
        </div>
        <div className="space-y-6">
          <Panel title="Application timeline">
            <Timeline events={timeline} />
          </Panel>
          <Panel title="Notes" description="Shared between you and the operations team">
            <NotesList appId={app.id} viewer="dealer" author={currentDealerUser.name} />
          </Panel>
        </div>
      </div>

      <NewTicketModal open={ticketOpen} onClose={() => setTicketOpen(false)} defaultApplicationId={app.id} />
      <ConfirmDialog
        open={submitOpen}
        onClose={() => setSubmitOpen(false)}
        title="Submit this application?"
        description="The operations team will review documents before sharing the case with the selected partner. You won’t be able to edit product details after submission."
        confirmLabel="Submit"
        onConfirm={() => {
          updateApplication(app.id, { status: 'Pending', nextAction: 'Review documents and assign' });
          toast.success('Application submitted for review');
        }} />
      
      <Modal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        title="Upload requested document"
        description={app.nextAction}
        footer={
        <>
            <Button variant="secondary" onClick={() => setUploadOpen(false)}>
              Cancel
            </Button>
            <Button
            onClick={() => {
              if (!file) return setFileErr('Attach the requested document');
              updateApplication(app.id, { status: 'Pending', nextAction: 'Re-verify corrected document' });
              setUploadOpen(false);
              setFile(null);
              toast.success('Document uploaded', { description: 'The application is back in review.' });
            }}>
            
              Upload & resubmit
            </Button>
          </>
        }>
        
        <FileUploader label="Current address proof" required value={file} onChange={(f) => {setFile(f);setFileErr('');}} error={fileErr} />
      </Modal>
    </div>);

}