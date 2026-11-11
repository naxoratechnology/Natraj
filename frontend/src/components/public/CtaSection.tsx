import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { buttonClasses } from '../ui/Button';

export function CtaSection() {
  return (
    <section className="bg-white pb-20 sm:pb-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-brand px-6 py-14 text-center sm:px-12">
          <svg className="pointer-events-none absolute inset-0 h-full w-full text-white/[0.07]" aria-hidden>
            <defs>
              <pattern id="cta-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M40 0H0V40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cta-grid)" />
          </svg>
          <h2 className="relative mx-auto max-w-2xl font-display text-3xl font-extrabold tracking-tight text-white sm:text-[40px] sm:leading-[1.1]">
            Bring Your Dealer Finance Operations Together.
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-base text-white/85">
            Registration takes about ten minutes. Every application is reviewed by the verification team before activation.
          </p>
          <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/dealer-register" className={buttonClasses('primary', 'lg', 'bg-white text-navy hover:bg-[#EAF0FA]')}>
              Become a Dealer <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link to="/contact" className={buttonClasses('primary', 'lg', 'bg-transparent border border-white/40 text-white hover:bg-white/10 shadow-none')}>
              Talk to the team
            </Link>
          </div>
        </div>
      </div>
    </section>);

}