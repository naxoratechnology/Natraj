import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FileTextIcon, PlusIcon, UserXIcon } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Panel } from '../../components/ui/Panel';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DocumentList } from '../../components/ui/DocumentList';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { EmptyState } from '../../components/ui/EmptyState';
import { buttonClasses } from '../../components/ui/Button';
import { useDemoData } from '../../contexts/DemoDataContext';
import { currentDealerUser } from '../../data/session';
import { customerDocuments } from '../../utils/documents';
import { formatDate, formatINR } from '../../utils/format';
import type { FinanceApplication } from '../../types/finance';

export function DealerCustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dealerCustomers, dealerApplications } = useDemoData();
  const customer = dealerCustomers.find((c) => c.id === id);

  if (!customer) {
    return (
      <div className="rounded-xl border border-line bg-white">
        <EmptyState
          icon={UserXIcon}
          title="Customer not found"
          description="This customer doesn’t exist or belongs to another dealer. Dealers can only view their own records."
          action={<Link to="/dealer/customers" className={buttonClasses('secondary')}>Back to customers</Link>} />
        
      </div>);

  }

  const apps = dealerApplications.filter((a) => a.customerId === customer.id);
  const disbursed = apps.filter((a) => a.status === 'Disbursed').reduce((s, a) => s + a.amount, 0);
  const active = apps.filter((a) => !['Disbursed', 'Rejected', 'Cancelled'].includes(a.status)).length;

  const columns: Column<FinanceApplication>[] = [
  { key: 'id', header: 'Application', render: (a) => <span className="num font-medium text-navy">{a.id}</span> },
  { key: 'product', header: 'Product', render: (a) => <span className="block max-w-[200px] truncate">{a.product}</span> },
  { key: 'type', header: 'Finance type', render: (a) => <span className="text-muted">{a.financeType === 'New Loan' ? 'New loan' : 'Existing limit'}</span> },
  { key: 'amount', header: 'Amount', align: 'right', sortValue: (a) => a.amount, render: (a) => <span className="num">{formatINR(a.amount)}</span> },
  { key: 'status', header: 'Status', render: (a) => <StatusBadge status={a.status} /> },
  { key: 'date', header: 'Created', sortValue: (a) => a.createdAt, render: (a) => <span className="num text-muted">{formatDate(a.createdAt)}</span> }];


  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[{ label: 'Customers', to: '/dealer/customers' }, { label: customer.name }]}
        title={customer.name}
        meta={<StatusBadge status={customer.kycStatus === 'Verified' ? 'Verified' : customer.kycStatus} />}
        description={<span className="num">{customer.id} · Added {formatDate(customer.createdAt)}</span>}
        actions={
        <Link to={`/dealer/applications/new?customer=${customer.id}`} className={buttonClasses('primary')}>
            <PlusIcon className="h-4 w-4" /> New application
          </Link>
        } />
      
      <div className="grid gap-6 xl:grid-cols-[1fr_1.8fr]">
        <div className="space-y-6">
          <Panel title="Contact details">
            <dl className="space-y-3.5 text-sm">
              {[
              ['Mobile', customer.phone],
              ['Email', customer.email],
              ['City', customer.city],
              ['PAN', `XXXXXX${customer.panLast4}`]].
              map(([k, v]) =>
              <div key={k} className="flex justify-between gap-4">
                  <dt className="text-muted">{k}</dt>
                  <dd className="num text-right font-medium text-ink">{v}</dd>
                </div>
              )}
            </dl>
            <p className="mt-4 text-xs text-muted">Identity numbers are masked. Full values are visible only on the protected documents.</p>
          </Panel>
          <Panel title="KYC documents" description="Private · access-controlled">
            <DocumentList documents={customerDocuments(customer)} viewer={currentDealerUser.name} />
          </Panel>
        </div>
        <Panel title="Application history" description="Linked applications for this customer" flush>
          <dl className="grid grid-cols-3 divide-x divide-line border-b border-line">
            {[
            ['Applications', String(apps.length)],
            ['In progress', String(active)],
            ['Disbursed (recorded)', formatINR(disbursed)]].
            map(([k, v]) =>
            <div key={k} className="px-5 py-4">
                <dt className="text-xs text-muted">{k}</dt>
                <dd className="num mt-1 text-lg font-semibold text-ink">{v}</dd>
              </div>
            )}
          </dl>
          <DataTable
            columns={columns}
            rows={apps}
            rowKey={(a) => a.id}
            onRowClick={(a) => navigate(`/dealer/applications/${a.id}`)}
            minWidth={680}
            empty={
            <EmptyState
              icon={FileTextIcon}
              title="No applications yet"
              description="Create the first finance application for this customer."
              action={<Link to={`/dealer/applications/new?customer=${customer.id}`} className={buttonClasses('secondary', 'sm')}>Create application</Link>} />

            } />
          
        </Panel>
      </div>
    </div>);

}