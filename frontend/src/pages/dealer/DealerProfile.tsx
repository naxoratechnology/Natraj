import React, { useEffect, useState } from 'react';
import { LockIcon } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '../../components/ui/PageHeader';
import { Panel } from '../../components/ui/Panel';
import { TextField } from '../../components/ui/TextField';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { AccountTabs } from '../../components/dealer/AccountTabs';
import { useDemoData } from '../../contexts/DemoDataContext';
import { CURRENT_DEALER_ID } from '../../data/session';
import { patterns } from '../../utils/validation';
import { getMyDealer, toUiDealer, updateMyDealerProfile, type BackendDealer } from '../../services/dealers';

function ReadOnly({ label, value }: {label: string;value: string;}) {
  return (
    <div>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-ink">{value}</dd>
    </div>);

}

export function DealerProfile() {
  const { dealers } = useDemoData();
  const demoDealer = dealers.find((x) => x.id === CURRENT_DEALER_ID)!;
  const [backendDealer, setBackendDealer] = useState<BackendDealer | null>(null);
  const d = backendDealer ? toUiDealer(backendDealer) : demoDealer;
  const [form, setForm] = useState({ name: d.ownerName, designation: 'Proprietor', mobile: '9822011601', email: d.email, altContact: '' });
  const [errors, setErrors] = useState<{mobile?: string;email?: string;name?: string;}>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getMyDealer().then(({ dealer }) => {
      setBackendDealer(dealer);
      setForm({ name: dealer.name, designation: dealer.designation, mobile: dealer.mobile, email: dealer.email, altContact: '' });
    }).catch(() => undefined);
  }, []);

  const save = async () => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!patterns.mobile.test(form.mobile)) e.mobile = 'Enter a valid 10-digit mobile number';
    if (!patterns.email.test(form.email)) e.email = 'Enter a valid email';
    setErrors(e);
    if (Object.keys(e).length) return;
    setSaving(true);
    try {
      if (backendDealer) {
        const result = await updateMyDealerProfile({ name: form.name, designation: form.designation, mobile: form.mobile });
        setBackendDealer(result.dealer);
      }
      toast.success('Contact details saved');
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Unable to save profile'); }
    finally { setSaving(false); }
  };

  return (
    <div>
      <PageHeader breadcrumbs={[{ label: 'Dashboard', to: '/dealer/dashboard' }, { label: 'Profile & Settings' }]} title="Profile & settings" />
      <AccountTabs />
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <Panel
            title="Business details"
            description="Verified by the operations team"
            actions={<StatusBadge status="Verified" size="sm" />}>
            
            <dl className="grid gap-5 sm:grid-cols-2">
              <ReadOnly label="Registered business name" value={d.businessName} />
              <ReadOnly label="Dealer code" value={d.id} />
              <ReadOnly label="Category" value={d.category} />
              <ReadOnly label="Location" value={`${d.city}, ${d.state}`} />
              <ReadOnly label="GSTIN" value={d.gstin} />
              <ReadOnly label="Business PAN" value={d.panMasked} />
            </dl>
            <p className="mt-5 flex items-center gap-1.5 text-xs text-muted">
              <LockIcon className="h-3.5 w-3.5" /> Verified fields can’t be edited here. Raise a support ticket to request a change; it will require re-verification.
            </p>
          </Panel>
          <Panel title="Owner & contact" description="Used for login and case notifications">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField label="Full name" required value={form.name} onChange={(v) => setForm({ ...form, name: v })} error={errors.name} />
              <TextField label="Designation" value={form.designation} onChange={(v) => setForm({ ...form, designation: v })} />
              <TextField label="Mobile" required prefix="+91" maxLength={10} inputMode="numeric" value={form.mobile} onChange={(v) => setForm({ ...form, mobile: v.replace(/\D/g, '') })} error={errors.mobile} />
              <TextField label="Email" required type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} error={errors.email} />
              <TextField label="Alternate contact person" value={form.altContact} onChange={(v) => setForm({ ...form, altContact: v })} className="sm:col-span-2" hint="Optional — e.g. store manager" />
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={save} loading={saving}>
                Save changes
              </Button>
            </div>
          </Panel>
        </div>
        <div className="space-y-6">
          <Panel title="Payout bank account" actions={<StatusBadge status="Verified" size="sm" />}>
            <dl className="space-y-4">
              <ReadOnly label="Account holder" value={d.businessName} />
              <ReadOnly label="Account number" value="XXXX XXXX 4821" />
              <ReadOnly label="IFSC" value="XXXX0001234" />
            </dl>
            <p className="mt-4 text-xs text-muted">Verified using the cancelled cheque on file. Details are masked for security.</p>
          </Panel>
          <Panel title="Store address">
            <p className="text-sm leading-relaxed text-ink">Shop 4, Ganesh Plaza, Karve Road, Kothrud, Pune, Maharashtra 411038</p>
          </Panel>
        </div>
      </div>
    </div>);

}
