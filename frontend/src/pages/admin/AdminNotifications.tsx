import React from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { NotificationCenter } from '../../components/shared/NotificationCenter';

export function AdminNotifications() {
  return (
    <div>
      <PageHeader title="Notifications" description="Dealer submissions, verification, document corrections, new applications, support tickets and status changes." />
      <NotificationCenter scope="admin" />
      <p className="mt-3 text-xs text-muted">In-app notifications only. Email/SMS delivery is simulated in this prototype.</p>
    </div>);

}