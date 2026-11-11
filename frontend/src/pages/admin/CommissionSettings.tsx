import React, { useMemo, useState } from 'react';
import { PencilIcon, PlusIcon } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '../../components/ui/PageHeader';
import { Panel } from '../../components/ui/Panel';
import { Button } from '../../components/ui/Button';
import { Field, inputClass } from '../../components/ui/Field';
import { TextField } from '../../components/ui/TextField';
import { SelectInput } from '../../components/ui/SelectInput';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Switch } from '../../components/ui/Switch';
import { DemoNotice } from '../../components/ui/DemoNotice';
import { DataTable, type Column } from '../../components/ui/DataTable';
import { useDemoData } from '../../contexts/DemoDataContext';
import { commissionRules } from '../../data/partners';
import { formatDate, formatINR } from '../../utils/format';
import type { CommissionRule } from '../../types/finance';

const products: CommissionRule['product'][] = ['All categories', 'EV', 'Electronics', 'Furniture', 'Consumer Durables'];
const triggers: CommissionRule['trigger'][] = ['On disbursement', 'On approval', 'On lender payout confirmation'];
const blank: CommissionRule = { id: '', partnerId: '', product: 'All categories', type: 'Percentage', rate: 2, fixedAmount: 0, dealerShare: 70, trigger: 'On disbursement', effectiveFrom: '2026-11-01', effectiveTo: '2027-03-31', clawback: '', active: true };

