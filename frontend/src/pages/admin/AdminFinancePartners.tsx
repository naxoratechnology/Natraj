import React, { useState } from 'react';
import { PencilIcon, PlusIcon } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Drawer } from '../../components/ui/Drawer';
import { Switch } from '../../components/ui/Switch';
import { DemoNotice } from '../../components/ui/DemoNotice';
import { PartnerFormModal } from '../../components/admin/PartnerFormModal';
import { useDemoData } from '../../contexts/DemoDataContext';
import { formatINR } from '../../utils/format';
import type { FinancePartner } from '../../types/finance';

export function AdminFinancePartners() {
  const { partners, applications, savePartner } = useDemoData();
  const [detailId, setDetailId] = useState<string | null>(null);
  const [editing, setEditing] = useState<FinancePartner | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const detail = partners.find((p) => p.id === detailId) ?? null;

  const stats = (id: string) => {
    const list = applications.filter((a) => a.partnerId === id);
    return {
      total: list.length,
      open: list.filter((a) => !['Disbursed', 'Rejected', 'Cancelled'].includes(a.status)).length,
      disbursed: list.filter((a) => a.status === 'Disbursed').reduce((s, a) => s + a.amount, 0)
    };
  };

  const columns: Column<FinancePartner>[] = [
  { key: 'name', header: 'Partner', sortValue: (p) => p.name, render: (p) => <div><p className="font-medium text-ink">{p.name}</p><p className="num text-xs text-muted">{p.id} · Demo</p></div> },
  { key: 'type', header: 'Type', sortValue: (p) => p.type, render: (p) => <span className="text-muted">{p.type}</span> },
  { key: 'categories', header: 'Categories', render: (p) => <span className="block max-w-[220px] truncate text-muted">{p.categories.join(', ')}</span> },
  { key: 'types', header: 'Finance types', render: (p) => <span className="text-muted">{p.financeTypes.map((t) => t === 'New Loan' ? 'New loan' : 'Existing limit').join(', ')}</span> },
  { key: 'mode', header: 'Processing mode', render: (p) => <StatusBadge status={p.mode} size="sm" /> },
  { key: 'priority', header: 'Priority', align: 'right', sortValue: (p) => p.priority, render: (p) => <span className="num">{p.priority}</span> },
  { key: 'open', header: 'Open cases', align: 'right', sortValue: (p) => stats(p.id).open, render: (p) => <span className="num">{stats(p.id).open}</span> },
  { key: 'status', header: 'Status', render: (p) => <StatusBadge status={p.active ? 'Active' : 'Inactive'} size="sm" /> }];


  return (
    <div>
      <PageHeader
        title="Finance partners"
        description="Configure partners, the categories and finance types they accept, and how cases reach them."
        actions={<Button onClick={() => {setEditing(null);setFormOpen(true);}} icon={<PlusIcon className="h-4 w-4" />}>Add partner</Button>} />
      
      <DemoNotice className="mb-4" tone="warning">
        No partner currently has an active official API. “Official API — configured” should only be used once a partner has formally approved access and credentials are set up server-side — this is outside the Phase 1 scope unless agreed in writing.
      </DemoNotice>
      <div className="rounded-xl border border-line bg-white shadow-card">
        <DataTable columns={columns} rows={partners} rowKey={(p) => p.id} dense onRowClick={(p) => setDetailId(p.id)} defaultSort={{ key: 'priority', dir: 'asc' }} minWidth={1000} />
      </div>

      <Drawer
        open={!!detail}
        onClose={() => setDetailId(null)}
        title={detail?.name ?? ''}
        subtitle={detail ? `${detail.type} · ${detail.id}` : ''}
        footer={detail && <Button variant="secondary" className="w-full" icon={<PencilIcon className="h-4 w-4" />} onClick={() => {setEditing(detail);setFormOpen(true);}}>Edit partner</Button>}>
        
        {detail &&
        <div className="space-y-6">
            <div className="grid grid-cols-3 divide-x divide-line rounded-lg border border-line">
              {[['Total cases', String(stats(detail.id).total)], ['Open', String(stats(detail.id).open)], ['Disbursed', formatINR(stats(detail.id).disbursed)]].map(([k, v]) =>
            <div key={k} className="px-3 py-2.5">
                  <p className="text-[11px] text-muted">{k}</p>
                  <p className="num text-sm font-semibold text-ink">{v}</p>
                </div>
            )}
            </div>
            <Switch
            checked={detail.active}
            onChange={(v) => {savePartner({ ...detail, active: v });toast.success(v ? 'Partner activated' : 'Partner deactivated');}}
            label="Accepting new applications"
            description="Existing cases continue to be processed either way" />
          
            <dl className="space-y-4 text-sm">
              <div><dt className="text-xs text-muted">Processing mode</dt><dd className="mt-1"><StatusBadge status={detail.mode} /></dd></div>
              <div><dt className="text-xs text-muted">Supported categories</dt><dd className="mt-1 text-ink">{detail.categories.join(', ')}</dd></div>
              <div><dt className="text-xs text-muted">Supported finance types</dt><dd className="mt-1 text-ink">{detail.financeTypes.join(', ')}</dd></div>
              <div><dt className="text-xs text-muted">Priority</dt><dd className="num mt-1 text-ink">{detail.priority}</dd></div>
              <div><dt className="text-xs text-muted">Internal notes</dt><dd className="mt-1 leading-relaxed text-ink">{detail.notes || '—'}</dd></div>
              <div><dt className="text-xs text-muted">Credentials</dt><dd className="mt-1 text-muted">Not shown in the UI · managed in secure server configuration</dd></div>
            </dl>
          </div>
        }
      </Drawer>
      <PartnerFormModal open={formOpen} partner={editing} onClose={() => setFormOpen(false)} />
    </div>);

}