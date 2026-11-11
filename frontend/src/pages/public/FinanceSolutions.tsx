import React from 'react';
import { PageIntro } from '../../components/public/PageIntro';
import { SolutionsSection } from '../../components/public/SolutionsSection';
import { PartnersSection } from '../../components/public/PartnersSection';
import { CtaSection } from '../../components/public/CtaSection';

export function FinanceSolutions() {
  return (
    <>
      <PageIntro
        title="Finance solutions"
        description="Structured workflows for EV, electronics, furniture and consumer durable financing — covering both new loans and existing finance or card-limit cases." />
      
      <SolutionsSection />
      <PartnersSection />
      <CtaSection />
    </>);

}