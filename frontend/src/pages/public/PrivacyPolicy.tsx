import React from 'react';
import { LegalPage } from '../../components/public/LegalPage';
import { privacySections } from '../../data/legal';

export function PrivacyPolicy() {
  return <LegalPage title="Privacy Policy" description="How dealer and application information is handled on the platform." updated="15 October 2026" sections={privacySections} />;
}