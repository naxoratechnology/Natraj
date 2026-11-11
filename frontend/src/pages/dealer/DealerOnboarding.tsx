import React, { useEffect, useState } from 'react';
import { AlertTriangleIcon, CheckIcon, FileSignatureIcon } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '../../components/ui/PageHeader';
import { Panel } from '../../components/ui/Panel';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DocumentList } from '../../components/ui/DocumentList';
import { Timeline } from '../../components/ui/Timeline';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { FileUploader } from '../../components/ui/FileUploader';
import { currentDealerUser } from '../../data/session';
import { formatDate } from '../../utils/format';
import type { UploadedFile } from '../../types/finance';
import { acceptDealerAgreement, getMyDealer, toUiDealer, uploadDealerDocument, type BackendDealer } from '../../services/dealers';
import { registrationDocuments } from '../../types/registration';

const journey = ['Submitted', 'Under Review', 'Verified', 'Agreement Pending', 'Approved', 'Active'];

const statusGuide = [
{ s: 'Draft', d: 'Registration started but not submitted.' },
{ s: 'Submitted', d: 'Received and waiting for a reviewer.' },
{ s: 'Under Review', d: 'Verification team is checking your details.' },
{ s: 'Documents Required', d: 'A correction or additional document is needed.' },
{ s: 'Verified', d: 'Business details and documents confirmed.' },
{ s: 'Agreement Pending', d: 'Dealer agreement is awaiting your acceptance.' },
{ s: 'Approved', d: 'Approved by operations, pending activation.' },
{ s: 'Active', d: 'You can add customers and submit applications.' },
{ s: 'Rejected', d: 'Registration declined, with a recorded reason.' }];


