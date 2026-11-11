import React from 'react';
import { formatINR } from '../../utils/format';
import type { FinanceApplication } from '../../types/finance';

export function FinanceBreakdown({ app }: {app: Pick<FinanceApplication, 'productPrice' | 'downPayment' | 'amount' | 'tenureMonths' | 'financeType'>;}) {
  return (
    <div>
      <dl className="space-y-2.5 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Product price</dt>
          <dd className="num text-ink">{formatINR(app.productPrice)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Down payment</dt>
          <dd className="num text-ink">− {formatINR(app.downPayment)}</dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-dashed border-line pt-3">
          <dt className="font-medium text-ink">Finance amount requested</dt>
          <dd className="num font-display text-xl font-bold text-navy">{formatINR(app.amount)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Tenure requested</dt>
          <dd className="text-ink">{app.financeType === 'New Loan' && app.tenureMonths ? `${app.tenureMonths} months` : 'As per existing limit terms'}</dd>
        </div>
      </dl>
      <p className="mt-4 rounded-lg bg-canvas p-3 text-xs leading-relaxed text-muted">
        Interest rate, EMI, fees and final sanctioned amount are determined by the lender. The platform does not calculate or promise these values.
      </p>
    </div>);

}