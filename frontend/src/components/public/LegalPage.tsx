import React from 'react';
import { PageIntro } from './PageIntro';
import { DemoNotice } from '../ui/DemoNotice';

interface LegalPageProps {
  title: string;
  description: string;
  updated: string;
  sections: {title: string;body: string;}[];
}

export function LegalPage({ title, description, updated, sections }: LegalPageProps) {
  return (
    <>
      <PageIntro title={title} description={description} />
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[240px_1fr]">
        <nav aria-label="Sections" className="hidden lg:block">
          <ul className="sticky top-24 space-y-1 border-l border-line">
            {sections.map((s, i) =>
            <li key={s.title}>
                <a href={`#s-${i}`} className="-ml-px block border-l border-transparent py-1.5 pl-4 text-sm text-muted hover:border-brand hover:text-ink">
                  {s.title}
                </a>
              </li>
            )}
          </ul>
        </nav>
        <article className="max-w-3xl">
          <p className="text-sm text-muted">Last updated: {updated}</p>
          <DemoNotice tone="warning" className="mt-4">
            Draft template for the prototype. Must be reviewed and finalized by the operator’s legal counsel before publication.
          </DemoNotice>
          {sections.map((s, i) =>
          <section key={s.title} id={`s-${i}`} className="mt-10 scroll-mt-24">
              <h2 className="font-display text-xl font-bold text-navy">{s.title}</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/80">{s.body}</p>
            </section>
          )}
        </article>
      </div>
    </>);

}