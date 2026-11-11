import React from 'react';
import { PageIntro } from '../../components/public/PageIntro';
import { WorkflowSection } from '../../components/public/WorkflowSection';
import { CtaSection } from '../../components/public/CtaSection';
import { StatusBadge } from '../../components/ui/StatusBadge';

const lifecycle = ['Draft', 'Pending', 'Documents Required', 'Processing', 'Awaiting Lender', 'Approved', 'Rejected', 'Disbursement Pending', 'Disbursed', 'Cancelled'];

export function HowItWorks() {
  return (
    <>
      <PageIntro
        title="How the platform works"
        description="A clear, step-by-step workflow from dealer registration to a recorded lender outcome — with manual operations steps called out honestly." />
      
      <WorkflowSection tone="white" />
      <section className="bg-canvas py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-navy">Every application has a recorded status</h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Statuses represent events recorded by the dealer, the system or the operations team. They are not real-time bank data. When a lender communicates a decision, operations records it — and the dealer sees it immediately.
            </p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-6">
            <p className="text-sm font-semibold text-ink">Application statuses</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {lifecycle.map((s) =>
              <StatusBadge key={s} status={s} />
              )}
            </div>
            <p className="mt-5 text-[13px] leading-relaxed text-muted">
              Typical path: Created → Submitted → Documents Required / Verified → Processing → Approved / Rejected → Disbursement Pending → Disbursed.
            </p>
          </div>
        </div>
      </section>
      <div className="pt-20">
        <CtaSection />
      </div>
    </>);

}