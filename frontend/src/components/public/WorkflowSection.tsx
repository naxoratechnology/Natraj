import React from 'react';
import { CpuIcon, UserCogIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { SectionHeading } from './SectionHeading';
import { workflowSteps, type StepActor } from '../../data/marketing';

function ActorTag({ actor }: {actor: StepActor;}) {
  const system = actor.includes('System');
  const ops = actor.includes('Operations');
  return (
    <div className="flex flex-wrap gap-1.5">
      {system &&
      <span className="inline-flex items-center gap-1 rounded-md bg-brand-50 px-1.5 py-0.5 text-[11px] font-medium text-brand-700">
          <CpuIcon className="h-3 w-3" /> System
        </span>
      }
      {ops &&
      <span className="inline-flex items-center gap-1 rounded-md bg-warning-50 px-1.5 py-0.5 text-[11px] font-medium text-warning-700">
          <UserCogIcon className="h-3 w-3" /> Manual
        </span>
      }
    </div>);

}

export function WorkflowSection({ tone = 'canvas' }: {tone?: 'canvas' | 'white';}) {
  return (
    <section className={twMerge('py-20 sm:py-24', tone === 'canvas' ? 'bg-canvas' : 'bg-white')} id="how-it-works">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            title="How the platform works"
            description="From dealer registration to a recorded disbursement, every step has a clear owner. Phase 1 lender processing is handled manually by the operations team." />
          
          <div className="flex gap-4 text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <CpuIcon className="h-3.5 w-3.5 text-brand" /> Automated system action
            </span>
            <span className="flex items-center gap-1.5">
              <UserCogIcon className="h-3.5 w-3.5 text-warning-700" /> Manual operations step
            </span>
          </div>
        </div>

        <ol className="relative mt-14 grid gap-0 lg:grid-cols-6 lg:gap-6">
          <span className="absolute left-[19px] top-5 bottom-5 w-px bg-line lg:left-5 lg:right-5 lg:top-5 lg:bottom-auto lg:h-px lg:w-auto" aria-hidden />
          {workflowSteps.map((s, i) =>
          <li key={s.title} className="relative flex gap-4 pb-8 last:pb-0 lg:flex-col lg:gap-0 lg:pb-0">
              <span className="num relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-white font-display text-sm font-bold text-navy shadow-card">
                {i + 1}
              </span>
              <div className="lg:mt-5">
                <h3 className="font-display text-[15px] font-bold text-navy">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.body}</p>
                <div className="mt-3">
                  <ActorTag actor={s.actor} />
                </div>
              </div>
            </li>
          )}
        </ol>
      </div>
    </section>);

}