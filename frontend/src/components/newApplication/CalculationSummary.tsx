import React from 'react';
import { draftAmounts, type ApplicationDraft } from '../../types/newApplication';
import { formatINR } from '../../utils/format';
import type { Customer, FinancePartner } from '../../types/finance';

interface Props {
  draft: ApplicationDraft;
  customer?: Customer;
  partner?: FinancePartner;
}

export function CalculationSummary({ draft, customer, partner }: Props) {
  const { price, down, amount } = draftAmounts(draft);
  const pct = price ? Math.round(down / price * 100) : 0;
  const rows: [string, string][] = [
  ['Customer', customer?.name ?? '—'],
  ['Finance type', draft.financeType || '—'],
  ['Product', draft.product || '—'],
  ['Partner', partner?.name ?? '—']];

  return (
    <aside className="rounded-xl border border-line bg-white shadow-card xl:sticky xl:top-24">
      <div className="border-b border-line px-5 py-3.5">
        <h2 className="text-sm font-semibold text-ink">Calculation summary</h2>
      </div>
      <div className="p-5">
        <dl className="space-y-2.5 text-sm">
          {rows.map(([k, v]) =>
          <div key={k} className="flex justify-between gap-4">
              <dt className="text-muted">{k}</dt>
              <dd className="max-w-[60%] truncate text-right font-medium text-ink">{v}</dd>
            </div>
          )}
        </dl>
        <div className="my-4 border-t border-dashed border-line" />
        <dl className="space-y-2.5 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Product price</dt>
            <dd className="num text-ink">{formatINR(price)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Down payment {price > 0 && <span className="num text-xs">({pct}%)</span>}</dt>
            <dd className="num text-ink">− {formatINR(down)}</dd>
          </div>
          <div className="flex items-baseline justify-between rounded-lg bg-canvas px-3 py-3">
            <dt className="font-medium text-ink">Finance amount</dt>
            <dd className="num font-display text-xl font-bold text-navy">{formatINR(amount)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Tenure requested</dt>
            <dd className="text-ink">{draft.financeType === 'New Loan' ? draft.tenure ? `${draft.tenure} months` : '—' : 'N/A'}</dd>
          </div>
        </dl>
        <p className="mt-4 text-xs leading-relaxed text-muted">
          Interest, EMI, processing fees and eligibility are set by the lender and are not calculated here. Approval is not guaranteed.
        </p>
      </div>
    </aside>);

}