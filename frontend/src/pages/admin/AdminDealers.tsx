import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BuildingIcon } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { SearchInput } from '../../components/ui/SearchInput';
import { FilterSelect } from '../../components/ui/FilterSelect';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { ageLabel, formatDate } from '../../utils/format';
import type { Dealer, DealerStatus } from '../../types/finance';
import { listBackendDealers, toUiDealer } from '../../services/dealers';
import { useDemoData } from '../../contexts/DemoDataContext';
import { useAuth } from '../../contexts/AuthContext';

const tabs: {id: string;label: string;statuses: DealerStatus[] | null;}[] = [
{ id: 'all', label: 'All dealers', statuses: null },
{ id: 'verification', label: 'Verification queue', statuses: ['Submitted', 'Under Review', 'Documents Required', 'Agreement Pending'] },
{ id: 'active', label: 'Active', statuses: ['Active', 'Approved', 'Verified'] },
{ id: 'inactive', label: 'Suspended & rejected', statuses: ['Suspended', 'Rejected'] }];


export function AdminDealers() {
  const navigate = useNavigate();
  const { dealers: demoDealers } = useDemoData();
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const [databaseDealers, setDatabaseDealers] = useState<Dealer[]>([]);
  const [tab, setTab] = useState(params.get('view') === 'verification' ? 'verification' : 'all');
  const [q, setQ] = useState('');
  const [state, setState] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => setTab(params.get('view') === 'verification' ? 'verification' : 'all'), [params]);
  useEffect(() => { listBackendDealers().then(({ dealers: rows }) => setDatabaseDealers(rows.map(toUiDealer))).catch(() => undefined); }, []);

  const allDealers = databaseDealers.length ? databaseDealers : demoDealers;
  const portalBase = user?.role === 'super_admin' ? '/super-admin' : '/admin';

  const changeTab = (id: string) => {
    setTab(id);
    setParams(id === 'verification' ? { view: 'verification' } : {}, { replace: true });
  };

  const states = useMemo(() => Array.from(new Set(allDealers.map((d) => d.state))).sort(), [allDealers]);
  const def = tabs.find((t) => t.id === tab)!;
  const rows = allDealers.
  filter((d) => !def.statuses || def.statuses.includes(d.status)).
  filter((d) => !state || d.state === state).
  filter((d) => !status || d.status === status).
  filter((d) => !q || `${d.businessName} ${d.ownerName} ${d.id} ${d.city}`.toLowerCase().includes(q.toLowerCase()));

  const columns: Column<Dealer>[] = [
  {
    key: 'name',
    header: 'Dealer',
    sortValue: (d) => d.businessName,
    render: (d) =>
    <div>
          <p className="font-medium text-ink">{d.businessName}</p>
          <p className="num text-xs text-muted">{d.id}</p>
        </div>

  },
  { key: 'owner', header: 'Owner', render: (d) => d.ownerName },
  { key: 'category', header: 'Category', render: (d) => <span className="text-muted">{d.category}</span> },
  { key: 'location', header: 'Location', sortValue: (d) => d.state, render: (d) => <span className="text-muted">{d.city}, {d.state}</span> },
  { key: 'status', header: 'Status', sortValue: (d) => d.status, render: (d) => <StatusBadge status={d.status} size="sm" /> },
  { key: 'submitted', header: 'Submitted', sortValue: (d) => d.submittedAt, render: (d) => <span className="num text-muted">{formatDate(d.submittedAt)}</span> },
  {
    key: 'waiting',
    header: tab === 'verification' ? 'Waiting' : 'Applications',
    align: 'right',
    sortValue: (d) => tab === 'verification' ? d.submittedAt : d.applications,
    render: (d) => <span className="num">{tab === 'verification' ? ageLabel(d.history[d.history.length - 1]?.date ?? d.submittedAt) : d.applications}</span>
  }];


  return (
    <div>
      <PageHeader title={tab === 'verification' ? 'Dealer verification' : 'Dealers'} description="Review registrations, verify documents and manage dealer access." />
      <div className="rounded-xl border border-line bg-white shadow-card">
        <div className="px-4 pt-2">
          <Tabs value={tab} onChange={changeTab} tabs={tabs.map((t) => ({ id: t.id, label: t.label, count: allDealers.filter((d) => !t.statuses || t.statuses.includes(d.status)).length }))} />
        </div>
        <div className="flex flex-col gap-2 border-b border-line p-3 lg:flex-row lg:items-center">
          <SearchInput value={q} onChange={setQ} placeholder="Search dealer, owner, ID or city" className="lg:w-80" />
          <div className="flex flex-wrap gap-2">
            <FilterSelect label="State" value={state} onChange={setState} options={states} />
            <FilterSelect label="Status" value={status} onChange={setStatus} options={Array.from(new Set(allDealers.map((d) => d.status)))} />
          </div>
        </div>
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(d) => d.id}
          dense
          onRowClick={(d) => navigate(`${portalBase}/dealers/${d.id}`)}
          defaultSort={{ key: 'submitted', dir: 'desc' }}
          minWidth={900}
          empty={<EmptyState icon={BuildingIcon} title="No dealers found" description="Adjust the filters or search term." />} />
        
      </div>
    </div>);

}