export function CommissionSettings() {
  const { partners } = useDemoData();
  const [rules, setRules] = useState<CommissionRule[]>(commissionRules);
  const [form, setForm] = useState<CommissionRule>({ ...rules[0] });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [example, setExample] = useState('100000');
  const partnerName = (id: string) => partners.find((p) => p.id === id)?.name ?? '—';

  const preview = useMemo(() => {
    const amount = Number(example) || 0;
    const gross = form.type === 'Percentage' ? amount * form.rate / 100 : form.fixedAmount;
    const dealer = Math.round(gross * form.dealerShare / 100);
    return { amount, gross: Math.round(gross), dealer, platform: Math.round(gross) - dealer };
  }, [example, form]);

  const save = () => {
    const e: Record<string, string> = {};
    if (!form.partnerId) e.partnerId = 'Select a partner';
    if (form.type === 'Percentage' && (form.rate <= 0 || form.rate > 10)) e.rate = 'Enter a rate between 0.01% and 10%';
    if (form.type === 'Fixed Amount' && form.fixedAmount <= 0) e.fixedAmount = 'Enter a fixed amount';
    if (form.dealerShare < 0 || form.dealerShare > 100) e.dealerShare = 'Dealer share must be 0–100%';
    if (form.effectiveTo && form.effectiveTo < form.effectiveFrom) e.effectiveTo = 'End date must be after start date';
    setErrors(e);
    if (form.id) setRules((r) => r.map((x) => x.id === form.id ? form : x));else
    {
      const id = `CR-${String(rules.length + 1).padStart(2, '0')}`;
      setRules((r) => [...r, { ...form, id }]);
      setForm({ ...form, id });
    }
    toast.success('Commission rule saved', { description: 'Configured estimate only — not a payment record.' });
  };

  const columns: Column<CommissionRule>[] = [
  { key: 'id', header: 'Rule', render: (r) => <span className="num font-medium text-navy">{r.id}</span> },
  { key: 'partner', header: 'Finance partner', sortValue: (r) => partnerName(r.partnerId), render: (r) => partnerName(r.partnerId) },
  { key: 'product', header: 'Product', render: (r) => <span className="text-muted">{r.product}</span> },
  { key: 'value', header: 'Commission', align: 'right', render: (r) => <span className="num">{r.type === 'Percentage' ? `${r.rate}%` : formatINR(r.fixedAmount)}</span> },
  { key: 'split', header: 'Dealer / Platform', align: 'right', render: (r) => <span className="num text-muted">{r.dealerShare}% / {100 - r.dealerShare}%</span> },
  { key: 'trigger', header: 'Payout trigger', render: (r) => <span className="text-muted">{r.trigger}</span> },
  { key: 'effective', header: 'Effective', render: (r) => <span className="num text-muted">{formatDate(r.effectiveFrom)} – {formatDate(r.effectiveTo)}</span> },
  { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.active ? 'Active' : 'Inactive'} size="sm" /> },
  { key: 'edit', header: '', align: 'right', render: (r) => <button onClick={(e) => {e.stopPropagation();setForm({ ...r });setErrors({});}} className="rounded-md p-1.5 text-muted hover:bg-canvas hover:text-ink" aria-label={`Edit ${r.id}`}><PencilIcon className="h-4 w-4" /></button> }];


  return (
    <div className="space-y-5">
      <PageHeader
        title="Commission & payout configuration"
        description="Configure how expected partner payouts are calculated and split. This page does not record or reconcile actual payments."
        actions={<Button onClick={() => {setForm({ ...blank });setErrors({});}} icon={<PlusIcon className="h-4 w-4" />}>New rule</Button>} />
      
      <DemoNotice tone="warning">
        All rates shown are hypothetical examples. Actual rates and splits must come from the signed commercial agreement with each partner. Lender payments are not automatically received or reconciled in Phase 1.
      </DemoNotice>

      <Panel title="Configured rules" flush>
        <DataTable columns={columns} rows={rules} rowKey={(r) => r.id} dense onRowClick={(r) => {setForm({ ...r });setErrors({});}} minWidth={1060} />
      </Panel>

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <Panel title={form.id ? `Edit rule ${form.id}` : 'New commission rule'} description="Changes are audit-logged">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Finance partner" error={errors.partnerId}>
              <SelectInput placeholder="Select partner" value={form.partnerId} onChange={(e) => setForm({ ...form, partnerId: e.target.value })} options={partners.map((p) => ({ value: p.id, label: p.name }))} invalid={!!errors.partnerId} />
            </Field>
            <Field label="Product">
              <SelectInput value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value as CommissionRule['product'] })} options={products} />
            </Field>
            <Field label="Commission type" className="sm:col-span-2">
              <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Commission type">
                {(['Percentage', 'Fixed Amount'] as const).map((t) =>
                <button key={t} type="button" role="radio" aria-checked={form.type === t} onClick={() => setForm({ ...form, type: t })} className={`h-10 rounded-lg border text-sm font-medium transition-colors duration-150 ${form.type === t ? 'border-brand bg-brand-50 text-brand-700' : 'border-line text-ink hover:border-[#CED7E3]'}`}>
                    {t}
                  </button>
                )}
              </div>
            </Field>
            {form.type === 'Percentage' ?
            <TextField label="Commission rate (%)" inputMode="decimal" value={String(form.rate)} onChange={(v) => setForm({ ...form, rate: Number(v.replace(/[^\d.]/g, '')) || 0 })} error={errors.rate} hint="Of the disbursed finance amount" /> :

            <TextField label="Fixed amount per case" prefix="₹" inputMode="numeric" value={String(form.fixedAmount)} onChange={(v) => setForm({ ...form, fixedAmount: Number(v.replace(/\D/g, '')) || 0 })} error={errors.fixedAmount} />
            }
            <Field label="Payout trigger">
              <SelectInput value={form.trigger} onChange={(e) => setForm({ ...form, trigger: e.target.value as CommissionRule['trigger'] })} options={triggers} />
            </Field>
            <TextField label="Dealer share (%)" inputMode="numeric" maxLength={3} value={String(form.dealerShare)} onChange={(v) => setForm({ ...form, dealerShare: Math.min(100, Number(v.replace(/\D/g, '')) || 0) })} error={errors.dealerShare} />
            <Field label="Platform share (%)" hint="Calculated automatically">
              <div className="num flex h-10 items-center rounded-lg border border-line bg-canvas px-3 text-sm text-ink">{100 - form.dealerShare}%</div>
            </Field>
            <TextField label="Effective from" type="date" value={form.effectiveFrom} onChange={(v) => setForm({ ...form, effectiveFrom: v })} />
            <TextField label="Effective to" type="date" value={form.effectiveTo} onChange={(v) => setForm({ ...form, effectiveTo: v })} error={errors.effectiveTo} />
            <Field label="Clawback rules" className="sm:col-span-2" htmlFor="clawback">
              <textarea id="clawback" rows={2} value={form.clawback} onChange={(e) => setForm({ ...form, clawback: e.target.value })} placeholder="e.g. Full clawback if loan is cancelled within 30 days" className={inputClass(false, 'h-auto resize-none py-2')} />
            </Field>
            <div className="sm:col-span-2">
              <Switch checked={form.active} onChange={(v) => setForm({ ...form, active: v })} label="Rule active" description="Only active rules are used for expected payout estimates" />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button onClick={save}>Save rule</Button>
          </div>
        </Panel>

        <Panel title="Calculation preview" description="Hypothetical example — not a confirmed payout" className="self-start xl:sticky xl:top-20">
          <TextField label="Example finance amount" prefix="₹" inputMode="numeric" value={example} onChange={(v) => setExample(v.replace(/\D/g, '').slice(0, 9))} />
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Finance amount</dt><dd className="num text-ink">{formatINR(preview.amount)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Example payout {form.type === 'Percentage' ? `rate (${form.rate}%)` : '(fixed)'}</dt><dd className="num text-ink">{formatINR(preview.gross)}</dd></div>
            <div className="flex items-baseline justify-between border-t border-dashed border-line pt-3"><dt className="font-medium text-ink">Gross partner payout</dt><dd className="num font-display text-lg font-bold text-navy">{formatINR(preview.gross)}</dd></div>
            <div className="flex justify-between"><dt className="flex items-center gap-2 text-muted"><span className="h-2 w-2 rounded-full bg-teal" />Dealer share ({form.dealerShare}%)</dt><dd className="num font-medium text-ink">{formatINR(preview.dealer)}</dd></div>
            <div className="flex justify-between"><dt className="flex items-center gap-2 text-muted"><span className="h-2 w-2 rounded-full bg-navy" />Platform share ({100 - form.dealerShare}%)</dt><dd className="num font-medium text-ink">{formatINR(preview.platform)}</dd></div>
          </dl>
          <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-canvas" aria-hidden>
            <span className="bg-teal" style={{ width: `${form.dealerShare}%` }} />
            <span className="bg-navy" style={{ width: `${100 - form.dealerShare}%` }} />
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted">
            Hypothetical illustration only. Payout becomes payable per the trigger “{form.trigger.toLowerCase()}” and the signed agreement. Received amounts must be reconciled separately.
          </p>
        </Panel>
      </div>
    </div>);

}
