import React from 'react';
import { CheckIcon, MinusIcon } from 'lucide-react';
import { PageIntro } from '../../components/public/PageIntro';
import { CtaSection } from '../../components/public/CtaSection';
import { brand } from '../../data/brand';

const does = [
'Onboards and verifies dealer businesses',
'Stores customer records and documents for dealers',
'Structures finance applications and routes them to a configured partner',
'Records lender references, decisions and disbursements',
'Gives operations staff role-based tools, reports and audit history'];


const doesNot = [
'Lend money or make credit decisions',
'Guarantee approval, interest rates or disbursement timelines',
'Offer customer accounts or a consumer loan marketplace',
'Connect directly to banks or NBFCs without official partner approval',
'Ask for card numbers, PINs, CVVs or banking passwords'];


export function About() {
  return (
    <>
      <PageIntro
        title={`About ${brand.name}`}
        description="We build workflow infrastructure for Indian dealer networks that sell on finance — so dealers, operations teams and finance partners work from the same record." />
      
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-line p-6 sm:p-8">
              <h2 className="font-display text-xl font-bold text-navy">What the platform does</h2>
              <ul className="mt-5 space-y-3.5">
                {does.map((d) =>
                <li key={d} className="flex gap-3 text-[15px] text-ink">
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" strokeWidth={2.5} /> {d}
                  </li>
                )}
              </ul>
            </div>
            <div className="rounded-2xl border border-line bg-canvas p-6 sm:p-8">
              <h2 className="font-display text-xl font-bold text-navy">What it does not do</h2>
              <ul className="mt-5 space-y-3.5">
                {doesNot.map((d) =>
                <li key={d} className="flex gap-3 text-[15px] text-ink">
                    <MinusIcon className="mt-0.5 h-4 w-4 shrink-0 text-muted" strokeWidth={2.5} /> {d}
                  </li>
                )}
              </ul>
            </div>
          </div>
          <div className="mt-12 max-w-3xl">
            <h2 className="font-display text-2xl font-bold text-navy">A manual-first Phase 1</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              The first phase focuses on a dependable manual processing workflow: operations staff submit cases to partners and record each outcome. Bank and NBFC APIs, credit bureau checks, eKYC and eSign are planned as later integrations, each subject to official partner approval and separate written agreement.
            </p>
          </div>
        </div>
      </section>
      <CtaSection />
    </>);

}