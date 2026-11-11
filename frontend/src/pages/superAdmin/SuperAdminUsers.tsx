import React, { useEffect, useMemo, useState } from 'react';
import { MoreHorizontalIcon, ShieldCheckIcon, UserPlusIcon } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { Button } from '../../components/ui/Button';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Dropdown } from '../../components/ui/Dropdown';
import { SearchInput } from '../../components/ui/SearchInput';
import { Modal } from '../../components/ui/Modal';
import { TextField } from '../../components/ui/TextField';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useAuth } from '../../contexts/AuthContext';
import { createAdminAccount, listAdminAccounts, setAdminAccountStatus, updateAdminAccountPermissions, type AdminAccount } from '../../services/adminUsers';
import { initials, relativeTime } from '../../utils/format';

const responsibilities = [
  { area: 'Admin account creation and deactivation', superAdmin: 'Full control', admin: 'No access' },
  { area: 'Platform settings and role governance', superAdmin: 'Full control', admin: 'No access' },
  { area: 'Dealer verification and activation', superAdmin: 'Full control', admin: 'Only when assigned' },
  { area: 'Finance applications and manual processing', superAdmin: 'Full oversight', admin: 'Only when assigned' },
  { area: 'Reports, support and audit review', superAdmin: 'Full oversight', admin: 'Only when assigned' }
];
const modules = [
  { id: 'dashboard', label: 'Dashboard', description: 'Operations overview and platform metrics', required: true },
  { id: 'dealers', label: 'Dealers & verification', description: 'Dealer profiles, documents, approval and activation' },
  { id: 'customers', label: 'Customers', description: 'Customer records and KYC information' },
  { id: 'applications', label: 'Finance applications', description: 'Applications and case details' },
  { id: 'manual_processing', label: 'Manual processing', description: 'Finance processing queue and status actions' },
  { id: 'finance_partners', label: 'Finance partners', description: 'Available lender and partner configuration' },
  { id: 'commissions', label: 'Commission & payouts', description: 'Commission rules and payout records' },
  { id: 'reports', label: 'Reports', description: 'Operational and financial reports' },
  { id: 'notifications', label: 'Notifications', description: 'Platform notification center' },
  { id: 'support', label: 'Support tickets', description: 'Dealer support conversations' },
  { id: 'audit_logs', label: 'Audit logs', description: 'Administrative activity records' }
];

