import React from 'react';
import { CheckIcon, HandshakeIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { StatusBadge } from '../ui/StatusBadge';
import { EmptyState } from '../ui/EmptyState';
import { useDemoData } from '../../contexts/DemoDataContext';
import type { DraftStepProps } from '../../types/newApplication';
import type { FinancePartner } from '../../types/finance';

export function PartnerStep({ draft, errors, update }: DraftStepProps) {
  const { partners } = useDemoData();
  const reason = (p: FinancePartner): string | null => {
    if (!p.active) return 'Partner currently inactive';
    if (draft.category && !p.categories.includes(draft.category)) return `Does not support ${draft.category}`;
    if (draft.financeType && !p.financeTypes.includes(draft.financeType)) return `Does not handle ${draft.financeType === 'New Loan' ? 'new loans' : 'existing limit cases'}`;
    return null;
  };
  const eligible = partners.filter((p) => !reason(p)).sort((a, b) => a.priority - b.priority);
  const unavailable = partners.filter((p) => reason(p));

  return (
    <div>
      {errors.partnerId && <p className="mb-3 text-xs text-danger-700">{errors.partnerId}</p>}
      {eligible.length === 0 ?
      <div className="rounded-xl border border-line">
          <EmptyState icon={HandshakeIcon} title="No configured partner for this case" description="No active partner supports this category and finance type. Contact support or change the product details." />
        </div> :

      <div className="grid gap-3 md:grid-cols-2" role="radiogroup" aria-label="Finance partner">
          {eligible.map((p) => {
          const selected = draft.partnerId === p.id;
          return (
            <button
              key={p.id}
              role="radio"
              aria-checked={selected}
              onClick={() => update('partnerId', p.id)}
              className={twMerge(
                'flex flex-col rounded-xl border p-4 text-left transition-colors duration-150',
                selected ? 'border-brand bg-brand-50/50 ring-1 ring-brand' : 'border-line hover:border-[#CED7E3]'
              )}>
              
                <div className="flex w-full items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-ink">{p.name}</p>
                    <p className="text-xs text-muted">{p.type} · Demo partner</p>
                  </div>
                  <span className={twMerge('flex h-5 w-5 shrink-0 items-center justify-center rounded-full border', selected ? 'border-brand bg-brand text-white' : 'border-line')}>
                    {selected && <CheckIcon className="h-3 w-3" strokeWidth={3} />}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <StatusBadge status={p.mode} size="sm" />
                  {p.priority === eligible[0].priority && <span className="rounded-md bg-teal-50 px-1.5 py-0.5 text-[11px] font-medium text-teal-700">Preferred for this category</span>}
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted">{p.notes}</p>
              </button>);

        })}
        </div>
      }
      {unavailable.length > 0 &&
      <div className="mt-6">
          <p className="text-xs font-medium text-muted">Not available for this case</p>
          <ul className="mt-2 divide-y divide-line rounded-xl border border-line bg-canvas">
            {unavailable.map((p) =>
          <li key={p.id} className="flex items-center justify-between gap-4 px-4 py-2.5 text-[13px]">
                <span className="text-muted">{p.name}</span>
                <span className="text-xs text-muted">{reason(p)}</span>
              </li>
          )}
          </ul>
        </div>
      }
      <p className="mt-5 text-xs text-muted">Selecting a partner does not guarantee approval. The partner makes the final eligibility and credit decision.</p>
    </div>);

}