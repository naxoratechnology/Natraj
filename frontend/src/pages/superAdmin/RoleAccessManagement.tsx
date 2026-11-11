import React, { useEffect, useMemo, useState } from 'react';
import { MoreHorizontalIcon, PencilIcon, PlusIcon, ShieldCheckIcon, UserPlusIcon } from 'lucide-react';
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
import { inputClass } from '../../components/ui/Field';
import { assignAdminRole, createAccessRole, createAdminAccount, listAccessRoles, listAdminAccounts, setAccessRoleStatus, setAdminAccountStatus, updateAccessRole, type AccessRole, type AdminAccount } from '../../services/adminUsers';
import { initials, relativeTime } from '../../utils/format';

const modules = [
  ['dashboard', 'Dashboard', 'Operations overview and metrics'], ['dealers', 'Dealers & verification', 'Dealer profiles, documents and approval'],
  ['customers', 'Customers', 'Customer records and KYC'], ['applications', 'Finance applications', 'Application and case details'],
  ['manual_processing', 'Manual processing', 'Processing queue and case actions'], ['finance_partners', 'Finance partners', 'Partner configuration'],
  ['commissions', 'Commission & payouts', 'Commission rules and payouts'], ['reports', 'Reports', 'Operational and finance reports'],
  ['notifications', 'Notifications', 'Notification center'], ['support', 'Support tickets', 'Dealer support conversations'],
  ['audit_logs', 'Audit logs', 'Administrative activity records']
] as const;

const blankRole = { name: '', description: '', permissions: ['dashboard'] as string[] };

