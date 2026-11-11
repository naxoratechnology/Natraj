import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRightIcon, BadgeCheckIcon, BuildingIcon, FileWarningIcon, ShieldCheckIcon } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Panel } from '../../components/ui/Panel';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { TrendChart } from '../../components/charts/TrendChart';
import { StatusDonut } from '../../components/charts/StatusDonut';
import { getAdminDashboard, type AdminDashboardData } from '../../services/dashboard';
import { toUiDealer } from '../../services/dealers';
import { relativeTime } from '../../utils/format';
import { useDemoData } from '../../contexts/DemoDataContext';
import { useAuth } from '../../contexts/AuthContext';

const statusLabels: Record<string, string> = { submitted: 'Submitted', under_review: 'Under Review', documents_required: 'Documents Required', verified: 'Verified', agreement_pending: 'Agreement Pending', active: 'Active', suspended: 'Suspended', rejected: 'Rejected' };
const documentLabels: Record<string, string> = { missing: 'Missing', pending: 'Pending', under_review: 'Under Review', verified: 'Verified', rejected: 'Rejected' };

export function AdminDashboard() {
  const { dealers: demoDealers, customers, applications } = useDemoData();
  const { user } = useAuth();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => { getAdminDashboard().then(setData).catch((reason) => setError(reason instanceof Error ? reason.message : 'Unable to load dashboard')).finally(() => setLoading(false)); }, []);
  if (loading) return <div className="h-64 animate-pulse rounded-xl border border-line bg-white shadow-card" />;
  const portalBase = user?.role === 'super_admin' ? '/super-admin' : '/admin';
  if (!data) {
    const counts = (statuses: string[]) => demoDealers.filter((dealer) => statuses.includes(dealer.status)).length;
    const demoDistribution = demoDealers.reduce<Record<string, number>>((result, dealer) => { result[dealer.status] = (result[dealer.status] || 0) + 1; return result; }, {});
    const demoMetrics = [
      ['Dealers awaiting verification', counts(['Submitted', 'Under Review', 'Documents Required', 'Agreement Pending']), `${portalBase}/dealers?view=verification`],
      ['Active dealers', counts(['Active']), `${portalBase}/dealers?view=active`],
      ['Total customers', customers.length, `${portalBase}/customers`],
      ['Finance applications', applications.length, `${portalBase}/applications`]
    ] as const;
    return <div className="space-y-5"><PageHeader title="Operations overview" description="Frontend demo data · no backend connection required" /><section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{demoMetrics.map(([label, value, to]) => <Link key={label} to={to} className="group flex items-center gap-4 rounded-xl border border-line bg-white p-4 shadow-card hover:border-brand-200"><span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand"><BuildingIcon className="h-5 w-5" /></span><div className="min-w-0 flex-1"><p className="num text-2xl font-bold text-ink">{value}</p><p className="text-[13px] text-muted">{label}</p></div><ArrowUpRightIcon className="h-4 w-4 text-muted group-hover:text-brand" /></Link>)}</section><div className="grid gap-5 xl:grid-cols-2"><Panel title="Dealer status distribution" description="Realistic preview records"><StatusDonut data={Object.entries(demoDistribution).map(([name, value]) => ({ name, value }))} centerLabel="dealers" /></Panel><Panel title="Demo environment"><div className="space-y-2 text-sm text-muted"><p>All Admin modules and actions are available for the client walkthrough.</p><p>Changes remain in browser memory and reset when the page is refreshed.</p>{error && <p className="text-xs text-warning-700">API unavailable: local demo data is active.</p>}</div></Panel></div></div>;
  }

  const priorities = [
    { label: 'Dealers awaiting verification', value: data.metrics.pendingVerification, icon: BadgeCheckIcon, to: `${portalBase}/dealers?view=verification`, tone: 'text-brand bg-brand-50' },
    { label: 'Documents requested', value: data.metrics.documentsRequired, icon: FileWarningIcon, to: `${portalBase}/dealers?view=verification`, tone: 'text-warning-700 bg-warning-50' },
    { label: 'Active dealers', value: data.metrics.activeDealers, icon: ShieldCheckIcon, to: `${portalBase}/dealers?view=active`, tone: 'text-success bg-success-50' },
    { label: 'Total registered dealers', value: data.metrics.totalDealers, icon: BuildingIcon, to: `${portalBase}/dealers`, tone: 'text-navy bg-canvas' }
  ];
  const metrics = [['Total dealers', data.metrics.totalDealers], ['Active', data.metrics.activeDealers], ['Pending verification', data.metrics.pendingVerification], ['Documents required', data.metrics.documentsRequired], ['Suspended', data.metrics.suspendedDealers], ['Rejected', data.metrics.rejectedDealers], ['Customers', data.metrics.totalCustomers], ['Applications', data.metrics.totalApplications]] as const;
  const dealerDistribution = Object.entries(data.statusDistribution).map(([name, value]) => ({ name: statusLabels[name] || name, value }));
  const documentDistribution = Object.entries(data.documentDistribution).map(([name, value]) => ({ name: documentLabels[name] || name, value }));
  const trend = data.trend.map((row) => ({ month: row.month, submitted: row.registrations, disbursed: row.activated }));

  const dealerList = (records: AdminDashboardData['recentDealers'], empty: string) => records.length ? <ul className="divide-y divide-line">{records.map((record) => { const dealer = toUiDealer(record); return <li key={dealer.id}><Link to={`${portalBase}/dealers/${dealer.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-canvas"><div className="min-w-0 flex-1"><p className="truncate text-[13px] font-medium text-ink">{dealer.businessName}</p><p className="text-xs text-muted">{dealer.ownerName} · {relativeTime(dealer.submittedAt)}</p></div><StatusBadge status={dealer.status} size="sm" /></Link></li>; })}</ul> : <p className="p-5 text-sm text-muted">{empty}</p>;

  return <div className="space-y-5">
    <PageHeader title="Operations overview" description={`Live platform data · updated ${new Date(data.generatedAt).toLocaleString('en-IN')}`} />
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{priorities.map((item) => <Link key={item.label} to={item.to} className="group flex items-center gap-4 rounded-xl border border-line bg-white p-4 shadow-card hover:border-brand-200"><span className={`flex h-11 w-11 items-center justify-center rounded-lg ${item.tone}`}><item.icon className="h-5 w-5" /></span><div className="min-w-0 flex-1"><p className="num text-2xl font-bold text-ink">{item.value}</p><p className="text-[13px] text-muted">{item.label}</p></div><ArrowUpRightIcon className="h-4 w-4 text-muted group-hover:text-brand" /></Link>)}</section>
    <section className="grid grid-cols-2 overflow-hidden rounded-xl border border-line bg-white shadow-card sm:grid-cols-4 xl:grid-cols-8">{metrics.map(([label, value], index) => <div key={label} className={`border-line px-4 py-3 ${index ? 'border-l' : ''}`}><p className="truncate text-[11px] text-muted">{label}</p><p className="num mt-1 text-lg font-semibold text-ink">{value}</p></div>)}</section>
    <div className="grid gap-5 xl:grid-cols-3"><Panel title="Dealer registrations" description="Last six months · live records"><TrendChart data={trend} height={220} primaryLabel="Registered" secondaryLabel="Activated" /></Panel><Panel title="Dealer status distribution" description="All registered dealers"><StatusDonut data={dealerDistribution} centerLabel="dealers" /></Panel><Panel title="Document verification" description="Across all dealer documents"><StatusDonut data={documentDistribution} centerLabel="documents" /></Panel></div>
    <div className="grid gap-5 xl:grid-cols-2"><Panel title="Pending dealer verifications" actions={<Link to={`${portalBase}/dealers?view=verification`} className="text-xs font-medium text-brand">View all</Link>} flush>{dealerList(data.pendingDealers, 'No dealers are awaiting verification.')}</Panel><Panel title="Recently registered dealers" actions={<Link to={`${portalBase}/dealers`} className="text-xs font-medium text-brand">All dealers</Link>} flush>{dealerList(data.recentDealers, 'No registered dealers yet.')}</Panel></div>
  </div>;
}
