import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeftIcon, CheckCircle2Icon, ClockIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { SearchInput } from '../../components/ui/SearchInput';
import { EmptyState } from '../../components/ui/EmptyState';
import { CaseWorkspace } from '../../components/admin/CaseWorkspace';
import { useDemoData } from '../../contexts/DemoDataContext';
import { ageLabel, daysSince, formatINR, relativeTime } from '../../utils/format';
import type { ApplicationStatus } from '../../types/finance';

const queues: {id: ApplicationStatus;label: string;}[] = [
{ id: 'Pending', label: 'New' },
{ id: 'Documents Required', label: 'Documents Required' },
{ id: 'Processing', label: 'Processing' },
{ id: 'Awaiting Lender', label: 'Awaiting Lender' },
{ id: 'Approved', label: 'Approved' },
{ id: 'Rejected', label: 'Rejected' },
{ id: 'Disbursement Pending', label: 'Disbursement Pending' },
{ id: 'Disbursed', label: 'Disbursed' }];


export function ManualProcessing() {
  const [params, setParams] = useSearchParams();
  const { applications } = useDemoData();
  const initialQueue = (queues.find((x) => x.id === params.get('queue'))?.id ?? 'Pending') as ApplicationStatus;
  const [queue, setQueue] = useState<ApplicationStatus>(initialQueue);
  const [q, setQ] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileDetail, setMobileDetail] = useState(false);

  const cases = useMemo(
    () =>
    applications.
    filter((a) => a.status === queue).
    filter((a) => !q || `${a.id} ${a.customerName} ${a.dealerName} ${a.lenderRef ?? ''}`.toLowerCase().includes(q.toLowerCase())).
    sort((a, b) => +new Date(a.updatedAt) - +new Date(b.updatedAt)),
    [applications, queue, q]
  );

  useEffect(() => {
    if (!cases.find((c) => c.id === selectedId)) setSelectedId(cases[0]?.id ?? null);
  }, [cases, selectedId]);

  const selected = applications.find((a) => a.id === selectedId);

  return (
    <div>
      <PageHeader title="Manual processing queue" description="Phase 1 workflow: operations staff submit cases to partners and record each lender outcome here. No lender API is connected." />
      <div className="overflow-hidden rounded-xl border border-line bg-white shadow-card">
        <div className="px-4 pt-2">
          <Tabs
            value={queue}
            onChange={(v) => {
              setQueue(v as ApplicationStatus);
              setParams({ queue: v }, { replace: true });
              setMobileDetail(false);
            }}
            tabs={queues.map((x) => ({ id: x.id, label: x.label, count: applications.filter((a) => a.status === x.id).length }))} />
          
        </div>
        <div className="grid border-t border-line lg:grid-cols-[360px_1fr]" style={{ minHeight: 640 }}>
          <div className={twMerge('flex flex-col border-line lg:border-r', mobileDetail && 'hidden lg:flex')}>
            <div className="border-b border-line p-3">
              <SearchInput value={q} onChange={setQ} placeholder="Search in this queue" />
            </div>
            {cases.length === 0 ?
            <EmptyState icon={CheckCircle2Icon} title="Queue is clear" description="No cases are in this stage right now." /> :

            <ul className="flex-1 divide-y divide-line overflow-y-auto">
                {cases.map((c) => {
                const idle = daysSince(c.updatedAt);
                return (
                  <li key={c.id}>
                      <button
                      onClick={() => {
                        setSelectedId(c.id);
                        setMobileDetail(true);
                      }}
                      className={twMerge('w-full px-4 py-3 text-left transition-colors duration-100', c.id === selectedId ? 'bg-brand-50/60 shadow-[inset_2px_0_0_#2457C5]' : 'hover:bg-[#F7F9FD]')}>
                      
                        <div className="flex items-center justify-between gap-2">
                          <span className="num text-[13px] font-semibold text-navy">{c.id}</span>
                          <span className={twMerge('flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium', idle >= 3 ? 'bg-danger-50 text-danger-700' : 'bg-canvas text-muted')}>
                            <ClockIcon className="h-3 w-3" /> {ageLabel(c.createdAt)}
                          </span>
                        </div>
                        <p className="mt-1 truncate text-[13px] text-ink">
                          {c.customerName} · <span className="num">{formatINR(c.amount)}</span>
                        </p>
                        <p className="truncate text-xs text-muted">{c.dealerName} → {c.partnerName}</p>
                        <div className="mt-2 flex items-center justify-between gap-2 text-[11px]">
                          <span className="truncate font-medium text-brand-700">Next: {c.nextAction}</span>
                          <span className="shrink-0 text-muted">{relativeTime(c.updatedAt)}</span>
                        </div>
                      </button>
                    </li>);

              })}
              </ul>
            }
          </div>
          <div className={twMerge('min-w-0 p-5', !mobileDetail && 'hidden lg:block')}>
            <button onClick={() => setMobileDetail(false)} className="mb-3 flex items-center gap-1 text-xs font-medium text-muted lg:hidden">
              <ArrowLeftIcon className="h-3.5 w-3.5" /> Back to queue
            </button>
            {selected ?
            <CaseWorkspace app={selected} /> :

            <EmptyState icon={CheckCircle2Icon} title="No case selected" description="Choose a case from the queue to process it." />
            }
          </div>
        </div>
      </div>
    </div>);

}