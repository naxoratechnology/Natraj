import React from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { SupportWorkspace } from '../../components/shared/SupportWorkspace';

export function AdminSupport() {
  return (
    <div>
      <PageHeader title="Support tickets" description="Dealer tickets with priority, assignment, conversation and internal notes." />
      <SupportWorkspace mode="admin" />
    </div>);

}