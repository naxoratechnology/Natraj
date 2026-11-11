import React, { useMemo, useState } from 'react';
import { UsersIcon } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { SearchInput } from '../../components/ui/SearchInput';
import { FilterSelect } from '../../components/ui/FilterSelect';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { useDemoData } from '../../contexts/DemoDataContext';
import { formatDate } from '../../utils/format';
import type { Customer } from '../../types/finance';

export function AdminCustomers() {
  const { customers, dealers, applications } = useDemoData();
  const [q, setQ] = useState('');
  const [dealer, setDealer] = useState('');
  const [kyc, setKyc] = useState('');
  const dealerName = (id: string) => dealers.find((d) => d.id === id)?.businessName ?? id;
  const dealerNames = useMemo(() => Array.from(new Set(customers.map((c) => dealerName(c.dealerId)))).sort(), [customers]); // eslint-disable-line react-hooks/exhaustive-deps

  const rows = customers.
  filter((c) => !dealer || dealerName(c.dealerId) === dealer).
  filter((c) => !kyc || c.kycStatus === kyc).
  filter((c) => !q || `${c.name} ${c.id} ${c.city}`.toLowerCase().includes(q.toLowerCase()));

  const columns: Column<Customer>[] = [
  { key: 'name', header: 'Customer', sortValue: (c) => c.name, render: (c) => <div><p className="font-medium text-ink">{c.name}</p><p className="num text-xs text-muted">{c.id}</p></div> },
  { key: 'dealer', header: 'Dealer', sortValue: (c) => dealerName(c.dealerId), render: (c) => <span className="text-muted">{dealerName(c.dealerId)}</span> },
  { key: 'phone', header: 'Mobile', render: (c) => <span className="num text-muted">{c.phone}</span> },
  { key: 'city', header: 'City', render: (c) => <span className="text-muted">{c.city}</span> },
  { key: 'kyc', header: 'KYC', sortValue: (c) => c.kycStatus, render: (c) => <StatusBadge status={c.kycStatus === 'Verified' ? 'Verified' : c.kycStatus} size="sm" /> },
  { key: 'apps', header: 'Applications', align: 'right', sortValue: (c) => applications.filter((a) => a.customerId === c.id).length, render: (c) => <span className="num">{applications.filter((a) => a.customerId === c.id).length}</span> },
  { key: 'added', header: 'Added', sortValue: (c) => c.createdAt, render: (c) => <span className="num text-muted">{formatDate(c.createdAt)}</span> }];


  return (
    <div>
      <PageHeader title="Customers" description="Customer records across all dealers. Identity numbers are masked; full documents require document-level access." />
      <div className="rounded-xl border border-line bg-white shadow-card">
        <div className="flex flex-col gap-2 border-b border-line p-3 lg:flex-row lg:items-center">
          <SearchInput value={q} onChange={setQ} placeholder="Search name, ID or city" className="lg:w-80" />
          <div className="flex flex-wrap gap-2">
            <FilterSelect label="Dealer" value={dealer} onChange={setDealer} options={dealerNames} />
            <FilterSelect label="KYC" value={kyc} onChange={setKyc} options={['Verified', 'Pending', 'Documents Required']} />
          </div>
          <p className="num ml-auto text-xs text-muted">{rows.length} records</p>
        </div>
        <DataTable columns={columns} rows={rows} rowKey={(c) => c.id} dense defaultSort={{ key: 'added', dir: 'desc' }} minWidth={860} empty={<EmptyState icon={UsersIcon} title="No customers found" description="Adjust the filters or search term." />} />
      </div>
    </div>);

}