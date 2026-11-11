import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { SectionHeading } from './SectionHeading';
import { featureGroups } from '../../data/marketing';

export function FeaturesSection() {
  const [active, setActive] = useState(featureGroups[0].id);
  const group = featureGroups.find((g) => g.id === active)!;

  return (
    <section className="bg-white py-20 sm:py-24" id="features">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          title="Everything a dealer finance operation needs, in one place"
          description="Four connected modules cover the full lifecycle — from verifying a new dealer to recording a lender’s final decision." />
        
        <div className="mt-12 grid gap-6 lg:grid-cols-[360px_1fr]">
          <div className="flex gap-2 overflow-x-auto no-scrollbar lg:flex-col" role="tablist" aria-label="Feature groups">
            {featureGroups.map((g) => {
              const on = g.id === active;
              return (
                <button
                  key={g.id}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActive(g.id)}
                  className={twMerge(
                    'min-w-[240px] rounded-xl border p-4 text-left transition-colors duration-150 lg:min-w-0',
                    on ? 'border-brand bg-brand-50/60' : 'border-line bg-white hover:border-[#CFD8E4]'
                  )}>
                  
                  <p className={twMerge('font-display text-[15px] font-bold', on ? 'text-brand-700' : 'text-navy')}>{g.title}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-muted">{g.summary}</p>
                </button>);

            })}
          </div>
          <div className="rounded-2xl border border-line bg-canvas p-6 sm:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}>
                
                <h3 className="font-display text-xl font-bold text-navy">{group.title}</h3>
                <ul className="mt-6 grid gap-x-8 sm:grid-cols-2">
                  {group.items.map((item) =>
                  <li key={item} className="flex items-center gap-3 border-b border-line py-3.5 text-[15px] text-ink">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-teal-700 ring-1 ring-line">
                        <CheckIcon className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {item}
                    </li>
                  )}
                </ul>
                {group.id === 'operations' &&
                <p className="mt-6 text-[13px] leading-relaxed text-muted">
                    Phase 1 runs lender processing manually. Direct bank or NBFC integrations require official partner approval, documentation and credentials.
                  </p>
                }
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>);

}