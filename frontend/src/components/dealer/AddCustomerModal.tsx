import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { TextField } from '../ui/TextField';
import { useDemoData } from '../../contexts/DemoDataContext';
import { CURRENT_DEALER_ID } from '../../data/session';
import { TODAY, demoId } from '../../utils/format';
import { patterns } from '../../utils/validation';
import type { Customer } from '../../types/finance';

interface AddCustomerModalProps {
  open: boolean;
  onClose: () => void;
  onCreated?: (c: Customer) => void;
}

const empty = { name: '', mobile: '', email: '', city: '', pan: '' };

export function AddCustomerModal({ open, onClose, onCreated }: AddCustomerModalProps) {
  const { addCustomer } = useDemoData();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState<Partial<typeof empty>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(empty);
      setErrors({});
    }
  }, [open]);

  const set = (k: keyof typeof empty) => (v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const submit = () => {
    const e: Partial<typeof empty> = {};
    if (form.name.trim().length < 3) e.name = 'Enter the customer’s full name';
    if (!patterns.mobile.test(form.mobile)) e.mobile = 'Enter a valid 10-digit mobile number';
    if (form.email && !patterns.email.test(form.email)) e.email = 'Enter a valid email';
    if (!form.city.trim()) e.city = 'City is required';
    if (!patterns.pan.test(form.pan)) e.pan = 'Enter a valid PAN (e.g. ABCDE1234F)';
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    window.setTimeout(() => {
      const c: Customer = {
        id: demoId('C'),
        dealerId: CURRENT_DEALER_ID,
        name: form.name.trim(),
        phone: `+91 ${form.mobile.slice(0, 2)}XXX XX${form.mobile.slice(7)}`,
        email: form.email || '—',
        city: form.city.trim(),
        panLast4: form.pan.slice(6),
        kycStatus: 'Pending',
        createdAt: TODAY.toISOString()
      };
      addCustomer(c);
      setLoading(false);
      onClose();
      toast.success(`${c.name} added`, { description: 'KYC documents can be uploaded with the first application.' });
      onCreated?.(c);
    }, 600);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add customer"
      description="Obtain the customer’s consent before saving their details."
      footer={
      <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} loading={loading}>
            Save customer
          </Button>
        </>
      }>
      
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField label="Full name" required value={form.name} onChange={set('name')} error={errors.name} className="sm:col-span-2" placeholder="As per PAN" />
        <TextField label="Mobile" required prefix="+91" inputMode="numeric" maxLength={10} value={form.mobile} onChange={(v) => set('mobile')(v.replace(/\D/g, ''))} error={errors.mobile} />
        <TextField label="Email" type="email" value={form.email} onChange={set('email')} error={errors.email} />
        <TextField label="City" required value={form.city} onChange={set('city')} error={errors.city} />
        <TextField label="PAN" required uppercase maxLength={10} value={form.pan} onChange={set('pan')} error={errors.pan} hint="Only the last 4 characters are shown after saving" />
      </div>
    </Modal>);

}