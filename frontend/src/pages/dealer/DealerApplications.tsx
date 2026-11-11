import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FileTextIcon, PlusIcon } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { buttonClasses } from '../../components/ui/Button';
import { Tabs } from '../../components/ui/Tabs';
import { SearchInput } from '../../components/ui/SearchInput';
import { FilterSelect } from '../../components/ui/FilterSelect';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { useDemoData } from '../../contexts/DemoDataContext';
import { formatDate, formatINR } from '../../utils/format';
import type { ApplicationStatus, FinanceApplication } from '../../types/finance';

const tabDefs: {id: string;label: string;statuses: ApplicationStatus[] | null;}[] = [
{ id: 'all', label: 'All', statuses: null },
{ id: 'pending', label: 'Draft & pending', statuses: ['Draft', 'Pending'] },
{ id: 'docs', label: 'Documents required', statuses: ['Documents Required'] },
{ id: 'processing', label: 'Processing', statuses: ['Processing', 'Awaiting Lender'] },
{ id: 'approved', label: 'Approved', statuses: ['Approved', 'Disbursement Pending'] },
{ id: 'disbursed', label: 'Disbursed', statuses: ['Disbursed'] },
{ id: 'closed', label: 'Rejected & cancelled', statuses: ['Rejected', 'Cancelled'] }];


export function DealerApplications() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { dealerApplications } = useDemoData();
  const [tab, setTab] = useState('all');
  const [q, setQ] = useState(params.get('q') ?? '');
  const [category, setCategory] = useState('');
  const [partner, setPartner] = useState('');
  const [type, setType] = useState('');

  const partnerNames = useMemo(() => Array.from(new Set(dealerApplications.map((a) => a.partnerName))).sort(), [dealerApplications]);
  const def = tabDefs.find((t) => t.id === tab)!;
  const rows = dealerApplications.
  filter((a) => !def.statuses || def.statuses.includes(a.status)).
  filter((a) => !category || a.category === category).
  filter((a) => !partner || a.partnerName === partner).
  filter((a) => !type || a.financeType === type).
  filter((a) => !q || `${a.id} ${a.customerName} ${a.product}`.toLowerCase().includes(q.toLowerCase()));

  const columns: Column<FinanceApplication>[] = [
  { key: 'id', header: 'Application ID', sortValue: (a) => a.id, render: (a) => <span className="num font-medium text-navy">{a.id}</span> },
  { key: 'customer', header: 'Customer', sortValue: (a) => a.customerName, render: (a) => a.customerName },
  {
    key: 'product',
    header: 'Product',
    render: (a) =>
    <div>
          <p className="max-w-[200px] truncate">{a.product}</p>
          <p className="text-xs text-muted">{a.category} · {a.financeType === 'New Loan' ? 'New loan' : 'Existing limit'}</p>
        </div>

  },
  { key: 'partner', header: 'Finance Partner', render: (a) => <span className="text-muted">{a.partnerName}</span> },
  { key: 'amount', header: 'Finance Amount', align: 'right', sortValue: (a) => a.amount, render: (a) => <span className="num font-medium">{formatINR(a.amount)}</span> },
  { key: 'status', header: 'Status', sortValue: (a) => a.status, render: (a) => <StatusBadge status={a.status} /> },
  { key: 'created', header: 'Submitted', sortValue: (a) => a.createdAt, render: (a) => <span className="num text-muted">{formatDate(a.createdAt)}</span> },
  { key: 'updated', header: 'Last update', sortValue: (a) => a.updatedAt, render: (a) => <span className="num text-muted">{formatDate(a.updatedAt)}</span> }];


  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: 'Dashboard', to: '/dealer/dashboard' }, { label: 'Finance Applications' }]}
        title="Finance applications"
        description="All applications created by your dealership."
        actions={
        <Link to="/dealer/applications/new" className={buttonClasses('primary')}>
            <PlusIcon className="h-4 w-4" /> Create Finance Application
          </Link>
        } />
      
      <div className="rounded-xl border border-line bg-white shadow-card">
        <div className="px-4 pt-2">
          <Tabs
            value={tab}
            onChange={setTab}
            tabs={tabDefs.map((t) => ({ id: t.id, label: t.label, count: dealerApplications.filter((a) => !t.statuses || t.statuses.includes(a.status)).length }))} />
          
        </div>
        <div className="flex flex-col gap-2 border-b border-line p-3 lg:flex-row lg:items-center">
          <SearchInput value={q} onChange={setQ} placeholder="Search ID, customer or product" className="lg:w-80" />
          <div className="flex flex-wrap gap-2">
            <FilterSelect label="Category" value={category} onChange={setCategory} options={['EV', 'Electronics', 'Furniture', 'Consumer Durables']} />
            <FilterSelect label="Partner" value={partner} onChange={setPartner} options={partnerNames} />
            <FilterSelect label="Type" value={type} onChange={setType} options={['New Loan', 'Existing Finance / Card Limit']} />
          </div>
        </div>
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(a) => a.id}
          onRowClick={(a) => navigate(`/dealer/applications/${a.id}`)}
          defaultSort={{ key: 'updated', dir: 'desc' }}
          minWidth={980}
          empty={
          dealerApplications.length === 0 ?
          <EmptyState icon={FileTextIcon} title="No applications yet" description="Create your first finance application to start tracking it here." action={<Link to="/dealer/applications/new" className={buttonClasses('primary', 'sm')}>Create application</Link>} /> :

          <EmptyState icon={FileTextIcon} title="No applications match" description="Try a different tab, search term or filter." />

          } />
        
      </div>
    </div>);

}