export function RoleAccessManagement() {
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [roles, setRoles] = useState<AccessRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('admins');
  const [q, setQ] = useState('');
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminForm, setAdminForm] = useState({ name: '', email: '', password: '', roleId: '' });
  const [editingRole, setEditingRole] = useState<AccessRole | null>(null);
  const [roleOpen, setRoleOpen] = useState(false);
  const [roleForm, setRoleForm] = useState(blankRole);
  const [assigning, setAssigning] = useState<AdminAccount | null>(null);
  const [assignmentRoleId, setAssignmentRoleId] = useState('');
  const [statusAdmin, setStatusAdmin] = useState<AdminAccount | null>(null);
  const [statusRole, setStatusRole] = useState<AccessRole | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    try { const [adminResult, roleResult] = await Promise.all([listAdminAccounts(), listAccessRoles()]); setAdmins(adminResult.users); setRoles(roleResult.roles); }
    catch (reason) { toast.error(reason instanceof Error ? reason.message : 'Unable to load access controls'); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);
  const activeRoles = roles.filter((role) => role.active);
  const rows = useMemo(() => admins.filter((admin) => !q || `${admin.name} ${admin.email} ${admin.accessRole?.name || ''}`.toLowerCase().includes(q.toLowerCase())), [admins, q]);

  const togglePermission = (permission: string) => setRoleForm((current) => ({ ...current, permissions: current.permissions.includes(permission) ? current.permissions.filter((item) => item !== permission) : [...current.permissions, permission] }));
  const permissionGrid = <div className="grid gap-2 sm:grid-cols-2">{modules.map(([id, label, description]) => <label key={id} className={`flex gap-3 rounded-xl border p-3 ${roleForm.permissions.includes(id) ? 'border-brand-200 bg-brand-50/60' : 'border-line'}`}><input type="checkbox" checked={roleForm.permissions.includes(id)} disabled={id === 'dashboard'} onChange={() => togglePermission(id)} className="mt-0.5 h-4 w-4 accent-brand" /><span><span className="block text-sm font-medium text-ink">{label}{id === 'dashboard' && <span className="ml-1 text-[10px] text-muted">Required</span>}</span><span className="block text-xs text-muted">{description}</span></span></label>)}</div>;

  const saveRole = async () => {
    if (!roleForm.name.trim()) return setError('Enter a role name');
    setSaving(true); setError('');
    try { const result = editingRole ? await updateAccessRole(editingRole.id, roleForm) : await createAccessRole(roleForm); setRoles((current) => editingRole ? current.map((role) => role.id === result.role.id ? result.role : role) : [...current, result.role]); setRoleOpen(false); setEditingRole(null); setRoleForm(blankRole); toast.success(result.message); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to save role'); }
    finally { setSaving(false); }
  };
  const createAdmin = async () => {
    if (!adminForm.name.trim() || !adminForm.email.trim() || adminForm.password.length < 8 || !adminForm.roleId) return setError('Enter all administrator details and select a role.');
    setSaving(true); setError('');
    try { const result = await createAdminAccount(adminForm); setAdmins((current) => [...current, result.user]); setRoles((current) => current.map((role) => role.id === result.user.accessRole?.id ? { ...role, assignedUsers: role.assignedUsers + 1 } : role)); setAdminOpen(false); setAdminForm({ name: '', email: '', password: '', roleId: '' }); toast.success(result.message); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to create administrator'); }
    finally { setSaving(false); }
  };
  const saveAssignment = async () => {
    if (!assigning || !assignmentRoleId) return;
    setSaving(true);
    try { const result = await assignAdminRole(assigning.id, assignmentRoleId); setAdmins((current) => current.map((admin) => admin.id === result.user.id ? result.user : admin)); setAssigning(null); await load(); toast.success(result.message); }
    catch (reason) { toast.error(reason instanceof Error ? reason.message : 'Unable to assign role'); }
    finally { setSaving(false); }
  };

  const adminColumns: Column<AdminAccount>[] = [
    { key: 'name', header: 'Administrator', render: (admin) => <div className="flex items-center gap-3"><span className="flex h-8 w-8 items-center justify-center rounded-md bg-canvas text-xs font-semibold text-navy">{initials(admin.name)}</span><div><p className="font-medium text-ink">{admin.name}</p><p className="text-xs text-muted">{admin.email}</p></div></div> },
    { key: 'role', header: 'Assigned role', render: (admin) => admin.accessRole ? <span className="rounded bg-brand-50 px-2 py-1 text-xs font-medium text-brand-700">{admin.accessRole.name}</span> : <span className="text-xs text-danger-700">No role assigned</span> },
    { key: 'access', header: 'Access', render: (admin) => <span className="text-muted">{admin.permissions.length} modules</span> },
    { key: 'status', header: 'Status', render: (admin) => <StatusBadge status={admin.active ? 'Active' : 'Inactive'} size="sm" /> },
    { key: 'updated', header: 'Updated', render: (admin) => <span className="text-muted">{relativeTime(admin.updatedAt)}</span> },
    { key: 'actions', header: '', align: 'right', render: (admin) => <Dropdown items={[{ label: 'Assign role', onClick: () => { setAssigning(admin); setAssignmentRoleId(admin.accessRole?.id || ''); } }, { label: admin.active ? 'Deactivate administrator' : 'Activate administrator', onClick: () => setStatusAdmin(admin), danger: admin.active }]} trigger={({ toggle }) => <button onClick={toggle} className="rounded-md p-1.5 text-muted hover:bg-canvas"><MoreHorizontalIcon className="h-4 w-4" /></button>} /> }
  ];

  const changeAdminStatus = async () => { if (!statusAdmin) return; try { const result = await setAdminAccountStatus(statusAdmin.id, !statusAdmin.active); setAdmins((current) => current.map((admin) => admin.id === result.user.id ? result.user : admin)); toast.success(result.message); } catch (reason) { toast.error(reason instanceof Error ? reason.message : 'Unable to update administrator'); } finally { setStatusAdmin(null); } };
  const changeRoleStatus = async () => { if (!statusRole) return; try { const result = await setAccessRoleStatus(statusRole.id, !statusRole.active); setRoles((current) => current.map((role) => role.id === result.role.id ? result.role : role)); toast.success(result.message); } catch (reason) { toast.error(reason instanceof Error ? reason.message : 'Unable to update role'); } finally { setStatusRole(null); } };

  return <div className="space-y-4"><PageHeader title="Roles & access control" description="Create reusable roles, define module access and assign one role to each administrator." actions={tab === 'admins' ? <Button onClick={() => { setError(''); setAdminOpen(true); }} icon={<UserPlusIcon className="h-4 w-4" />}>Add administrator</Button> : <Button onClick={() => { setEditingRole(null); setRoleForm(blankRole); setError(''); setRoleOpen(true); }} icon={<PlusIcon className="h-4 w-4" />}>Create role</Button>} />
    <div className="rounded-xl border border-line bg-white shadow-card"><div className="px-4 pt-2"><Tabs value={tab} onChange={setTab} tabs={[{ id: 'admins', label: 'Administrators', count: admins.length }, { id: 'roles', label: 'Roles & access', count: roles.length }]} /></div>
      {tab === 'admins' ? <><div className="border-b border-line p-3"><SearchInput value={q} onChange={setQ} placeholder="Search administrator or role" className="sm:w-80" /></div><DataTable columns={adminColumns} rows={rows} rowKey={(admin) => admin.id} dense minWidth={900} loading={loading} /></> : <div className="grid gap-4 p-4 lg:grid-cols-2">{roles.map((role) => <article key={role.id} className="rounded-xl border border-line p-4"><div className="flex items-start gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand"><ShieldCheckIcon className="h-4 w-4" /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-ink">{role.name}</h3><StatusBadge status={role.active ? 'Active' : 'Inactive'} size="sm" /></div><p className="mt-1 text-xs text-muted">{role.description || 'No description provided'}</p></div></div><div className="mt-4 flex flex-wrap gap-1.5">{role.permissions.map((permission) => <span key={permission} className="rounded bg-canvas px-2 py-1 text-[11px] text-ink">{modules.find(([id]) => id === permission)?.[1] || permission}</span>)}</div><div className="mt-4 flex items-center justify-between border-t border-line pt-3"><span className="text-xs text-muted">{role.assignedUsers} assigned administrator{role.assignedUsers === 1 ? '' : 's'}</span><div className="flex gap-2"><Button size="sm" variant="secondary" onClick={() => { setEditingRole(role); setRoleForm({ name: role.name, description: role.description, permissions: role.permissions }); setError(''); setRoleOpen(true); }} icon={<PencilIcon className="h-3.5 w-3.5" />}>Edit</Button><Button size="sm" variant="ghost" onClick={() => setStatusRole(role)}>{role.active ? 'Disable' : 'Enable'}</Button></div></div></article>)}{!loading && roles.length === 0 && <div className="col-span-full py-12 text-center text-sm text-muted">Create your first access role before adding administrators.</div>}</div>}
    </div>
    <Modal open={adminOpen} onClose={() => setAdminOpen(false)} title="Add administrator" description="Create an admin account and assign one access role." footer={<><Button variant="secondary" onClick={() => setAdminOpen(false)}>Cancel</Button><Button onClick={createAdmin} loading={saving}>Add administrator</Button></>}><div className="space-y-4"><TextField label="Full name" required value={adminForm.name} onChange={(name) => setAdminForm({ ...adminForm, name })} /><TextField label="Email address" required type="email" value={adminForm.email} onChange={(email) => setAdminForm({ ...adminForm, email })} /><TextField label="Temporary password" required type="password" showPasswordToggle value={adminForm.password} onChange={(password) => setAdminForm({ ...adminForm, password })} /><label className="block text-sm font-medium text-ink">Access role <span className="text-danger">*</span><select value={adminForm.roleId} onChange={(event) => setAdminForm({ ...adminForm, roleId: event.target.value })} className={inputClass(false, 'mt-1.5')}><option value="">Select a role</option>{activeRoles.map((role) => <option key={role.id} value={role.id}>{role.name} · {role.permissions.length} modules</option>)}</select></label>{error && <p className="text-sm text-danger-700">{error}</p>}</div></Modal>
    <Modal open={roleOpen} onClose={() => setRoleOpen(false)} title={editingRole ? 'Edit access role' : 'Create access role'} description="Every assigned administrator inherits these module permissions." size="lg" footer={<><Button variant="secondary" onClick={() => setRoleOpen(false)}>Cancel</Button><Button onClick={saveRole} loading={saving}>{editingRole ? 'Save role' : 'Create role'}</Button></>}><div className="space-y-5"><div className="grid gap-4 sm:grid-cols-2"><TextField label="Role name" required value={roleForm.name} onChange={(name) => setRoleForm({ ...roleForm, name })} placeholder="e.g. Verification Manager" /><TextField label="Description" value={roleForm.description} onChange={(description) => setRoleForm({ ...roleForm, description })} placeholder="What this role is responsible for" /></div><div><p className="mb-2 text-sm font-semibold text-ink">Module access</p>{permissionGrid}</div>{error && <p className="text-sm text-danger-700">{error}</p>}</div></Modal>
    <Modal open={!!assigning} onClose={() => setAssigning(null)} title={`Assign role · ${assigning?.name || ''}`} description="The administrator will inherit the selected role's access and be signed out." footer={<><Button variant="secondary" onClick={() => setAssigning(null)}>Cancel</Button><Button onClick={saveAssignment} loading={saving}>Assign role</Button></>}><label className="block text-sm font-medium text-ink">Access role<select value={assignmentRoleId} onChange={(event) => setAssignmentRoleId(event.target.value)} className={inputClass(false, 'mt-1.5')}><option value="">Select a role</option>{activeRoles.map((role) => <option key={role.id} value={role.id}>{role.name} · {role.permissions.length} modules</option>)}</select></label></Modal>
    <ConfirmDialog open={!!statusAdmin} onClose={() => setStatusAdmin(null)} title={`${statusAdmin?.active ? 'Deactivate' : 'Activate'} administrator?`} description={statusAdmin?.active ? 'Their active sessions will be revoked immediately.' : 'They will be able to sign in with their assigned role.'} confirmLabel={statusAdmin?.active ? 'Deactivate' : 'Activate'} tone={statusAdmin?.active ? 'danger' : 'primary'} onConfirm={() => void changeAdminStatus()} />
    <ConfirmDialog open={!!statusRole} onClose={() => setStatusRole(null)} title={`${statusRole?.active ? 'Disable' : 'Enable'} role?`} description={statusRole?.active ? 'A role assigned to active administrators cannot be disabled.' : 'This role can be assigned to administrators again.'} confirmLabel={statusRole?.active ? 'Disable role' : 'Enable role'} tone={statusRole?.active ? 'danger' : 'primary'} onConfirm={() => void changeRoleStatus()} />
  </div>;
}
