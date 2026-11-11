import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BellOffIcon, CheckCheckIcon, ChevronRightIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { Tabs } from '../ui/Tabs';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { useDemoData } from '../../contexts/DemoDataContext';
import { formatDateTime, relativeTime } from '../../utils/format';

export function NotificationCenter({ scope }: {scope: 'dealer' | 'admin';}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { notifications, markRead, markAllRead } = useDemoData();
  const items = notifications[scope];
  const [tab, setTab] = useState('all');

  const types = useMemo(() => Array.from(new Set(items.map((n) => n.type))), [items]);
  const unread = items.filter((n) => !n.read).length;
  const filtered = items.
  filter((n) => tab === 'all' ? true : tab === 'unread' ? !n.read : n.type === tab).
  sort((a, b) => +new Date(b.time) - +new Date(a.time));

  return (
    <div className="rounded-xl border border-line bg-white shadow-card">
      <div className="flex flex-col gap-3 px-5 pt-3 sm:flex-row sm:items-end sm:justify-between">
        <Tabs
          className="border-0 sm:flex-1"
          value={tab}
          onChange={setTab}
          tabs={[{ id: 'all', label: 'All', count: items.length }, { id: 'unread', label: 'Unread', count: unread }, ...types.map((t) => ({ id: t, label: t }))]} />
        
        <Button variant="ghost" size="sm" className="mb-2 self-start" disabled={unread === 0} onClick={() => markAllRead(scope)} icon={<CheckCheckIcon className="h-4 w-4" />}>
          Mark all as read
        </Button>
      </div>
      <div className="border-t border-line">
        {filtered.length === 0 ?
        <EmptyState icon={BellOffIcon} title={tab === 'unread' ? 'You’re all caught up' : 'No notifications'} description="New activity on your records will appear here." /> :

        <ul className="divide-y divide-line">
            {filtered.map((n) =>
          <li key={n.id}>
                <button
              onClick={() => {
                markRead(scope, n.id);
                if (n.link) navigate(location.pathname.startsWith('/super-admin') ? n.link.replace(/^\/admin/, '/super-admin') : n.link);
              }}
              className={twMerge('group flex w-full items-start gap-4 px-5 py-4 text-left transition-colors duration-100 hover:bg-[#F7F9FD]', !n.read && 'bg-brand-50/40')}>
              
                  <span className={twMerge('mt-1.5 h-2 w-2 shrink-0 rounded-full', n.read ? 'bg-transparent' : 'bg-brand')} aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className={twMerge('text-sm', n.read ? 'font-medium text-ink' : 'font-semibold text-navy')}>{n.title}</span>
                      <span className="rounded bg-[#EEF1F6] px-1.5 py-0.5 text-[11px] font-medium text-muted">{n.type}</span>
                      {!n.read && <span className="sr-only">Unread</span>}
                    </span>
                    <span className="mt-1 block text-[13px] text-muted">{n.body}</span>
                    <span className="mt-1.5 block text-xs text-muted" title={formatDateTime(n.time)}>
                      {relativeTime(n.time)}
                    </span>
                  </span>
                  {n.link && <ChevronRightIcon className="mt-1 h-4 w-4 shrink-0 text-muted opacity-0 transition-opacity duration-150 group-hover:opacity-100" />}
                </button>
              </li>
          )}
          </ul>
        }
      </div>
    </div>);

}
