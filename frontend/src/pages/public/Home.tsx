import React from 'react';
import { HeroSection } from '../../components/public/HeroSection';
import { ValueSection } from '../../components/public/ValueSection';
import { WorkflowSection } from '../../components/public/WorkflowSection';
import { FeaturesSection } from '../../components/public/FeaturesSection';
import { SolutionsSection } from '../../components/public/SolutionsSection';
import { BenefitsSection } from '../../components/public/BenefitsSection';
import { PartnersSection } from '../../components/public/PartnersSection';
import { SecuritySection } from '../../components/public/SecuritySection';
import { FaqSection } from '../../components/public/FaqSection';
import { CtaSection } from '../../components/public/CtaSection';

export function Home() {
  return (
    <>
      <HeroSection />
      <ValueSection />
      <WorkflowSection tone="white" />
      <FeaturesSection />
      <SolutionsSection />
      <BenefitsSection />
      <PartnersSection />
      <SecuritySection />
      <FaqSection />
      <CtaSection />
    </>);

}