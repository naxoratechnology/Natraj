import React, { useMemo, useState } from 'react';
import { DownloadIcon, FileBarChartIcon } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { FilterSelect } from '../../components/ui/FilterSelect';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { DemoNotice } from '../../components/ui/DemoNotice';
import { useDemoData } from '../../contexts/DemoDataContext';
import { commissionRules } from '../../data/partners';
import { TODAY, daysSince, downloadCsv, formatINR } from '../../utils/format';
import { allApplicationStatuses } from '../../utils/status';
import { buildReport, type ReportType } from '../../utils/reports';

const reportTabs: {id: ReportType;label: string;}[] = [
{ id: 'dealer', label: 'Dealer-wise' },
{ id: 'partner', label: 'Partner-wise' },
{ id: 'status', label: 'Application status' },
{ id: 'outcome', label: 'Approved / rejected' },
{ id: 'disbursement', label: 'Disbursements' },
{ id: 'daily', label: 'Date-wise activity' },
{ id: 'payout', label: 'Expected payouts' }];


const ranges: Record<string, number> = { 'Last 7 days': 7, 'Last 30 days': 30, 'Last 90 days': 90 };

export function Reports() {
  const { applications } = useDemoData();
  const [type, setType] = useState<ReportType>('dealer');
  const [range, setRange] = useState('');
  const [dealer, setDealer] = useState('');
  const [partner, setPartner] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');

  const filtered = applications.
  filter((a) => !range || daysSince(a.createdAt) <= ranges[range]).
  filter((a) => !dealer || a.dealerName === dealer).
  filter((a) => !partner || a.partnerName === partner).
  filter((a) => !category || a.category === category).
  filter((a) => !status || a.status === status);

  const report = useMemo(() => buildReport(type, filtered, commissionRules), [type, filtered]);
  const dealers = Array.from(new Set(applications.map((a) => a.dealerName))).sort();
  const partners = Array.from(new Set(applications.map((a) => a.partnerName))).sort();

  const summary = [
  ['Applications in scope', String(filtered.length)],
  ['Amount requested', formatINR(filtered.reduce((s, a) => s + a.amount, 0))],
  ['Recorded disbursed', formatINR(filtered.filter((a) => a.status === 'Disbursed').reduce((s, a) => s + (a.disbursedAmount ?? a.amount), 0))],
  ['Rows', String(report.rows.length)]];


  const exportCsv = () => {
    downloadCsv(`report-${type}-${TODAY.toISOString().slice(0, 10)}.csv`, [report.columns.map((c) => c.label), ...report.rows]);
    toast.success('CSV exported');
  };

  return (
    <div className="space-y-5">
      <PageHeader title="Reports" description="Operational reports built from recorded application data." actions={<Button variant="secondary" onClick={exportCsv} disabled={report.rows.length === 0} icon={<DownloadIcon className="h-4 w-4" />}>Export CSV</Button>} />

      <div className="rounded-xl border border-line bg-white shadow-card">
        <div className="px-4 pt-2">
          <Tabs value={type} onChange={(v) => setType(v as ReportType)} tabs={reportTabs} />
        </div>
        <div className="flex flex-wrap gap-2 border-b border-line p-3">
          <FilterSelect label="Date" value={range} onChange={setRange} options={Object.keys(ranges)} allLabel="All time" />
          <FilterSelect label="Dealer" value={dealer} onChange={setDealer} options={dealers} />
          <FilterSelect label="Partner" value={partner} onChange={setPartner} options={partners} />
          <FilterSelect label="Category" value={category} onChange={setCategory} options={['EV', 'Electronics', 'Furniture', 'Consumer Durables']} />
          <FilterSelect label="Status" value={status} onChange={setStatus} options={allApplicationStatuses} />
        </div>
        <dl className="grid grid-cols-2 border-b border-line md:grid-cols-4">
          {summary.map(([k, v], i) =>
          <div key={k} className={`px-5 py-3 ${i > 0 ? 'border-l border-line' : ''} ${i >= 2 ? 'max-md:border-t' : ''}`}>
              <dt className="text-[11px] text-muted">{k}</dt>
              <dd className="num mt-0.5 text-base font-semibold text-ink">{v}</dd>
            </div>
          )}
        </dl>

        {type === 'payout' &&
        <div className="border-b border-line p-3">
            <DemoNotice tone="warning">
              <span className="font-semibold">Expected</span> amounts are estimates from configured commission rules. <span className="font-semibold">Confirmed received</span> payments are not tracked in Phase 1 and must be reconciled outside the platform.
            </DemoNotice>
          </div>
        }

        {report.rows.length === 0 ?
        <EmptyState icon={FileBarChartIcon} title="No data for these filters" description="Widen the date range or clear a filter." /> :

        <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-[13px]">
              <thead>
                <tr className="border-b border-line bg-[#F9FAFC]">
                  {report.columns.map((c) =>
                <th key={c.label} scope="col" className={`whitespace-nowrap px-4 py-2.5 text-left text-xs font-medium text-muted ${c.align === 'right' ? 'text-right' : ''}`}>
                      {c.label}
                      {type === 'payout' && c.label.startsWith('Expected') && <span className="ml-1 rounded bg-teal-50 px-1 text-[10px] text-teal-700">est.</span>}
                    </th>
                )}
                </tr>
              </thead>
              <tbody>
                {report.rows.map((r, i) =>
              <tr key={i} className="border-b border-line last:border-0">
                    {r.map((cell, j) => {
                  const col = report.columns[j];
                  const isStatus = typeof cell === 'string' && (allApplicationStatuses as string[]).includes(cell) && (col.label === 'Status' || col.label === 'Decision');
                  return (
                    <td key={j} className={`whitespace-nowrap px-4 py-2.5 ${col.align === 'right' ? 'num text-right' : ''} ${j === 0 ? 'font-medium text-ink' : 'text-ink/85'}`}>
                          {isStatus ? <StatusBadge status={String(cell)} size="sm" /> : cell === 'Not tracked' ? <StatusBadge status="Not tracked" size="sm" /> : col.money && typeof cell === 'number' ? formatINR(cell) : cell}
                        </td>);

                })}
                  </tr>
              )}
              </tbody>
            </table>
          </div>
        }
        {report.note && <p className="border-t border-line px-4 py-3 text-xs text-muted">{report.note}</p>}
      </div>
    </div>);

}