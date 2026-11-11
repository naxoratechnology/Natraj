import React, { useEffect, useState } from 'react';
import { LockIcon } from 'lucide-react';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Field, inputClass } from '../ui/Field';
import { TextField } from '../ui/TextField';
import { SelectInput } from '../ui/SelectInput';
import { Switch } from '../ui/Switch';
import { useDemoData } from '../../contexts/DemoDataContext';
import type { FinancePartner, FinanceType, PartnerType, ProcessingMode, ProductCategory } from '../../types/finance';

const allCategories: ProductCategory[] = ['EV', 'Electronics', 'Furniture', 'Consumer Durables'];
const allTypes: FinanceType[] = ['New Loan', 'Existing Finance / Card Limit'];
const partnerTypes: PartnerType[] = ['Banking', 'NBFC', 'Consumer Finance', 'Credit Card / EMI', 'EV Finance'];
const modes: ProcessingMode[] = ['Manual', 'Official API — configured', 'Future Integration'];

const blank: FinancePartner = { id: '', name: '', type: 'NBFC', categories: [], financeTypes: [], mode: 'Manual', priority: 5, active: true, notes: '' };

function Chips<T extends string>({ options, value, onChange }: {options: T[];value: T[];onChange: (v: T[]) => void;}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = value.includes(o);
        return (
          <button
            type="button"
            key={o}
            aria-pressed={on}
            onClick={() => onChange(on ? value.filter((x) => x !== o) : [...value, o])}
            className={twMerge('rounded-md border px-2.5 py-1.5 text-[13px] transition-colors duration-150', on ? 'border-brand bg-brand-50 font-medium text-brand-700' : 'border-line text-ink hover:border-[#CED7E3]')}>
            
            {o}
          </button>);

      })}
    </div>);

}

export function PartnerFormModal({ open, partner, onClose }: {open: boolean;partner: FinancePartner | null;onClose: () => void;}) {
  const { savePartner, partners } = useDemoData();
  const [form, setForm] = useState<FinancePartner>(blank);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setForm(partner ?? { ...blank, id: `P-${String(partners.length + 1).padStart(2, '0')}` });
      setErrors({});
    }
  }, [open, partner, partners.length]);

  const submit = () => {
    savePartner({ ...form, name: form.name.trim() || 'Demo Finance Partner', categories: form.categories.length ? form.categories : allCategories, financeTypes: form.financeTypes.length ? form.financeTypes : allTypes, priority: form.priority || 5 });
    toast.success(partner ? 'Partner updated' : 'Partner added');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={partner ? `Edit ${partner.name}` : 'Add finance partner'}
      description="Partner configuration controls which dealers’ cases can be routed to this partner."
      footer={
      <>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={submit}>{partner ? 'Save changes' : 'Add partner'}</Button>
        </>
      }>
      
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Partner name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} error={errors.name} />
        <Field label="Partner type">
          <SelectInput value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as PartnerType })} options={partnerTypes} />
        </Field>
        <Field label="Supported categories" error={errors.categories} className="sm:col-span-2">
          <Chips options={allCategories} value={form.categories} onChange={(v) => setForm({ ...form, categories: v })} />
        </Field>
        <Field label="Supported finance types" error={errors.financeTypes} className="sm:col-span-2">
          <Chips options={allTypes} value={form.financeTypes} onChange={(v) => setForm({ ...form, financeTypes: v })} />
        </Field>
        <Field label="Processing mode" hint={form.mode === 'Official API — configured' ? 'Only select once official API access has been approved and configured server-side' : undefined}>
          <SelectInput value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value as ProcessingMode })} options={modes} />
        </Field>
        <TextField label="Priority (1 = highest)" inputMode="numeric" maxLength={2} value={String(form.priority)} onChange={(v) => setForm({ ...form, priority: Number(v.replace(/\D/g, '')) || 0 })} error={errors.priority} />
        <Field label="Internal notes" className="sm:col-span-2" htmlFor="pn-notes">
          <textarea id="pn-notes" rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={inputClass(false, 'h-auto resize-none py-2')} />
        </Field>
        <div className="sm:col-span-2">
          <Switch checked={form.active} onChange={(v) => setForm({ ...form, active: v })} label="Active" description="Inactive partners can’t be selected for new applications" />
        </div>
        <p className="flex items-start gap-2 rounded-lg bg-canvas p-3 text-xs text-muted sm:col-span-2">
          <LockIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          API credentials and secrets are never entered or displayed here. They are managed in secure server configuration by authorized engineers.
        </p>
      </div>
    </Modal>);

}
