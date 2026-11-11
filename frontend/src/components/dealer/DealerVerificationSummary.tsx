import React, { useMemo } from 'react';
import { AlertTriangleIcon, CheckCircle2Icon, FileCheck2Icon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '../ui/StatusBadge';
import { buttonClasses } from '../ui/Button';
import { registrationDocuments } from '../../types/registration';
import type { BackendDealer } from '../../services/dealers';

interface Props { dealer: BackendDealer | null; loading: boolean; }

const statusLabel: Record<string, string> = {
  pending: 'Pending review', under_review: 'Under review', verified: 'Verified', rejected: 'Action required'
};

export function DealerVerificationSummary({ dealer, loading }: Props) {
  const unresolvedRequests = useMemo(() => dealer?.documentRequests.filter((request) => !request.resolvedAt) ?? [], [dealer]);
  const requestedTypes = useMemo(() => new Set(unresolvedRequests.flatMap((request) => request.documentTypes)), [unresolvedRequests]);

  if (loading) return <div className="h-32 animate-pulse rounded-xl border border-line bg-white shadow-card" />;
  if (!dealer) return null;

  const documents = registrationDocuments.map((definition) => ({ ...definition, document: dealer.documents[definition.id], requested: requestedTypes.has(definition.id) }));
  const uploaded = documents.filter(({ document }) => document).length;
  const verified = documents.filter(({ document }) => document?.verificationStatus === 'verified').length;
  const needsAction = documents.filter(({ document, requested }) => requested && (!document || document.verificationStatus === 'rejected'));
  const isActive = dealer.status === 'active';
  const dealerStatus = dealer.status.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

  return (
    <section className={`rounded-xl border bg-white p-5 shadow-card ${needsAction.length ? 'border-warning/40' : 'border-line'}`}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${needsAction.length ? 'bg-warning-50 text-warning-700' : 'bg-brand-50 text-brand'}`}>
          {needsAction.length ? <AlertTriangleIcon className="h-5 w-5" /> : isActive ? <CheckCircle2Icon className="h-5 w-5" /> : <FileCheck2Icon className="h-5 w-5" />}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-semibold text-ink">Dealer verification</h2>
            <StatusBadge status={dealerStatus} size="sm" />
          </div>
          <p className="mt-1 text-[13px] text-muted">
            {needsAction.length ? `${needsAction.length} requested document${needsAction.length === 1 ? '' : 's'} need your attention.` : isActive ? 'Your dealership is verified and active.' : `${uploaded} of ${documents.length} optional documents uploaded · ${verified} verified.`}
          </p>
          {needsAction.length > 0 && <div className="mt-2 flex flex-wrap gap-2">
            {needsAction.map(({ id, label, document }) => <span key={id} className="rounded-full bg-warning-50 px-2.5 py-1 text-xs font-medium text-warning-700">{label} · {document ? statusLabel[document.verificationStatus] : 'Upload required'}</span>)}
          </div>}
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
          <span className="text-xs text-muted">{verified}/{uploaded} uploaded documents verified</span>
          <Link to="/dealer/onboarding" className={buttonClasses(needsAction.length ? 'primary' : 'secondary', 'sm')}>{needsAction.length ? 'Upload documents' : 'View verification'}</Link>
        </div>
      </div>
    </section>
  );
}
