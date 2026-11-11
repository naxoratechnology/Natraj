import React from 'react';
import { SectionHeading } from './SectionHeading';
import { solutions } from '../../data/marketing';

export function SolutionsSection() {
  return (
    <section className="bg-canvas py-20 sm:py-24" id="finance-solutions">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          title="Finance workflows for the categories dealers sell"
          description="Each workflow captures the right product and finance details for its category, so cases reach the operations team complete." />
        
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {solutions.map((s) =>
          <article
            key={s.title}
            className="group rounded-xl border border-line bg-white p-6 transition-[border-color,transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card">
            
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-canvas text-navy transition-colors duration-200 group-hover:bg-brand-50 group-hover:text-brand">
                <s.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-display text-[17px] font-bold text-navy">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
            </article>
          )}
        </div>
        <p className="mt-6 text-[13px] text-muted">
          These are supported workflow categories. Availability of any specific lender or product depends on configured partner relationships.
        </p>
      </div>
    </section>);

}