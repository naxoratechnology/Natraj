import React from 'react';
import { SectionHeading } from './SectionHeading';
import { securityItems } from '../../data/marketing';

export function SecuritySection() {
  return (
    <section className="bg-canvas py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          title="Designed for security and transparency"
          description="Access boundaries, protected documents and a full activity trail are built into every workflow." />
        
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {securityItems.map((s) =>
          <div key={s.title} className="bg-white p-6">
              <s.icon className="h-5 w-5 text-navy" aria-hidden />
              <h3 className="mt-4 text-[15px] font-semibold text-navy">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.body}</p>
            </div>
          )}
        </div>
        <p className="mt-6 text-[13px] text-muted">
          Security controls describe the product design. Formal certifications or third-party audits are not claimed.
        </p>
      </div>
    </section>);

}