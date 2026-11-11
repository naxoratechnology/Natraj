import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserPlusIcon, UsersIcon } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { SearchInput } from '../../components/ui/SearchInput';
import { FilterSelect } from '../../components/ui/FilterSelect';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { AddCustomerModal } from '../../components/dealer/AddCustomerModal';
import { useDemoData } from '../../contexts/DemoDataContext';
import { formatDate, initials } from '../../utils/format';
import type { Customer } from '../../types/finance';

export function DealerCustomers() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { dealerCustomers, dealerApplications } = useDemoData();
  const [q, setQ] = useState('');
  const [kyc, setKyc] = useState('');
  const [city, setCity] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (params.get('new') === '1') {
      setOpen(true);
      params.delete('new');
      setParams(params, { replace: true });
    }
  }, [params, setParams]);

  const appCount = (id: string) => dealerApplications.filter((a) => a.customerId === id).length;
  const cities = useMemo(() => Array.from(new Set(dealerCustomers.map((c) => c.city))).sort(), [dealerCustomers]);
  const rows = dealerCustomers.
  filter((c) => !kyc || c.kycStatus === kyc).
  filter((c) => !city || c.city === city).
  filter((c) => !q || `${c.name} ${c.id} ${c.email}`.toLowerCase().includes(q.toLowerCase()));

  const columns: Column<Customer>[] = [
  {
    key: 'name',
    header: 'Customer',
    sortValue: (c) => c.name,
    render: (c) =>
    <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-canvas text-xs font-semibold text-navy">{initials(c.name)}</span>
          <div>
            <p className="font-medium text-ink">{c.name}</p>
            <p className="num text-xs text-muted">{c.id}</p>
          </div>
        </div>

  },
  { key: 'phone', header: 'Mobile', render: (c) => <span className="num text-muted">{c.phone}</span> },
  { key: 'city', header: 'City', sortValue: (c) => c.city, render: (c) => <span className="text-muted">{c.city}</span> },
  { key: 'kyc', header: 'KYC status', sortValue: (c) => c.kycStatus, render: (c) => <StatusBadge status={c.kycStatus === 'Pending' ? 'Pending' : c.kycStatus} /> },
  { key: 'apps', header: 'Applications', align: 'right', sortValue: (c) => appCount(c.id), render: (c) => <span className="num">{appCount(c.id)}</span> },
  { key: 'added', header: 'Added', sortValue: (c) => c.createdAt, render: (c) => <span className="num text-muted">{formatDate(c.createdAt)}</span> }];


  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: 'Dashboard', to: '/dealer/dashboard' }, { label: 'Customers' }]}
        title="Customers"
        description="Customer records created by your dealership. Identity numbers are masked."
        actions={
        <Button onClick={() => setOpen(true)} icon={<UserPlusIcon className="h-4 w-4" />}>
            Add Customer
          </Button>
        } />
      
      <div className="rounded-xl border border-line bg-white shadow-card">
        <div className="flex flex-col gap-2 border-b border-line p-3 sm:flex-row sm:items-center">
          <SearchInput value={q} onChange={setQ} placeholder="Search by name, ID or email" className="sm:w-80" />
          <div className="flex flex-wrap gap-2">
            <FilterSelect label="KYC" value={kyc} onChange={setKyc} options={['Verified', 'Pending', 'Documents Required']} />
            <FilterSelect label="City" value={city} onChange={setCity} options={cities} />
          </div>
          <p className="num ml-auto text-xs text-muted">{rows.length} customers</p>
        </div>
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(c) => c.id}
          onRowClick={(c) => navigate(`/dealer/customers/${c.id}`)}
          defaultSort={{ key: 'added', dir: 'desc' }}
          empty={
          dealerCustomers.length === 0 ?
          <EmptyState icon={UsersIcon} title="No customers yet" description="Add your first customer to start creating finance applications." action={<Button onClick={() => setOpen(true)}>Add customer</Button>} /> :

          <EmptyState icon={UsersIcon} title="No matching customers" description="Try a different search term or clear the filters." />

          } />
        
      </div>
      <AddCustomerModal open={open} onClose={() => setOpen(false)} onCreated={(c) => navigate(`/dealer/customers/${c.id}`)} />
    </div>);

}