import React from 'react';
import { PencilIcon } from 'lucide-react';
import { requiredDocsFor, draftAmounts, type DraftStepProps } from '../../types/newApplication';
import { formatINR } from '../../utils/format';
import type { Customer, FinancePartner } from '../../types/finance';

interface Props extends DraftStepProps {
  customer?: Customer;
  partner?: FinancePartner;
  goTo: (s: number) => void;
}

function Section({ title, step, goTo, rows }: {title: string;step: number;goTo: (s: number) => void;rows: [string, string][];}) {
  return (
    <section className="rounded-xl border border-line p-4">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        <button onClick={() => goTo(step)} className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline">
          <PencilIcon className="h-3 w-3" /> Edit
        </button>
      </div>
      <dl className="divide-y divide-line">
        {rows.map(([k, v]) =>
        <div key={k} className="flex justify-between gap-4 py-2 text-sm">
            <dt className="text-muted">{k}</dt>
            <dd className="num text-right font-medium text-ink">{v}</dd>
          </div>
        )}
      </dl>
    </section>);

}

export function ReviewStep({ draft, errors, update, customer, partner, goTo }: Props) {
  const { price, down, amount } = draftAmounts(draft);
  const docs = requiredDocsFor(draft.financeType, customer?.kycStatus === 'Verified');
  const attached = docs.filter((d) => d.onFile || draft.docs[d.id]).length;
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Customer" step={0} goTo={goTo} rows={[['Name', customer?.name ?? '—'], ['Customer ID', customer?.id ?? '—'], ['Mobile', customer?.phone ?? '—']]} />
        <Section title="Finance type" step={1} goTo={goTo} rows={[['Type', draft.financeType || '—']]} />
        <Section
          title="Product & finance"
          step={2}
          goTo={goTo}
          rows={[
          ['Category · Product', `${draft.category} · ${draft.product}`],
          ['Price / Down payment', `${formatINR(price)} / ${formatINR(down)}`],
          ['Finance amount', formatINR(amount)],
          ['Tenure', draft.financeType === 'New Loan' ? `${draft.tenure} months` : 'N/A']]
          } />
        
        <Section title="Partner & documents" step={3} goTo={goTo} rows={[['Finance partner', partner?.name ?? '—'], ['Processing mode', partner?.mode ?? '—'], ['Documents', `${attached} of ${docs.length} attached`]]} />
      </div>
      <label className="flex items-start gap-3 rounded-xl border border-line bg-canvas p-4 text-sm text-ink">
        <input type="checkbox" checked={draft.consent} onChange={(e) => update('consent', e.target.checked)} className="mt-0.5 h-4 w-4 accent-brand" />
        <span>
          I confirm the customer has consented to share their details and documents with {partner?.name ?? 'the selected partner'} for evaluating this application, and that the information provided is accurate. I understand approval is decided solely by the lender.
        </span>
      </label>
      {errors.consent && <p className="text-xs text-danger-700">{errors.consent}</p>}
    </div>);

}