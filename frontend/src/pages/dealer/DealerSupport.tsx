import React from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { SupportWorkspace } from '../../components/shared/SupportWorkspace';

export function DealerSupport() {
  return (
    <div>
      <PageHeader breadcrumbs={[{ label: 'Dashboard', to: '/dealer/dashboard' }, { label: 'Support' }]} title="Support" description="Raise and track tickets with the operations support team." />
      <SupportWorkspace mode="dealer" />
    </div>);

}