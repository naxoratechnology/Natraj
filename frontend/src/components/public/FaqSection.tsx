import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { PlusIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { SectionHeading } from './SectionHeading';
import { faqs } from '../../data/marketing';

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="bg-white py-20 sm:py-24" id="faq">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <div>
          <SectionHeading title="Frequently asked questions" description="Answers about registration, documents, processing and payouts." />
          <p className="mt-6 text-sm text-muted">
            Have a different question?{' '}
            <Link to="/contact" className="font-medium text-brand hover:underline">
              Contact the team
            </Link>
          </p>
        </div>
        <div className="border-t border-line">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="border-b border-line">
                <h3>
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left">
                    
                    <span className="text-[16px] font-semibold text-navy">{f.q}</span>
                    <PlusIcon
                      className={twMerge('h-4 w-4 shrink-0 text-muted transition-transform duration-200 ease-out', isOpen && 'rotate-45 text-brand')}
                      aria-hidden />
                    
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen &&
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                    className="overflow-hidden">
                    
                      <p className="pb-5 pr-10 text-[15px] leading-relaxed text-muted">{f.a}</p>
                    </motion.div>
                  }
                </AnimatePresence>
              </div>);

          })}
        </div>
      </div>
    </section>);

}