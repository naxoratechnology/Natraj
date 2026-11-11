import React, { useState } from 'react';
import { ScrollTextIcon } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { SearchInput } from '../../components/ui/SearchInput';
import { FilterSelect } from '../../components/ui/FilterSelect';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { EmptyState } from '../../components/ui/EmptyState';
import { Button } from '../../components/ui/Button';
import { auditLogs } from '../../data/adminUsers';
import { downloadCsv, formatDateTime } from '../../utils/format';

type Log = (typeof auditLogs)[number];

export function AuditLogs() {
  const [q, setQ] = useState('');
  const [module, setModule] = useState('');
  const [user, setUser] = useState('');
  const rows = auditLogs.
  filter((l) => !module || l.module === module).
  filter((l) => !user || l.user === user).
  filter((l) => !q || `${l.action} ${l.ref} ${l.user}`.toLowerCase().includes(q.toLowerCase()));

  const columns: Column<Log>[] = [
  { key: 'time', header: 'Timestamp', sortValue: (l) => l.time, render: (l) => <span className="num whitespace-nowrap text-muted">{formatDateTime(l.time)}</span> },
  { key: 'user', header: 'User', sortValue: (l) => l.user, render: (l) => <span className="font-medium">{l.user}</span> },
  { key: 'role', header: 'Role', render: (l) => <span className="text-muted">{l.role}</span> },
  { key: 'action', header: 'Action', render: (l) => l.action },
  { key: 'module', header: 'Module', sortValue: (l) => l.module, render: (l) => <span className="rounded bg-canvas px-1.5 py-0.5 text-xs text-ink">{l.module}</span> },
  { key: 'ref', header: 'Reference ID', render: (l) => <span className="num font-medium text-navy">{l.ref}</span> }];


  return (
    <div>
      <PageHeader
        title="Audit logs"
        description="An append-only record of administrative actions. Entries cannot be edited or deleted."
        actions={<Button variant="secondary" onClick={() => downloadCsv('audit-logs.csv', [['Timestamp', 'User', 'Role', 'Action', 'Module', 'Reference'], ...rows.map((l) => [l.time, l.user, l.role, l.action, l.module, l.ref])])}>Export CSV</Button>} />
      
      <div className="rounded-xl border border-line bg-white shadow-card">
        <div className="flex flex-col gap-2 border-b border-line p-3 lg:flex-row lg:items-center">
          <SearchInput value={q} onChange={setQ} placeholder="Search action, reference or user" className="lg:w-80" />
          <div className="flex flex-wrap gap-2">
            <FilterSelect label="Module" value={module} onChange={setModule} options={Array.from(new Set(auditLogs.map((l) => l.module)))} />
            <FilterSelect label="User" value={user} onChange={setUser} options={Array.from(new Set(auditLogs.map((l) => l.user)))} />
          </div>
        </div>
        <DataTable columns={columns} rows={rows} rowKey={(l) => l.id} dense defaultSort={{ key: 'time', dir: 'desc' }} minWidth={900} pageSize={12} empty={<EmptyState icon={ScrollTextIcon} title="No log entries" description="No actions match these filters." />} />
      </div>
    </div>);

}