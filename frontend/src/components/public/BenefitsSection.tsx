import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, CheckIcon } from 'lucide-react';
import { buttonClasses } from '../ui/Button';
import { SectionHeading } from './SectionHeading';
import { dealerBenefits } from '../../data/marketing';

export function BenefitsSection() {
  return (
    <section className="bg-navy py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading
            tone="light"
            title="One Workspace for Your Dealer Finance Operations"
            description="Replace spreadsheets, chat threads and paper files with a single record of every customer, application and document — visible to you and the operations team." />
          
          <Link to="/dealer-register" className={buttonClasses('primary', 'lg', 'mt-8 bg-white text-navy hover:bg-[#EAF0FA]')}>
            Become a Dealer <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
        <ul className="border-t border-white/10">
          {dealerBenefits.map((b) =>
          <li key={b} className="flex items-center gap-4 border-b border-white/10 py-4">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal/15 text-teal">
                <CheckIcon className="h-3.5 w-3.5" strokeWidth={3} />
              </span>
              <span className="text-[17px] font-medium text-white">{b}</span>
            </li>
          )}
        </ul>
      </div>
    </section>);

}