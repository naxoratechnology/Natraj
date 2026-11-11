import React from 'react';
import { LegalPage } from '../../components/public/LegalPage';
import { termsSections } from '../../data/legal';

export function Terms() {
  return <LegalPage title="Terms & Conditions" description="The terms that govern dealer access to the platform." updated="15 October 2026" sections={termsSections} />;
}