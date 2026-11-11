import React, { useState } from 'react';
import { MonitorIcon, SmartphoneIcon } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '../../components/ui/PageHeader';
import { Panel } from '../../components/ui/Panel';
import { Switch } from '../../components/ui/Switch';
import { TextField } from '../../components/ui/TextField';
import { Button } from '../../components/ui/Button';
import { AccountTabs } from '../../components/dealer/AccountTabs';
import { ApiError, changePassword } from '../../services/auth';

export function DealerSettings() {
  const [prefs, setPrefs] = useState({ status: true, documents: true, support: true, digest: false, sms: false });
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [errors, setErrors] = useState<Partial<typeof pw>>({});
  const [saving, setSaving] = useState(false);

  const setPref = (k: keyof typeof prefs) => (v: boolean) => {
    setPrefs((p) => ({ ...p, [k]: v }));
    toast.success('Preference updated');
  };

  const handleChangePassword = async () => {
    const e: Partial<typeof pw> = {};
    if (!pw.current) e.current = 'Enter your current password';
    if (pw.next.length < 8 || !/\d/.test(pw.next)) e.next = 'Use at least 8 characters including a number';
    if (pw.confirm !== pw.next) e.confirm = 'Passwords do not match';
    setErrors(e);
    if (Object.keys(e).length) return;
    setSaving(true);
    try {
      await changePassword(pw.current, pw.next, pw.confirm);
      setSaving(false);
      setPw({ current: '', next: '', confirm: '' });
      toast.success('Password updated');
    } catch (error) {
      if (error instanceof ApiError) setErrors({ current: error.errors.currentPassword, next: error.errors.newPassword, confirm: error.errors.confirmPassword });
      toast.error(error instanceof ApiError ? error.message : 'Unable to update password');
    } finally { setSaving(false); }
  };

  return (
    <div>
      <PageHeader breadcrumbs={[{ label: 'Dashboard', to: '/dealer/dashboard' }, { label: 'Profile & Settings' }]} title="Profile & settings" />
      <AccountTabs />
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Notifications" description="Choose which updates you receive by email">
          <div className="space-y-5">
            <Switch checked={prefs.status} onChange={setPref('status')} label="Application status changes" description="When operations records a new status on your application" />
            <Switch checked={prefs.documents} onChange={setPref('documents')} label="Document correction requests" description="Recommended — these need your action" />
            <Switch checked={prefs.support} onChange={setPref('support')} label="Support ticket replies" />
            <Switch checked={prefs.digest} onChange={setPref('digest')} label="Weekly summary" description="A Monday summary of your pipeline" />
            <Switch checked={prefs.sms} onChange={setPref('sms')} label="SMS alerts" description="Requires an SMS provider — not available in Phase 1" disabled />
          </div>
        </Panel>
        <div className="space-y-6">
          <Panel title="Change password">
            <div className="space-y-4">
              <TextField label="Current password" type="password" required value={pw.current} onChange={(v) => setPw({ ...pw, current: v })} error={errors.current} autoComplete="current-password" />
              <TextField label="New password" type="password" required value={pw.next} onChange={(v) => setPw({ ...pw, next: v })} error={errors.next} autoComplete="new-password" />
              <TextField label="Confirm new password" type="password" required value={pw.confirm} onChange={(v) => setPw({ ...pw, confirm: v })} error={errors.confirm} autoComplete="new-password" />
            </div>
            <div className="mt-5 flex justify-end">
              <Button onClick={handleChangePassword} loading={saving}>
                Update password
              </Button>
            </div>
          </Panel>
          <Panel title="Active sessions">
            <ul className="divide-y divide-line">
              {[
              { icon: MonitorIcon, device: 'Chrome on Windows · Pune', time: 'Current session' },
              { icon: SmartphoneIcon, device: 'Safari on iPhone · Pune', time: 'Last active 2 days ago' }].
              map((s) =>
              <li key={s.device} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <s.icon className="h-4 w-4 text-muted" />
                  <div className="flex-1">
                    <p className="text-sm text-ink">{s.device}</p>
                    <p className="text-xs text-muted">{s.time}</p>
                  </div>
                  {s.time !== 'Current session' &&
                <Button variant="ghost" size="sm" onClick={() => toast.success('Session signed out (demo)')}>
                      Sign out
                    </Button>
                }
                </li>
              )}
            </ul>
          </Panel>
        </div>
      </div>
    </div>);

}
