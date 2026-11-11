import React, { useState } from 'react';
import { ChevronRightIcon } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Drawer } from '../../components/ui/Drawer';
import { DemoNotice } from '../../components/ui/DemoNotice';
import { useDemoData } from '../../contexts/DemoDataContext';
import type { FinancePartner } from '../../types/finance';

export function DealerFinancePartners() {
  const { partners, dealerApplications } = useDemoData();
  const [selected, setSelected] = useState<FinancePartner | null>(null);
  const sorted = [...partners].sort((a, b) => Number(b.active) - Number(a.active) || a.priority - b.priority);
  const countFor = (id: string) => dealerApplications.filter((a) => a.partnerId === id).length;

  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: 'Dashboard', to: '/dealer/dashboard' }, { label: 'Finance Partners' }]}
        title="Finance partners"
        description="Partners configured by the operations team for your dealership." />
      
      <DemoNotice className="mb-6">
        Partner names are fictional demo data. Final eligibility, approval, interest and disbursement are decided solely by each partner. In Phase 1 all applications are shared with partners manually by the operations team.
      </DemoNotice>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sorted.map((p) =>
        <article key={p.id} className={`flex flex-col rounded-xl border border-line bg-white p-5 shadow-card ${p.active ? '' : 'opacity-70'}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-[15px] font-semibold text-ink">{p.name}</h2>
                <p className="text-xs text-muted">{p.type} partner</p>
              </div>
              <StatusBadge status={p.active ? 'Active' : 'Inactive'} size="sm" />
            </div>
            <dl className="mt-5 space-y-3 text-sm">
              <div>
                <dt className="text-xs text-muted">Product categories</dt>
                <dd className="mt-1.5 flex flex-wrap gap-1.5">
                  {p.categories.map((c) =>
                <span key={c} className="rounded-md bg-canvas px-2 py-0.5 text-xs text-ink">
                      {c}
                    </span>
                )}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-xs text-muted">Processing mode</dt>
                <dd>
                  <StatusBadge status={p.mode} size="sm" />
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-xs text-muted">Your applications</dt>
                <dd className="num font-medium text-ink">{countFor(p.id)}</dd>
              </div>
            </dl>
            <div className="mt-auto pt-5">
              <button onClick={() => setSelected(p)} className="flex w-full items-center justify-between border-t border-line pt-3 text-sm font-medium text-brand hover:text-brand-700">
                Details <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </article>
        )}
      </div>

      <Drawer open={!!selected} onClose={() => setSelected(null)} title={selected?.name ?? ''} subtitle={selected ? `${selected.type} partner · Demo` : ''}>
        {selected &&
        <div className="space-y-6">
            <div className="flex gap-2">
              <StatusBadge status={selected.active ? 'Active' : 'Inactive'} />
              <StatusBadge status={selected.mode} />
            </div>
            <section>
              <h3 className="text-xs font-medium text-muted">Supported finance types</h3>
              <ul className="mt-2 space-y-1.5 text-sm text-ink">
                {selected.financeTypes.map((f) =>
              <li key={f}>{f}</li>
              )}
              </ul>
            </section>
            <section>
              <h3 className="text-xs font-medium text-muted">Product categories</h3>
              <p className="mt-2 text-sm text-ink">{selected.categories.join(', ')}</p>
            </section>
            <section>
              <h3 className="text-xs font-medium text-muted">Processing notes</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink">{selected.notes}</p>
            </section>
            <DemoNotice>
              {selected.mode === 'Manual' ?
            'Applications are submitted to this partner by the operations team and outcomes are recorded manually.' :
            'Integration is not active. Any future API connection requires official partner approval and is outside Phase 1.'}
            </DemoNotice>
          </div>
        }
      </Drawer>
    </div>);

}