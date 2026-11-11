import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { EyeIcon, FileQuestionIcon, FileTextIcon, MoreHorizontalIcon, RefreshCwIcon, StickyNoteIcon, UserCheckIcon } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { SearchInput } from '../../components/ui/SearchInput';
import { FilterSelect } from '../../components/ui/FilterSelect';
import { MultiFilter } from '../../components/ui/MultiFilter';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { Dropdown } from '../../components/ui/Dropdown';
import { Button } from '../../components/ui/Button';
import { ApplicationActions, type AppAction } from '../../components/admin/ApplicationActions';
import { useDemoData } from '../../contexts/DemoDataContext';
import { downloadCsv, formatDate, formatINR, relativeTime } from '../../utils/format';
import { allApplicationStatuses } from '../../utils/status';
import type { FinanceApplication } from '../../types/finance';

export function AdminApplications() {
  const navigate = useNavigate();
  const location = useLocation();
  const portalBase = location.pathname.startsWith('/super-admin') ? '/super-admin' : '/admin';
  const [params] = useSearchParams();
  const { applications } = useDemoData();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [q, setQ] = useState(params.get('q') ?? '');
  const [statuses, setStatuses] = useState<string[]>([]);
  const [partner, setPartner] = useState('');
  const [category, setCategory] = useState('');
  const [dealer, setDealer] = useState('');
  const [target, setTarget] = useState<FinanceApplication | null>(null);
  const [action, setAction] = useState<AppAction>(null);

  const load = () => {
    setLoading(true);
    setError(false);
    const t = window.setTimeout(() => setLoading(false), 650);
    return () => window.clearTimeout(t);
  };
  useEffect(load, []);

  const partners = useMemo(() => Array.from(new Set(applications.map((a) => a.partnerName))).sort(), [applications]);
  const dealers = useMemo(() => Array.from(new Set(applications.map((a) => a.dealerName))).sort(), [applications]);
  const rows = applications.
  filter((a) => statuses.length === 0 || statuses.includes(a.status)).
  filter((a) => !partner || a.partnerName === partner).
  filter((a) => !category || a.category === category).
  filter((a) => !dealer || a.dealerName === dealer).
  filter((a) => !q || `${a.id} ${a.customerName} ${a.dealerName} ${a.lenderRef ?? ''}`.toLowerCase().includes(q.toLowerCase()));
  const activeFilters = [statuses.length ? 'x' : '', partner, category, dealer, q].filter(Boolean).length;
  const statusCounts = Object.fromEntries(allApplicationStatuses.map((s) => [s, applications.filter((a) => a.status === s).length]));

  const open = (a: FinanceApplication, act: AppAction) => {
    setTarget(a);
    setAction(act);
  };

  const columns: Column<FinanceApplication>[] = [
  { key: 'id', header: 'Application ID', sortValue: (a) => a.id, render: (a) => <span className="num font-medium text-navy">{a.id}</span> },
  { key: 'dealer', header: 'Dealer', sortValue: (a) => a.dealerName, render: (a) => <span className="block max-w-[170px] truncate">{a.dealerName}</span> },
  { key: 'customer', header: 'Customer', sortValue: (a) => a.customerName, render: (a) => a.customerName },
  { key: 'category', header: 'Category', render: (a) => <span className="text-muted">{a.category}</span> },
  { key: 'partner', header: 'Finance Partner', sortValue: (a) => a.partnerName, render: (a) => <span className="text-muted">{a.partnerName}</span> },
  { key: 'amount', header: 'Amount', align: 'right', sortValue: (a) => a.amount, render: (a) => <span className="num font-medium">{formatINR(a.amount)}</span> },
  { key: 'status', header: 'Status', sortValue: (a) => a.status, render: (a) => <StatusBadge status={a.status} size="sm" /> },
  { key: 'created', header: 'Created', sortValue: (a) => a.createdAt, render: (a) => <span className="num text-muted">{formatDate(a.createdAt)}</span> },
  { key: 'updated', header: 'Last updated', sortValue: (a) => a.updatedAt, render: (a) => <span className="text-muted">{relativeTime(a.updatedAt)}</span> },
  {
    key: 'action',
    header: '',
    align: 'right',
    render: (a) =>
    <Dropdown
      items={[
      { label: 'View details', icon: EyeIcon, onClick: () => navigate(`${portalBase}/applications/${a.id}`) },
      { label: 'Update status', icon: RefreshCwIcon, onClick: () => open(a, 'status') },
      { label: 'Request documents', icon: FileQuestionIcon, onClick: () => open(a, 'documents') },
      { label: 'Add internal note', icon: StickyNoteIcon, onClick: () => open(a, 'note') },
      { label: 'Assign / process manually', icon: UserCheckIcon, onClick: () => open(a, 'assign') }]
      }
      trigger={({ toggle, open: isOpen }) =>
      <button onClick={toggle} aria-expanded={isOpen} aria-label={`Actions for ${a.id}`} className="rounded-md p-1.5 text-muted hover:bg-canvas hover:text-ink">
              <MoreHorizontalIcon className="h-4 w-4" />
            </button>
      } />


  }];


  return (
    <div>
      <PageHeader
        title="Finance applications"
        description="All dealer applications. Statuses are recorded manually in Phase 1."
        actions={
        <Button
          variant="secondary"
          onClick={() =>
          downloadCsv('applications.csv', [
          ['Application ID', 'Dealer', 'Customer', 'Category', 'Partner', 'Amount', 'Status', 'Created', 'Updated'],
          ...rows.map((a) => [a.id, a.dealerName, a.customerName, a.category, a.partnerName, a.amount, a.status, a.createdAt.slice(0, 10), a.updatedAt.slice(0, 10)])]
          )
          }>
          
            Export CSV
          </Button>
        } />
      
      <div className="rounded-xl border border-line bg-white shadow-card">
        <div className="flex flex-col gap-2 border-b border-line p-3 xl:flex-row xl:items-center">
          <SearchInput value={q} onChange={setQ} placeholder="Search ID, customer, dealer or lender ref" className="xl:w-80" />
          <div className="flex flex-wrap gap-2">
            <MultiFilter label="Status" value={statuses} onChange={setStatuses} options={allApplicationStatuses} counts={statusCounts} />
            <FilterSelect label="Partner" value={partner} onChange={setPartner} options={partners} />
            <FilterSelect label="Category" value={category} onChange={setCategory} options={['EV', 'Electronics', 'Furniture', 'Consumer Durables']} />
            <FilterSelect label="Dealer" value={dealer} onChange={setDealer} options={dealers} />
            {activeFilters > 0 &&
            <button onClick={() => {setQ('');setStatuses([]);setPartner('');setCategory('');setDealer('');}} className="h-9 px-2 text-[13px] font-medium text-brand hover:underline">
                Clear all
              </button>
            }
          </div>
          <p className="num ml-auto whitespace-nowrap text-xs text-muted">{rows.length} of {applications.length}</p>
        </div>
        {error ?
        <ErrorState message="Applications couldn’t be loaded. Check your connection and try again." onRetry={load} /> :

        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(a) => a.id}
          loading={loading}
          dense
          onRowClick={(a) => navigate(`${portalBase}/applications/${a.id}`)}
          defaultSort={{ key: 'updated', dir: 'desc' }}
          minWidth={1180}
          empty={<EmptyState icon={FileTextIcon} title="No applications match" description="Try removing a filter or searching by application ID." />} />

        }
      </div>
      <ApplicationActions app={target} action={action} onClose={() => setAction(null)} />
    </div>);

}
