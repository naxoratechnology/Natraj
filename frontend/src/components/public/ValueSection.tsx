import React from 'react';
import { valueProps } from '../../data/marketing';

export function ValueSection() {
  return (
    <section className="bg-canvas pb-20" aria-label="Platform value">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid divide-y divide-line rounded-2xl border border-line bg-white sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          {valueProps.map((v, i) =>
          <div key={v.title} className={`p-6 ${i < 2 ? 'sm:border-b sm:border-line lg:border-b-0' : ''} ${i % 2 === 0 ? 'sm:border-r sm:border-line lg:border-r-0' : ''}`}>
              <span className="mb-4 block h-1 w-8 rounded-full bg-teal" aria-hidden />
              <h3 className="font-display text-[17px] font-bold text-navy">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{v.body}</p>
            </div>
          )}
        </div>
      </div>
    </section>);

}