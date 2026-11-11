import React from 'react';
import { Field } from '../ui/Field';
import { SelectInput } from '../ui/SelectInput';
import { TextField } from '../ui/TextField';
import { draftAmounts, type DraftStepProps } from '../../types/newApplication';
import { formatINR } from '../../utils/format';

const categories = [
{ value: 'EV', label: 'EV (electric vehicles)' },
{ value: 'Electronics', label: 'Electronics' },
{ value: 'Furniture', label: 'Furniture' },
{ value: 'Consumer Durables', label: 'Consumer durables' }];

const tenures = ['3', '6', '9', '12', '18', '24', '36'].map((t) => ({ value: t, label: `${t} months` }));

export function ProductStep({ draft, errors, update }: DraftStepProps) {
  const { amount } = draftAmounts(draft);
  const isNewLoan = draft.financeType === 'New Loan';
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field label="Product category" required error={errors.category}>
        <SelectInput options={categories} placeholder="Select category" value={draft.category} onChange={(e) => update('category', e.target.value as typeof draft.category)} invalid={!!errors.category} />
      </Field>
      <TextField label="Product name / model" required value={draft.product} onChange={(v) => update('product', v)} error={errors.product} placeholder="e.g. 55-inch 4K Smart LED TV" />
      <TextField label="Product price (incl. GST)" required prefix="₹" inputMode="numeric" value={draft.productPrice} onChange={(v) => update('productPrice', v.replace(/\D/g, '').slice(0, 8))} error={errors.productPrice} hint="As per the quotation you will upload" />
      <TextField
        label="Down payment"
        required={isNewLoan}
        prefix="₹"
        inputMode="numeric"
        value={draft.downPayment}
        onChange={(v) => update('downPayment', v.replace(/\D/g, '').slice(0, 8))}
        error={errors.downPayment}
        hint={isNewLoan ? 'Amount paid by the customer upfront' : 'Usually ₹0 for existing limit cases'} />
      
      <Field label="Finance amount" hint="Calculated as product price minus down payment">
        <div className="num flex h-10 items-center rounded-lg border border-line bg-canvas px-3 text-sm font-semibold text-navy">{formatINR(amount)}</div>
      </Field>
      {isNewLoan ?
      <Field label="Tenure requested" required error={errors.tenure} hint="Final tenure is decided by the lender">
          <SelectInput options={tenures} placeholder="Select tenure" value={draft.tenure} onChange={(e) => update('tenure', e.target.value)} invalid={!!errors.tenure} />
        </Field> :

      <Field label="Tenure" hint="Governed by the customer’s existing finance or card-limit terms">
          <div className="flex h-10 items-center rounded-lg border border-line bg-canvas px-3 text-sm text-muted">Not applicable</div>
        </Field>
      }
    </div>);

}