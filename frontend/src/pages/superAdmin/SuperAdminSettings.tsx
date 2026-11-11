import React, { useState } from 'react';
import { toast } from 'sonner';
import { PageHeader } from '../../components/ui/PageHeader';
import { Panel } from '../../components/ui/Panel';
import { Switch } from '../../components/ui/Switch';
import { TextField } from '../../components/ui/TextField';
import { Field } from '../../components/ui/Field';
import { SelectInput } from '../../components/ui/SelectInput';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { brand } from '../../data/brand';
import { ApiError, changePassword } from '../../services/auth';

const integrations = [
{ name: 'Bank / NBFC lender APIs', status: 'Future Integration', note: 'Requires official partner approval, documentation and credentials.' },
{ name: 'Credit bureau checks', status: 'Future Integration', note: 'Paid third-party service — separate agreement required.' },
{ name: 'eKYC / Aadhaar verification', status: 'Future Integration', note: 'Regulated integration — separate agreement required.' },
{ name: 'eSign for agreements', status: 'Future Integration', note: 'Phase 1 uses click-through acceptance.' },
{ name: 'Email notifications', status: 'Manual', note: 'Templates configured; delivery provider set up at deployment.' }];


export function SuperAdminSettings() {
  const [org, setOrg] = useState({ name: brand.name, support: brand.supportEmail });
  const [sec, setSec] = useState({ twoFactor: true, timeout: '30', lockout: true });
  const [workflow, setWorkflow] = useState({ followUpDays: '2', requireReason: true, autoAssign: false });
  const [saving, setSaving] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [passwordErrors, setPasswordErrors] = useState<Partial<typeof passwords>>({});
  const [passwordSaving, setPasswordSaving] = useState(false);

  const updatePassword = async () => {
    const errors: Partial<typeof passwords> = {};
    if (!passwords.current) errors.current = 'Enter your current password';
    if (passwords.next.length < 8 || !/\d/.test(passwords.next)) errors.next = 'Use at least 8 characters including a number';
    if (passwords.confirm !== passwords.next) errors.confirm = 'Passwords do not match';
    setPasswordErrors(errors);
    if (Object.keys(errors).length) return;
    setPasswordSaving(true);
    try {
      await changePassword(passwords.current, passwords.next, passwords.confirm);
      setPasswords({ current: '', next: '', confirm: '' });
      toast.success('Password updated');
    } catch (error) {
      if (error instanceof ApiError) setPasswordErrors({ current: error.errors.currentPassword, next: error.errors.newPassword, confirm: error.errors.confirmPassword });
      toast.error(error instanceof ApiError ? error.message : 'Unable to update password');
    } finally { setPasswordSaving(false); }
  };

  const save = () => {
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      toast.success('Settings saved (demo)');
    }, 700);
  };

  return (
    <div className="space-y-5">
      <PageHeader title="System settings" description="Organization, security and workflow defaults. Changes are audit-logged." actions={<Button onClick={save} loading={saving}>Save settings</Button>} />
      <div className="grid gap-5 xl:grid-cols-2">
        <Panel title="Organization">
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField label="Platform name" value={org.name} onChange={(v) => setOrg({ ...org, name: v })} hint="Placeholder brand — replace before launch" />
            <TextField label="Support email" type="email" value={org.support} onChange={(v) => setOrg({ ...org, support: v })} />
          </div>
        </Panel>
        <Panel title="Security">
          <div className="space-y-5">
            <Switch checked={sec.twoFactor} onChange={(v) => setSec({ ...sec, twoFactor: v })} label="Require two-step verification for admin users" description="Enforced at login by the backend" />
            <Switch checked={sec.lockout} onChange={(v) => setSec({ ...sec, lockout: v })} label="Lock account after 5 failed sign-ins" />
            <Field label="Session timeout">
              <SelectInput value={sec.timeout} onChange={(e) => setSec({ ...sec, timeout: e.target.value })} options={[{ value: '15', label: '15 minutes' }, { value: '30', label: '30 minutes' }, { value: '60', label: '60 minutes' }]} />
            </Field>
          </div>
        </Panel>
        <Panel title="Change password">
          <div className="space-y-4">
            <TextField label="Current password" type="password" required value={passwords.current} onChange={(current) => setPasswords({ ...passwords, current })} error={passwordErrors.current} autoComplete="current-password" />
            <TextField label="New password" type="password" required value={passwords.next} onChange={(next) => setPasswords({ ...passwords, next })} error={passwordErrors.next} autoComplete="new-password" />
            <TextField label="Confirm new password" type="password" required value={passwords.confirm} onChange={(confirm) => setPasswords({ ...passwords, confirm })} error={passwordErrors.confirm} autoComplete="new-password" />
            <div className="flex justify-end"><Button onClick={updatePassword} loading={passwordSaving}>Update password</Button></div>
          </div>
        </Panel>
        <Panel title="Processing workflow">
          <div className="space-y-5">
            <Field label="Default lender follow-up interval">
              <SelectInput value={workflow.followUpDays} onChange={(e) => setWorkflow({ ...workflow, followUpDays: e.target.value })} options={['1', '2', '3', '5'].map((d) => ({ value: d, label: `${d} working day${d === '1' ? '' : 's'}` }))} />
            </Field>
            <Switch checked={workflow.requireReason} onChange={(v) => setWorkflow({ ...workflow, requireReason: v })} label="Require a reason for rejections and document requests" description="Recommended for audit and dealer clarity" />
            <Switch checked={workflow.autoAssign} onChange={(v) => setWorkflow({ ...workflow, autoAssign: v })} label="Auto-assign new applications round-robin" description="Among active Finance Operations users" />
          </div>
        </Panel>
        <Panel title="Integrations" description="Phase 1 runs on manual processing">
          <ul className="divide-y divide-line">
            {integrations.map((i) =>
            <li key={i.name} className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-ink">{i.name}</p>
                  <p className="text-xs text-muted">{i.note}</p>
                </div>
                <StatusBadge status={i.status === 'Manual' ? 'Manual' : 'Future Integration'} size="sm" />
              </li>
            )}
          </ul>
          <p className="mt-4 text-xs text-muted">Bank/NBFC APIs, credit bureau, eKYC, eSign and paid third-party integrations are outside the ₹90,000 Phase 1 scope unless separately agreed in writing.</p>
        </Panel>
      </div>
    </div>);

}
