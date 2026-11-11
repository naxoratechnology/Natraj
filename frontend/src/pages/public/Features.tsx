import React from 'react';
import { PageIntro } from '../../components/public/PageIntro';
import { FeaturesSection } from '../../components/public/FeaturesSection';
import { SecuritySection } from '../../components/public/SecuritySection';
import { CtaSection } from '../../components/public/CtaSection';

export function Features() {
  return (
    <>
      <PageIntro
        title="Platform features"
        description="Dealer onboarding, customer records, finance applications, partner configuration and governance — designed as one connected system." />
      
      <FeaturesSection />
      <SecuritySection />
      <div className="pt-20">
        <CtaSection />
      </div>
    </>);

}