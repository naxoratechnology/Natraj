import React from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { NotificationCenter } from '../../components/shared/NotificationCenter';

export function DealerNotifications() {
  return (
    <div>
      <PageHeader breadcrumbs={[{ label: 'Dashboard', to: '/dealer/dashboard' }, { label: 'Notifications' }]} title="Notifications" description="Updates on your applications, documents and support tickets." />
      <NotificationCenter scope="dealer" />
    </div>);

}