import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, NetworkIcon } from 'lucide-react';
import { buttonClasses } from '../ui/Button';
import { HeroDashboard } from './HeroDashboard';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-brand-50/45 to-canvas">
      <div className="pointer-events-none absolute -left-32 top-8 h-96 w-96 rounded-full bg-brand-200/45 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-24 top-16 h-80 w-80 rounded-full bg-teal/20 blur-3xl" aria-hidden />
      <svg className="pointer-events-none absolute inset-x-0 top-0 h-[560px] w-full text-brand-100/65" aria-hidden>
        <defs>
          <pattern id="hero-grid" width="56" height="56" patternUnits="userSpaceOnUse">
            <path d="M56 0H0V56" fill="none" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
      </svg>
      <div className="relative mx-auto max-w-6xl px-5 pt-16 text-center sm:px-8 sm:pt-20">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-700 shadow-card backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-teal shadow-[0_0_0_4px_rgba(255,138,0,0.12)]" /> Finance operations, reimagined
        </span>
        <h1 className="mx-auto mt-5 max-w-5xl text-balance font-display text-[40px] font-extrabold leading-[1.08] tracking-[-0.04em] text-navy sm:text-[54px] lg:text-[64px]">
          <span className="block">Smarter finance for <span className="whitespace-nowrap bg-gradient-to-r from-brand-700 via-brand to-cyan-600 bg-clip-text text-transparent">modern retail.</span></span>
          <span className="mt-1 block">Faster growth, connected.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted sm:text-lg">
          Manage dealer onboarding, customer finance applications, lender coordination and application tracking through one organized platform.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/dealer-register" className={buttonClasses('primary', 'lg')}>
            Become a Dealer <ArrowRightIcon className="h-4 w-4" />
          </Link>
          <Link to="/login" className={buttonClasses('secondary', 'lg')}>
            Sign in
          </Link>
        </div>
        <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/65 px-4 py-2 text-[13px] text-muted backdrop-blur">
          <NetworkIcon className="h-4 w-4 text-brand" aria-hidden />
          Built for dealer networks, finance operations and multi-partner workflows.
        </p>
      </div>

      <div className="relative mx-auto mt-10 max-w-6xl px-4 pb-16 sm:px-8 sm:pb-20">
        <HeroDashboard />
      </div>
    </section>);

}
