import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, FileTextIcon } from 'lucide-react';
import { PageIntro } from '../../components/public/PageIntro';
import { BenefitsSection } from '../../components/public/BenefitsSection';
import { FaqSection } from '../../components/public/FaqSection';
import { CtaSection } from '../../components/public/CtaSection';
import { buttonClasses } from '../../components/ui/Button';
import { registrationDocuments } from '../../types/registration';

const steps = [
{ title: 'Register online', body: 'Owner, business and tax details in a five-step form.' },
{ title: 'Verification review', body: 'The verification team checks your documents and may request corrections.' },
{ title: 'Accept agreement', body: 'Review and accept the dealer agreement once verified.' },
{ title: 'Start submitting', body: 'Add customers and create finance applications from your dashboard.' }];


export function ForDealers() {
  return (
    <>
      <PageIntro
        title="Built for dealers who sell on finance"
        description="Keep every customer, application and document in one place, and always know where each case stands.">
        
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/dealer-register" className={buttonClasses('primary', 'lg')}>
            Become a Dealer <ArrowRightIcon className="h-4 w-4" />
          </Link>
          <Link to="/dealer-login" className={buttonClasses('secondary', 'lg')}>
            Dealer Login
          </Link>
        </div>
      </PageIntro>
      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-navy">Getting started</h2>
            <ol className="mt-8 space-y-6">
              {steps.map((s, i) =>
              <li key={s.title} className="flex gap-4">
                  <span className="num flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">{i + 1}</span>
                  <div>
                    <h3 className="font-semibold text-navy">{s.title}</h3>
                    <p className="mt-1 text-sm text-muted">{s.body}</p>
                  </div>
                </li>
              )}
            </ol>
          </div>
          <div className="rounded-2xl border border-line bg-canvas p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold text-navy">Documents you’ll need</h2>
            <ul className="mt-5 divide-y divide-line">
              {registrationDocuments.map((d) =>
              <li key={d.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                  <span className="flex items-center gap-3 text-ink">
                    <FileTextIcon className="h-4 w-4 text-muted" /> {d.label}
                  </span>
                  <span className="text-xs text-muted">{d.required ? 'Required' : 'If applicable'}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </section>
      <BenefitsSection />
      <FaqSection />
      <CtaSection />
    </>);

}