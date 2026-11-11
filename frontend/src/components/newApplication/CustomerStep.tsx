import React, { useState } from 'react';
import { CheckIcon, UserPlusIcon, UsersIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { SearchInput } from '../ui/SearchInput';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { EmptyState } from '../ui/EmptyState';
import { AddCustomerModal } from '../dealer/AddCustomerModal';
import { useDemoData } from '../../contexts/DemoDataContext';
import { initials } from '../../utils/format';
import type { DraftStepProps } from '../../types/newApplication';

export function CustomerStep({ draft, errors, update }: DraftStepProps) {
  const { dealerCustomers } = useDemoData();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const list = dealerCustomers.filter((c) => !q || `${c.name} ${c.id} ${c.city}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <SearchInput value={q} onChange={setQ} placeholder="Search your customers" className="flex-1" />
        <Button variant="secondary" className="h-9" onClick={() => setOpen(true)} icon={<UserPlusIcon className="h-4 w-4" />}>
          Add new customer
        </Button>
      </div>
      {errors.customerId && <p className="mt-2 text-xs text-danger-700">{errors.customerId}</p>}
      <div className="mt-4 max-h-[380px] overflow-y-auto rounded-xl border border-line" role="radiogroup" aria-label="Customer">
        {list.length === 0 ?
        <EmptyState icon={UsersIcon} title={dealerCustomers.length ? 'No matching customers' : 'No customers yet'} description="Add a new customer to continue." /> :

        <ul className="divide-y divide-line">
            {list.map((c) => {
            const selected = draft.customerId === c.id;
            return (
              <li key={c.id}>
                  <button
                  role="radio"
                  aria-checked={selected}
                  onClick={() => update('customerId', c.id)}
                  className={twMerge('flex w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-100', selected ? 'bg-brand-50/70' : 'hover:bg-[#F7F9FD]')}>
                  
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-canvas text-xs font-semibold text-navy">{initials(c.name)}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-ink">{c.name}</span>
                      <span className="num block text-xs text-muted">
                        {c.id} · {c.phone} · {c.city}
                      </span>
                    </span>
                    <StatusBadge status={c.kycStatus === 'Verified' ? 'Verified' : c.kycStatus} size="sm" className="hidden sm:inline-flex" />
                    <span className={twMerge('flex h-5 w-5 shrink-0 items-center justify-center rounded-full border', selected ? 'border-brand bg-brand text-white' : 'border-line')}>
                      {selected && <CheckIcon className="h-3 w-3" strokeWidth={3} />}
                    </span>
                  </button>
                </li>);

          })}
          </ul>
        }
      </div>
      <AddCustomerModal open={open} onClose={() => setOpen(false)} onCreated={(c) => update('customerId', c.id)} />
    </div>);

}