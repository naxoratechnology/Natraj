import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileTextIcon, ShieldCheckIcon, UserRoundIcon, WalletCardsIcon } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Panel } from '../../components/ui/Panel';
import { StatusDonut } from '../../components/charts/StatusDonut';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DealerVerificationSummary } from '../../components/dealer/DealerVerificationSummary';
import { getDealerDashboard, type DealerDashboardData } from '../../services/dashboard';
import { toUiDealer } from '../../services/dealers';
import { formatDateTime } from '../../utils/format';

const documentLabels: Record<string, string> = { missing: 'Not uploaded', pending: 'Pending', under_review: 'Under Review', verified: 'Verified', rejected: 'Action Required' };

export function DealerDashboard() {
  const [data, setData] = useState<DealerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => { getDealerDashboard().then(setData).catch((reason) => setError(reason instanceof Error ? reason.message : 'Unable to load dashboard')).finally(() => setLoading(false)); }, []);

  if (loading) return <div className="h-64 animate-pulse rounded-xl border border-line bg-white shadow-card" />;
  if (!data) return <div className="rounded-xl border border-danger/20 bg-danger-50 p-5 text-sm text-danger-700">{error}</div>;

  const dealer = toUiDealer(data.dealer);
  const firstName = data.dealer.name.split(' ')[0];
  const documentDistribution = Object.entries(data.documentDistribution).map(([name, value]) => ({ name: documentLabels[name] || name, value }));
  const metrics = [
    { label: 'Customers', value: data.metrics.totalCustomers, icon: UserRoundIcon },
    { label: 'Finance applications', value: data.metrics.totalApplications, icon: FileTextIcon },
    { label: 'Approved applications', value: data.metrics.approvedApplications, icon: ShieldCheckIcon },
    { label: 'Disbursed applications', value: data.metrics.disbursedApplications, icon: WalletCardsIcon }
  ];

  return <div className="space-y-6">
    <PageHeader title={`Welcome, ${firstName}`} description={`Live account data · updated ${new Date(data.generatedAt).toLocaleString('en-IN')}`} />
    <DealerVerificationSummary dealer={data.dealer} loading={false} />
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map((metric) => <div key={metric.label} className="rounded-xl border border-line bg-white p-5 shadow-card"><div className="flex items-center justify-between"><span className="text-[13px] text-muted">{metric.label}</span><metric.icon className="h-4 w-4 text-brand" /></div><p className="num mt-2 text-3xl font-bold text-navy">{metric.value}</p></div>)}</section>
    <div className="grid gap-6 xl:grid-cols-[1fr_1.4fr]">
      <Panel title="Document verification" description="Current status of all onboarding documents"><StatusDonut data={documentDistribution} centerLabel="documents" /></Panel>
      <Panel title="Account overview">
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div><dt className="text-xs text-muted">Business</dt><dd className="mt-1 font-medium text-ink">{dealer.businessName}</dd></div>
          <div><dt className="text-xs text-muted">Dealer status</dt><dd className="mt-1"><StatusBadge status={dealer.status} size="sm" /></dd></div>
          <div><dt className="text-xs text-muted">Registration reference</dt><dd className="num mt-1 font-medium text-ink">{data.dealer.dealerCode}</dd></div>
          <div><dt className="text-xs text-muted">Registered</dt><dd className="mt-1 font-medium text-ink">{formatDateTime(data.dealer.submittedAt)}</dd></div>
        </dl>
        <Link to="/dealer/onboarding" className="mt-5 inline-flex text-sm font-medium text-brand hover:underline">View onboarding and documents</Link>
      </Panel>
    </div>
    <Panel title="Verification activity" description="Latest account and document-review events">
      {dealer.history.length ? <ul className="divide-y divide-line">{[...dealer.history].reverse().slice(0, 6).map((event, index) => <li key={`${event.date}-${index}`} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center"><div className="flex-1"><p className="text-sm font-medium text-ink">{event.status}</p>{event.note && <p className="text-xs text-muted">{event.note}</p>}</div><p className="text-xs text-muted">{event.by} · {formatDateTime(event.date)}</p></li>)}</ul> : <p className="text-sm text-muted">No verification activity has been recorded yet.</p>}
    </Panel>
    {data.metrics.totalApplications === 0 && <div className="rounded-xl border border-line bg-canvas p-4 text-sm text-muted">No finance applications are stored yet. Application and customer metrics will populate automatically when those backend modules are connected.</div>}
  </div>;
}
