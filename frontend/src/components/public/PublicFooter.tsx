import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { brand, financeDisclaimer } from '../../data/brand';

const columns = [
{ title: 'Platform', links: [{ label: 'Overview', to: '/' }, { label: 'Features', to: '/features' }, { label: 'How It Works', to: '/how-it-works' }, { label: 'Finance Solutions', to: '/finance-solutions' }] },
{ title: 'Dealers', links: [{ label: 'For Dealers', to: '/for-dealers' }, { label: 'Become a Dealer', to: '/dealer-register' }, { label: 'Sign in', to: '/login' }] },
{ title: 'Company', links: [{ label: 'About', to: '/about' }, { label: 'Contact', to: '/contact' }, { label: 'Privacy Policy', to: '/privacy-policy' }, { label: 'Terms & Conditions', to: '/terms' }] }];


export function PublicFooter() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-900 to-navy text-white">
      <div className="pointer-events-none absolute -right-40 top-0 h-96 w-96 rounded-full bg-brand/15 blur-3xl" aria-hidden />
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo variant="light" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#A9B6C9]">
              Workflow infrastructure for dealer networks, finance operations and multi-partner application processing.
            </p>
            <p className="mt-4 text-sm text-[#A9B6C9]">{brand.supportEmail}</p>
          </div>
          {columns.map((c) =>
          <div key={c.title}>
              <h3 className="text-sm font-semibold text-white">{c.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) =>
              <li key={l.label}>
                    <Link to={l.to} className="text-sm text-[#A9B6C9] transition-colors duration-150 hover:text-white">
                      {l.label}
                    </Link>
                  </li>
              )}
              </ul>
            </div>
          )}
        </div>
        <div className="mt-12 border-t border-white/10 pt-6">
          <p className="text-xs font-semibold text-white">Finance disclaimer</p>
          <p className="mt-2 max-w-4xl text-xs leading-relaxed text-[#A9B6C9]">{financeDisclaimer}</p>
          <div className="mt-6 flex flex-col justify-between gap-2 text-xs text-[#8696AD] sm:flex-row">
            <p>© 2026 {brand.name}. All rights reserved.</p>
            <p>Partner names shown in the product are fictional demo data.</p>
          </div>
        </div>
      </div>
    </footer>);

}