export function SuperAdminUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState<AdminAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('users');
  const [q, setQ] = useState('');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [selected, setSelected] = useState<AdminAccount | null>(null);
  const [accessEditor, setAccessEditor] = useState<AdminAccount | null>(null);
  const [accessPermissions, setAccessPermissions] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', permissions: ['dashboard'] });
  const [error, setError] = useState('');

  const load = () => listAdminAccounts().then(({ users: result }) => setUsers(result)).catch((reason) => toast.error(reason instanceof Error ? reason.message : 'Unable to load administrators')).finally(() => setLoading(false));
  useEffect(() => { void load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const rows = useMemo(() => users.filter((account) => !q || `${account.name} ${account.email}`.toLowerCase().includes(q.toLowerCase())), [q, users]);

  const create = async () => {
    if (!form.name.trim() || !form.email.trim() || form.password.length < 8) return setError('Enter a name, valid email and a password of at least 8 characters.');
    setSaving(true); setError('');
    try { const result = await createAdminAccount(form); setUsers((current) => [...current, result.user]); setInviteOpen(false); setForm({ name: '', email: '', password: '', permissions: ['dashboard'] }); toast.success(result.message); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to create administrator'); }
    finally { setSaving(false); }
  };
  const saveAccess = async () => {
    if (!accessEditor) return;
    setSaving(true);
    try { const result = await updateAdminAccountPermissions(accessEditor.id, accessPermissions); setUsers((current) => current.map((account) => account.id === result.user.id ? result.user : account)); setAccessEditor(null); toast.success(result.message); }
    catch (reason) { toast.error(reason instanceof Error ? reason.message : 'Unable to update access controls'); }
    finally { setSaving(false); }
  };
  const togglePermission = (permissions: string[], setPermissions: (value: string[]) => void, permission: string) => setPermissions(permissions.includes(permission) ? permissions.filter((item) => item !== permission) : [...permissions, permission]);
  const accessGrid = (permissions: string[], setPermissions: (value: string[]) => void) => <div className="grid gap-2 sm:grid-cols-2">{modules.map((module) => <label key={module.id} className={`flex cursor-pointer gap-3 rounded-xl border p-3 transition ${permissions.includes(module.id) ? 'border-brand-200 bg-brand-50/60' : 'border-line bg-white hover:border-brand-100'} ${module.required ? 'cursor-default' : ''}`}><input type="checkbox" checked={permissions.includes(module.id)} disabled={module.required} onChange={() => togglePermission(permissions, setPermissions, module.id)} className="mt-0.5 h-4 w-4 accent-brand" /><span><span className="block text-sm font-medium text-ink">{module.label}{module.required && <span className="ml-1 text-[10px] text-muted">Required</span>}</span><span className="mt-0.5 block text-xs leading-relaxed text-muted">{module.description}</span></span></label>)}</div>;
  const changeStatus = async () => {
    if (!selected) return;
    try { const result = await setAdminAccountStatus(selected.id, !selected.active); setUsers((current) => current.map((account) => account.id === result.user.id ? result.user : account)); toast.success(result.message); }
    catch (reason) { toast.error(reason instanceof Error ? reason.message : 'Unable to update administrator'); }
    finally { setSelected(null); }
  };

  const columns: Column<AdminAccount>[] = [
    { key: 'name', header: 'Administrator', render: (account) => <div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-md bg-canvas text-xs font-semibold text-navy">{initials(account.name)}</span><div><p className="font-medium text-ink">{account.name}{account.id === user?.id && <span className="ml-1.5 text-xs font-normal text-muted">(you)</span>}</p><p className="text-xs text-muted">{account.email}</p></div></div> },
    { key: 'role', header: 'Role', render: () => 'Admin' },
    { key: 'access', header: 'Module access', render: (account) => <span className="text-muted">{account.role === 'super_admin' ? 'All modules' : `${account.permissions?.length || 0} modules`}</span> },
    { key: 'status', header: 'Status', render: (account) => <StatusBadge status={account.active ? 'Active' : 'Inactive'} size="sm" /> },
    { key: 'updated', header: 'Last updated', render: (account) => <span className="text-muted">{relativeTime(account.updatedAt)}</span> },
    { key: 'actions', header: '', align: 'right', render: (account) => account.role === 'admin' ? <Dropdown items={[{ label: 'Edit module access', onClick: () => { setAccessEditor(account); setAccessPermissions(account.permissions?.length ? account.permissions : ['dashboard']); } }, { label: account.active ? 'Deactivate administrator' : 'Activate administrator', onClick: () => setSelected(account), danger: account.active }]} trigger={({ toggle }) => <button onClick={toggle} className="rounded-md p-1.5 text-muted hover:bg-canvas" aria-label={`Actions for ${account.name}`}><MoreHorizontalIcon className="h-4 w-4" /></button>} /> : <span className="inline-flex items-center gap-1 text-xs text-muted"><ShieldCheckIcon className="h-3.5 w-3.5" /> Full access</span> }
  ];

  return <div className="space-y-4">
    <PageHeader title="Admin users & access control" description="All staff have the fixed Admin role. Control only the modules each admin can access." actions={<Button onClick={() => setInviteOpen(true)} icon={<UserPlusIcon className="h-4 w-4" />}>Create administrator</Button>} />
    <div className="rounded-xl border border-line bg-white shadow-card">
      <div className="px-4 pt-2"><Tabs value={tab} onChange={setTab} tabs={[{ id: 'users', label: 'Administrators', count: users.length }]} /></div>
      {tab === 'users' ? <><div className="border-b border-line p-3"><SearchInput value={q} onChange={setQ} placeholder="Search administrators" className="sm:w-80" /></div><DataTable columns={columns} rows={rows} rowKey={(account) => account.id} dense minWidth={760} loading={loading} /></> : <div className="overflow-x-auto p-4"><table className="w-full min-w-[680px] text-[13px]"><thead><tr className="border-b border-line bg-canvas"><th className="px-4 py-3 text-left text-xs text-muted">Responsibility</th><th className="px-4 py-3 text-left text-xs text-muted">Super Admin</th><th className="px-4 py-3 text-left text-xs text-muted">Operations Admin</th></tr></thead><tbody>{responsibilities.map((row) => <tr key={row.area} className="border-b border-line last:border-0"><td className="px-4 py-3 font-medium text-ink">{row.area}</td><td className="px-4 py-3 text-success">{row.superAdmin}</td><td className="px-4 py-3 text-muted">{row.admin}</td></tr>)}</tbody></table></div>}
    </div>
    <Modal open={inviteOpen} onClose={() => setInviteOpen(false)} title="Create administrator" description="The role is fixed as Admin. Choose exactly which modules this admin can access." size="lg" footer={<><Button variant="secondary" onClick={() => setInviteOpen(false)}>Cancel</Button><Button onClick={create} loading={saving}>Create administrator</Button></>}><div className="space-y-5"><div className="grid gap-4 sm:grid-cols-2"><TextField label="Full name" required value={form.name} onChange={(name) => setForm({ ...form, name })} /><TextField label="Email address" required type="email" value={form.email} onChange={(email) => setForm({ ...form, email })} /></div><TextField label="Temporary password" required type="password" showPasswordToggle value={form.password} onChange={(password) => setForm({ ...form, password })} hint="The administrator should change this after signing in." /><div><p className="mb-2 text-sm font-semibold text-ink">Module access</p>{accessGrid(form.permissions, (permissions) => setForm({ ...form, permissions }))}</div>{error && <p className="text-sm text-danger-700">{error}</p>}</div></Modal>
    <Modal open={!!accessEditor} onClose={() => setAccessEditor(null)} title={`Access controls · ${accessEditor?.name || ''}`} description="Only selected modules will appear and be accessible to this administrator." size="lg" footer={<><Button variant="secondary" onClick={() => setAccessEditor(null)}>Cancel</Button><Button onClick={saveAccess} loading={saving}>Save access</Button></>}><div><div className="mb-4 rounded-lg bg-warning-50 p-3 text-xs text-warning-700">Saving changes signs this administrator out so the new access controls apply immediately.</div>{accessGrid(accessPermissions, setAccessPermissions)}</div></Modal>
    <ConfirmDialog open={!!selected} onClose={() => setSelected(null)} title={`${selected?.active ? 'Deactivate' : 'Activate'} administrator?`} description={selected?.active ? 'Their active sessions will be revoked immediately.' : 'They will be able to sign in and access operations again.'} confirmLabel={selected?.active ? 'Deactivate' : 'Activate'} tone={selected?.active ? 'danger' : 'primary'} onConfirm={() => void changeStatus()} />
  </div>;
}
