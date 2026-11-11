import React from 'react';
import { InfoIcon } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { partnerCategories } from '../../data/marketing';

export function PartnersSection() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          title="A Structured Workflow for Multiple Finance Partners"
          description="Configure each partner’s categories, finance types, priority and processing mode. Applications are routed to the partner the dealer selects." />
        
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {partnerCategories.map((p) =>
          <div key={p.title} className="flex flex-col rounded-xl border border-line p-5">
              <p.icon className="h-5 w-5 text-brand" aria-hidden />
              <h3 className="mt-4 text-[15px] font-semibold text-navy">{p.title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{p.body}</p>
            </div>
          )}
        </div>
        <div className="mt-6 flex items-start gap-3 rounded-xl bg-canvas p-4 text-sm text-muted">
          <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-navy" aria-hidden />
          <p>
            These are partner categories, not named partnerships. Actual partner availability depends on the platform operator’s commercial relationships and authorized access. Final eligibility and approval always rest with the respective lender.
          </p>
        </div>
      </div>
    </section>);

}