export function DealerOnboarding() {
  const [backendDealer, setBackendDealer] = useState<BackendDealer | null>(null);
  const dealer = backendDealer ? toUiDealer(backendDealer) : null;
  const [loading, setLoading] = useState(true);
  const [renewOpen, setRenewOpen] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] = useState('shop');
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [fileErr, setFileErr] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => { getMyDealer().then(({ dealer: result }) => setBackendDealer(result)).catch(() => setBackendDealer(null)).finally(() => setLoading(false)); }, []);
  const currentIndex = dealer ? ({ Submitted: 0, 'Under Review': 1, 'Documents Required': 1, Verified: 2, 'Agreement Pending': 3, Active: 5, Suspended: 5, Rejected: 0 }[dealer.status] ?? 0) : 0;
  const pct = Math.round((currentIndex + 1) / journey.length * 100);
  const selectedDocument = registrationDocuments.find((document) => document.id === selectedDocumentType);
  const openUpload = (documentType: string) => {
    setSelectedDocumentType(documentType);
    setFile(null);
    setFileErr('');
    setRenewOpen(true);
  };

  const submitRenewal = async () => {
    if (!file?.file) return setFileErr('Attach the renewed licence');
    if (!backendDealer) return setFileErr('Dealer profile is unavailable');
    setUploading(true);
    try {
      const result = await uploadDealerDocument(selectedDocumentType, file.file);
      setBackendDealer(result.dealer);
      setRenewOpen(false);
      toast.success('Document submitted for verification');
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Unable to upload document'); }
    finally { setUploading(false); }
  };

  const acceptAgreement = async () => {
    try { const result = await acceptDealerAgreement(); setBackendDealer(result.dealer); toast.success('Agreement accepted. Your dealer account is active.'); }
    catch (error) { toast.error(error instanceof Error ? error.message : 'Unable to accept agreement'); }
  };

  if (loading) return <div className="h-48 animate-pulse rounded-xl border border-line bg-white shadow-card" />;
  if (!dealer || !backendDealer) return <div className="rounded-xl border border-line bg-white p-6 text-sm text-muted">Unable to load your dealer verification profile.</div>;

  const unresolvedRequests = backendDealer.documentRequests.filter((request) => !request.resolvedAt);

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: 'Dashboard', to: '/dealer/dashboard' }, { label: 'Onboarding' }]}
        title="Onboarding & verification"
        meta={<StatusBadge status={dealer.status} />}
        description={`${currentDealerUser.business} · Dealer code ${dealer.id}`} />
      

      <section className="rounded-xl border border-line bg-white p-5 shadow-card sm:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
          <div className="flex items-center gap-4 lg:w-64 lg:shrink-0">
            <div className="relative h-16 w-16">
              <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90" aria-hidden>
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="#E4EAF2" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="#18A999" strokeWidth="3" strokeDasharray={`${pct * 0.974} 100`} strokeLinecap="round" />
              </svg>
              <span className="num absolute inset-0 flex items-center justify-center text-sm font-bold text-navy">{pct}%</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">Onboarding complete</p>
              <p className="text-xs text-muted">Updated {formatDate(dealer.history[dealer.history.length - 1]?.date || dealer.submittedAt)}</p>
            </div>
          </div>
          <ol className="grid flex-1 grid-cols-3 gap-y-4 sm:grid-cols-6">
            {journey.map((s, i) => {
              const done = i <= currentIndex;
              return (
                <li key={s} className="relative flex flex-col items-center text-center">
                  {i > 0 && <span className={`absolute right-1/2 top-3 h-px w-full ${done ? 'bg-teal' : 'bg-line'}`} aria-hidden />}
                  <span className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full ${done ? 'bg-teal text-white' : 'border border-line bg-white text-muted'}`}>
                    {done ? <CheckIcon className="h-3.5 w-3.5" strokeWidth={3} /> : <span className="text-[11px]">{i + 1}</span>}
                  </span>
                  <span className="mt-2 px-1 text-[12px] font-medium text-ink">{s}</span>
                </li>);

            })}
          </ol>
        </div>
      </section>

      {unresolvedRequests.map((request, index) => (
        <div key={`${request.requestedAt}-${index}`} className="flex flex-col gap-3 rounded-xl border border-warning/30 bg-warning-50 p-4 sm:flex-row sm:items-center">
          <AlertTriangleIcon className="h-5 w-5 shrink-0 text-warning-700" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-warning-700">Documents requested by the verification team</p>
            <p className="text-[13px] text-warning-700/90">{request.note || 'Please upload the requested documents to continue verification.'}</p>
            <p className="mt-1 text-xs text-warning-700/80">{request.documentTypes.map((type) => registrationDocuments.find((document) => document.id === type)?.label || type).join(' · ')}</p>
          </div>
        </div>
      ))}

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <Panel title="Business documents" description="Stored privately · visible only to authorized verification staff">
            <DocumentList documents={dealer.documents} viewer={currentDealerUser.name} onReupload={(document) => openUpload(document.id)} />
          </Panel>
          <Panel title="Dealer agreement">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-canvas text-navy">
                <FileSignatureIcon className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium text-ink">Dealer Partnership Agreement · {backendDealer.agreement?.version || 'v1.0'}</p>
                <p className="text-xs text-muted">{backendDealer.agreement?.acceptedAt ? `Accepted electronically by ${dealer.ownerName} on ${formatDate(backendDealer.agreement.acceptedAt)}.` : 'The agreement becomes available after successful verification.'}</p>
              </div>
              {dealer.status === 'Agreement Pending' ? <Button size="sm" onClick={acceptAgreement}>Accept agreement</Button> : <StatusBadge status={dealer.status === 'Active' ? 'Active' : 'Pending'} />}
            </div>
          </Panel>
        </div>
        <div className="space-y-6">
          <Panel title="Verification history">
            <Timeline events={[...dealer.history].reverse().map((h) => ({ label: h.status, date: h.date, actor: h.by, note: h.note, state: 'done' as const }))} />
          </Panel>
          <Panel title="What each status means">
            <ul className="space-y-3">
              {statusGuide.map((g) =>
              <li key={g.s} className="flex items-start gap-3">
                  <StatusBadge status={g.s} size="sm" className="mt-0.5 w-[132px] shrink-0 justify-start" />
                  <span className="text-[13px] text-muted">{g.d}</span>
                </li>
              )}
            </ul>
          </Panel>
        </div>
      </div>

      <Modal
        open={renewOpen}
        onClose={() => setRenewOpen(false)}
        title={`Upload ${selectedDocument?.label || 'document'}`}
        description="The verification team will review the uploaded document."
        footer={
        <>
            <Button variant="secondary" onClick={() => setRenewOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitRenewal} loading={uploading}>
            
              Submit for review
            </Button>
          </>
        }>
        
        <FileUploader label={selectedDocument?.label || 'Document'} required value={file} onChange={(f) => {setFile(f);setFileErr('');}} error={fileErr} />
      </Modal>
    </div>);

}
