import React from 'react';
import { BellIcon, FileTextIcon, LayoutDashboardIcon, SearchIcon, UsersIcon, HandshakeIcon, LifeBuoyIcon } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { StatusDonut } from '../charts/StatusDonut';
import { ProgressTrack } from '../shared/ProgressTrack';
import { Logo } from '../ui/Logo';
import { heroPreview } from '../../data/marketing';

const sideItems = [
{ label: 'Dashboard', icon: LayoutDashboardIcon, active: true },
{ label: 'Customers', icon: UsersIcon },
{ label: 'Applications', icon: FileTextIcon },
{ label: 'Finance Partners', icon: HandshakeIcon },
{ label: 'Support', icon: LifeBuoyIcon }];


export function HeroDashboard() {
  return (
    <div className="relative rounded-[28px] border border-white/80 bg-gradient-to-br from-brand-100/80 via-white to-teal-50 p-2.5 shadow-frame ring-1 ring-brand-100 sm:p-3.5">
      <div className="absolute -top-3 right-6 z-10 rounded-full border border-brand-100 bg-white/95 px-3 py-1 text-[11px] font-semibold text-brand-700 shadow-card backdrop-blur">
        Illustrative preview · demo data
      </div>
      <div className="flex overflow-hidden rounded-2xl border border-line/80 bg-white text-left shadow-[0_12px_35px_-24px_rgba(6,40,102,0.45)]" aria-hidden>
        <aside className="hidden w-48 shrink-0 border-r border-line p-4 lg:block">
          <Logo className="scale-90 origin-left" />
          <ul className="mt-6 space-y-1">
            {sideItems.map((s) =>
            <li
              key={s.label}
              className={`flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] ${s.active ? 'bg-gradient-to-r from-brand to-brand-600 text-white shadow-sm' : 'text-muted'}`}>
              
                <s.icon className="h-4 w-4" />
                {s.label}
              </li>
            )}
          </ul>
        </aside>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <div className="flex h-8 w-56 items-center gap-2 rounded-md border border-line px-2.5 text-xs text-[#93A0B3]">
              <SearchIcon className="h-3.5 w-3.5" /> Search applications
            </div>
            <div className="flex items-center gap-3">
              <BellIcon className="h-4 w-4 text-muted" />
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy text-[11px] font-semibold text-white">RA</span>
            </div>
          </div>
          <div className="space-y-3 bg-canvas p-3 sm:p-4">
            <div className="rounded-xl border border-line bg-white p-3 shadow-card sm:p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold text-ink">FA-10418 · New loan · Electronics</p>
                <StatusBadge status="Processing" size="sm" />
              </div>
              <ProgressTrack
                compact
                events={[
                { label: 'Created', state: 'done' },
                { label: 'Submitted', state: 'done' },
                { label: 'Documents verified', state: 'done' },
                { label: 'Processing', state: 'current' },
                { label: 'Lender decision', state: 'upcoming' },
                { label: 'Disbursement', state: 'upcoming' }]
                } />
              
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {heroPreview.metrics.map((m, i) =>
              <div key={m.label} className="rounded-xl border border-line bg-white p-3 shadow-card">
                  <p className="text-[11px] text-muted">{m.label}</p>
                  <p className={`num mt-1 font-display text-xl font-bold ${i === 0 ? 'text-brand' : 'text-ink'}`}>{m.value}</p>
                </div>
              )}
            </div>
            <div className="grid gap-3 md:grid-cols-[1.6fr_1fr]">
              <div className="overflow-hidden rounded-xl border border-line bg-white shadow-card">
                <p className="border-b border-line px-3 py-2.5 text-xs font-semibold text-ink">Recent applications</p>
                <table className="w-full text-[12px]">
                  <tbody>
                    {heroPreview.rows.map((r) =>
                    <tr key={r.id} className="border-b border-line last:border-0">
                        <td className="num px-3 py-2.5 font-medium text-ink">{r.id}</td>
                        <td className="hidden px-2 py-2.5 text-muted sm:table-cell">{r.customer}</td>
                        <td className="hidden px-2 py-2.5 text-muted md:table-cell">{r.product}</td>
                        <td className="num px-2 py-2.5 text-right text-ink">{r.amount}</td>
                        <td className="px-3 py-2.5 text-right">
                          <StatusBadge status={r.status} size="sm" />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="grid gap-3">
                <div className="rounded-xl border border-line bg-white p-3 shadow-card">
                  <p className="mb-3 text-xs font-semibold text-ink">Status distribution</p>
                  <StatusDonut data={heroPreview.distribution} size={96} centerLabel="cases" />
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);

}
