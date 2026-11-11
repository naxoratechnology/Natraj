import React, { useState } from 'react';
import { toast } from 'sonner';
import { PageHeader } from '../../components/ui/PageHeader';
import { Panel } from '../../components/ui/Panel';
import { TextField } from '../../components/ui/TextField';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { ApiError, changePassword } from '../../services/auth';

export function AdminAccount() {
  const { user } = useAuth();
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    const nextErrors: typeof errors = {};
    if (!form.current) nextErrors.current = 'Enter your current password';
    if (form.next.length < 8 || !/\d/.test(form.next)) nextErrors.next = 'Use at least 8 characters including a number';
    if (form.confirm !== form.next) nextErrors.confirm = 'Passwords do not match';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setSaving(true);
    try {
      await changePassword(form.current, form.next, form.confirm);
      setForm({ current: '', next: '', confirm: '' });
      toast.success('Password updated');
    } catch (error) {
      if (error instanceof ApiError) setErrors({ current: error.errors.currentPassword, next: error.errors.newPassword, confirm: error.errors.confirmPassword });
      toast.error(error instanceof Error ? error.message : 'Unable to update password');
    } finally { setSaving(false); }
  };

  return <div className="space-y-5">
    <PageHeader title="My account" description="Your administrator identity and security settings." />
    <div className="grid gap-5 xl:grid-cols-2">
      <Panel title="Account information"><dl className="space-y-4 text-sm">
        <div><dt className="text-xs text-muted">Name</dt><dd className="mt-1 font-medium text-ink">{user?.name}</dd></div>
        <div><dt className="text-xs text-muted">Email</dt><dd className="mt-1 font-medium text-ink">{user?.email}</dd></div>
        <div><dt className="text-xs text-muted">Role</dt><dd className="mt-1 font-medium text-ink">{user?.role === 'super_admin' ? 'Super Admin' : 'Operations Admin'}</dd></div>
      </dl></Panel>
      <Panel title="Change password"><div className="space-y-4">
        <TextField label="Current password" type="password" showPasswordToggle value={form.current} onChange={(current) => setForm({ ...form, current })} error={errors.current} autoComplete="current-password" />
        <TextField label="New password" type="password" showPasswordToggle value={form.next} onChange={(next) => setForm({ ...form, next })} error={errors.next} autoComplete="new-password" />
        <TextField label="Confirm new password" type="password" showPasswordToggle value={form.confirm} onChange={(confirm) => setForm({ ...form, confirm })} error={errors.confirm} autoComplete="new-password" />
        <div className="flex justify-end"><Button onClick={submit} loading={saving}>Update password</Button></div>
      </div></Panel>
    </div>
  </div>;
}
