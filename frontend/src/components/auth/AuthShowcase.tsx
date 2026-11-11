import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { statusHex } from '../../utils/status';

const segments = [
{ name: 'Processing', value: 34 },
{ name: 'Approved', value: 18 },
{ name: 'Disbursed', value: 30 },
{ name: 'Documents Required', value: 10 },
{ name: 'Rejected', value: 8 }];


const rows = [
{ id: 'FA-10418', label: 'Processing with lender', status: 'Processing' },
{ id: 'FA-10409', label: 'Lender approval recorded', status: 'Approved' },
{ id: 'FA-10396', label: 'Disbursement recorded', status: 'Disbursed' }];


export function AuthShowcase({ headline, body }: {headline: string;body: string;}) {
  return (
    <div className="relative hidden h-full flex-col justify-between overflow-hidden bg-gradient-to-br from-navy-900 via-navy to-brand-700 p-10 lg:flex xl:p-14">
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-brand/30 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-32 top-24 h-80 w-80 rounded-full bg-teal/20 blur-3xl" aria-hidden />
      <svg className="pointer-events-none absolute inset-0 h-full w-full text-white/[0.04]" aria-hidden>
        <defs>
          <pattern id="auth-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M48 0H0V48" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#auth-grid)" />
      </svg>
      <Link to="/" className="relative" aria-label="Back to website">
        <Logo variant="light" />
      </Link>
      <div className="relative max-w-md">
        <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-white">{headline}</h2>
        <p className="mt-4 text-base leading-relaxed text-[#B4C1D4]">{body}</p>

        <div className="mt-10 rounded-2xl border border-white/15 bg-white/[0.08] p-6 shadow-2xl backdrop-blur-md" aria-hidden>
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-white">Application pipeline</span>
            <span className="text-[#8EA0B9]">Illustrative</span>
          </div>
          <div className="mt-4 flex h-2.5 overflow-hidden rounded-full">
            {segments.map((s) =>
            <span key={s.name} style={{ width: `${s.value}%`, background: statusHex[s.name] }} />
            )}
          </div>
          <ul className="mt-5 space-y-3">
            {rows.map((r) =>
            <li key={r.id} className="flex items-center justify-between text-[13px]">
                <span className="flex items-center gap-2.5 text-[#D3DCE8]">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: statusHex[r.status] }} />
                  {r.label}
                </span>
                <span className="num text-[#8EA0B9]">{r.id}</span>
              </li>
            )}
          </ul>
        </div>
      </div>
      <p className="relative text-xs leading-relaxed text-[#8EA0B9]">
        The platform manages workflow only. Credit decisions are made solely by the respective lender.
      </p>
    </div>);

}
