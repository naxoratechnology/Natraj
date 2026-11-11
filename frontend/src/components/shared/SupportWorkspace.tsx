import React, { useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeftIcon, InboxIcon, LockIcon, PaperclipIcon, PlusIcon, SendIcon, XIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { toast } from 'sonner';
import { StatusBadge } from '../ui/StatusBadge';
import { SearchInput } from '../ui/SearchInput';
import { FilterSelect } from '../ui/FilterSelect';
import { Button } from '../ui/Button';
import { inputClass } from '../ui/Field';
import { SelectInput } from '../ui/SelectInput';
import { EmptyState } from '../ui/EmptyState';
import { NewTicketModal } from './NewTicketModal';
import { tickets as seedTickets } from '../../data/tickets';
import { adminUsers } from '../../data/adminUsers';
import { currentAdminUser, currentDealerUser } from '../../data/session';
import { TODAY, formatDateTime, relativeTime } from '../../utils/format';
import type { SupportTicket } from '../../types/finance';

const statuses: SupportTicket['status'][] = ['Open', 'In Progress', 'Awaiting Dealer', 'Resolved'];

export function SupportWorkspace({ mode }: {mode: 'dealer' | 'admin';}) {
  const location = useLocation();
  const portalBase = location.pathname.startsWith('/super-admin') ? '/super-admin' : `/${mode}`;
  const isAdmin = mode === 'admin';
  const [tickets, setTickets] = useState<SupportTicket[]>(
    isAdmin ? seedTickets : seedTickets.filter((t) => t.dealerName === currentDealerUser.business)
  );
  const [selectedId, setSelectedId] = useState<string | null>(tickets[0]?.id ?? null);
  const [mobileDetail, setMobileDetail] = useState(false);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [reply, setReply] = useState('');
  const [attachment, setAttachment] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [newOpen, setNewOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(
    () =>
    tickets.
    filter((t) => !status || t.status === status).
    filter((t) => !priority || t.priority === priority).
    filter((t) => !q || `${t.id} ${t.subject} ${t.dealerName} ${t.applicationId ?? ''}`.toLowerCase().includes(q.toLowerCase())),
    [tickets, status, priority, q]
  );
  const selected = tickets.find((t) => t.id === selectedId) ?? null;
  const author = isAdmin ? currentAdminUser.name : currentDealerUser.name;

  const patch = (id: string, p: Partial<SupportTicket>) => setTickets((prev) => prev.map((t) => t.id === id ? { ...t, ...p } : t));

  const sendReply = () => {
    if (!selected || !reply.trim()) return;
    patch(selected.id, {
      messages: [...selected.messages, { from: isAdmin ? 'support' : 'dealer', author, body: reply.trim(), time: TODAY.toISOString(), attachment: attachment ?? undefined }],
      status: isAdmin ? selected.status === 'Open' ? 'In Progress' : selected.status : selected.status === 'Awaiting Dealer' ? 'In Progress' : selected.status
    });
    setReply('');
    setAttachment(null);
    toast.success('Reply sent (demo)');
  };

  const addInternal = () => {
    if (!selected || !note.trim()) return;
    patch(selected.id, { internalNotes: [...selected.internalNotes, { author, time: TODAY.toISOString(), body: note.trim() }] });
    setNote('');
    toast.success('Internal note added');
  };

  return (
    <div className="grid overflow-hidden rounded-xl border border-line bg-white shadow-card lg:grid-cols-[340px_1fr]" style={{ minHeight: 620 }}>
      <div className={twMerge('flex flex-col border-line lg:border-r', mobileDetail && 'hidden lg:flex')}>
        <div className="space-y-2 border-b border-line p-3">
          <div className="flex gap-2">
            <SearchInput value={q} onChange={setQ} placeholder="Search tickets" className="flex-1" />
            {!isAdmin &&
            <Button size="sm" className="h-9" onClick={() => setNewOpen(true)} icon={<PlusIcon className="h-4 w-4" />}>
                New
              </Button>
            }
          </div>
          <div className="flex flex-wrap gap-2">
            <FilterSelect label="Status" value={status} onChange={setStatus} options={statuses} />
            {isAdmin && <FilterSelect label="Priority" value={priority} onChange={setPriority} options={['High', 'Medium', 'Low']} />}
          </div>
        </div>
        {filtered.length === 0 ?
        <EmptyState icon={InboxIcon} title="No tickets" description={isAdmin ? 'No tickets match these filters.' : 'Raise a ticket if you need help with an application.'} /> :

        <ul className="flex-1 divide-y divide-line overflow-y-auto">
            {filtered.map((t) =>
          <li key={t.id}>
                <button
              onClick={() => {
                setSelectedId(t.id);
                setMobileDetail(true);
              }}
              className={twMerge('w-full px-4 py-3.5 text-left transition-colors duration-100', t.id === selectedId ? 'bg-brand-50/60' : 'hover:bg-[#F7F9FD]')}>
              
                  <div className="flex items-center justify-between gap-2">
                    <span className="num text-xs font-medium text-muted">{t.id}</span>
                    <span className="text-[11px] text-muted">{relativeTime(t.messages[t.messages.length - 1].time)}</span>
                  </div>
                  <p className="mt-1 truncate text-sm font-medium text-ink">{t.subject}</p>
                  {isAdmin && <p className="mt-0.5 truncate text-xs text-muted">{t.dealerName}</p>}
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <StatusBadge status={t.status} size="sm" />
                    {isAdmin && <StatusBadge status={t.priority} size="sm" />}
                    {t.applicationId && <span className="num text-[11px] text-muted">{t.applicationId}</span>}
                  </div>
                </button>
              </li>
          )}
          </ul>
        }
      </div>

      <div className={twMerge('flex min-w-0 flex-col', !mobileDetail && 'hidden lg:flex')}>
        {selected ?
        <>
            <div className="border-b border-line px-5 py-4">
              <button onClick={() => setMobileDetail(false)} className="mb-2 flex items-center gap-1 text-xs font-medium text-muted lg:hidden">
                <ArrowLeftIcon className="h-3.5 w-3.5" /> All tickets
              </button>
              <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-ink">{selected.subject}</h2>
                  <p className="mt-1 text-xs text-muted">
                    <span className="num">{selected.id}</span> · {selected.dealerName} · opened {formatDateTime(selected.createdAt)}
                    {selected.applicationId &&
                  <>
                        {' · '}
                        <Link to={`${portalBase}/applications/${selected.applicationId}`} className="num font-medium text-brand hover:underline">
                          {selected.applicationId}
                        </Link>
                      </>
                  }
                  </p>
                </div>
                {isAdmin ?
              <div className="flex shrink-0 flex-wrap gap-2">
                    <div className="w-40">
                      <SelectInput aria-label="Assigned staff" value={selected.assignedTo} onChange={(e) => {patch(selected.id, { assignedTo: e.target.value });toast.success(`Assigned to ${e.target.value}`);}} options={['Unassigned', ...adminUsers.filter((u) => u.status === 'Active').map((u) => u.name)]} className="h-9 text-[13px]" />
                    </div>
                    <div className="w-40">
                      <SelectInput aria-label="Ticket status" value={selected.status} onChange={(e) => {patch(selected.id, { status: e.target.value as SupportTicket['status'] });toast.success('Status updated');}} options={statuses} className="h-9 text-[13px]" />
                    </div>
                  </div> :

              <StatusBadge status={selected.status} />
              }
              </div>
            </div>

            <div className="grid flex-1 xl:grid-cols-[1fr_280px]">
              <div className="flex min-w-0 flex-col">
                <ol className="flex-1 space-y-4 overflow-y-auto bg-[#FAFBFD] p-5">
                  {selected.messages.map((m, i) => {
                  const mine = m.from === 'support' === isAdmin;
                  return (
                    <li key={i} className={twMerge('flex', mine ? 'justify-end' : 'justify-start')}>
                        <div className={twMerge('max-w-[85%] rounded-xl px-4 py-3', mine ? 'bg-navy text-white' : 'border border-line bg-white text-ink')}>
                          <div className={twMerge('flex items-center gap-2 text-[11px]', mine ? 'text-[#B4C1D4]' : 'text-muted')}>
                            <span className="font-semibold">{m.author}</span>
                            <span>·</span>
                            <span>{formatDateTime(m.time)}</span>
                          </div>
                          <p className="mt-1 text-[13px] leading-relaxed">{m.body}</p>
                          {m.attachment &&
                        <span className={twMerge('mt-2 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs', mine ? 'bg-white/10' : 'bg-canvas')}>
                              <PaperclipIcon className="h-3 w-3" /> {m.attachment}
                            </span>
                        }
                        </div>
                      </li>);

                })}
                </ol>
                {selected.status !== 'Resolved' ?
              <div className="border-t border-line p-4">
                    <label htmlFor="ticket-reply" className="sr-only">
                      Reply
                    </label>
                    <textarea id="ticket-reply" rows={3} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Write a reply…" className={inputClass(false, 'h-auto resize-none py-2')} />
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-muted hover:bg-canvas hover:text-ink">
                          <PaperclipIcon className="h-3.5 w-3.5" /> Attach
                        </button>
                        <input ref={fileRef} type="file" className="sr-only" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setAttachment(e.target.files?.[0]?.name ?? null)} />
                        {attachment &&
                    <span className="inline-flex items-center gap-1 rounded bg-canvas px-2 py-1 text-xs text-ink">
                            {attachment}
                            <button onClick={() => setAttachment(null)} aria-label="Remove attachment">
                              <XIcon className="h-3 w-3" />
                            </button>
                          </span>
                    }
                      </div>
                      <Button size="sm" onClick={sendReply} disabled={!reply.trim()} icon={<SendIcon className="h-3.5 w-3.5" />}>
                        Send
                      </Button>
                    </div>
                  </div> :

              <p className="border-t border-line p-4 text-center text-xs text-muted">This ticket is resolved. {isAdmin ? 'Change the status to reopen it.' : 'Raise a new ticket if you need more help.'}</p>
              }
              </div>
              {isAdmin &&
            <aside className="border-t border-line p-4 xl:border-l xl:border-t-0">
                  <h3 className="flex items-center gap-1.5 text-xs font-semibold text-ink">
                    <LockIcon className="h-3.5 w-3.5 text-warning-700" /> Internal notes
                  </h3>
                  <p className="mt-0.5 text-[11px] text-muted">Never visible to the dealer.</p>
                  <ul className="mt-3 space-y-2">
                    {selected.internalNotes.length === 0 && <li className="text-xs text-muted">No internal notes.</li>}
                    {selected.internalNotes.map((n, i) =>
                <li key={i} className="rounded-lg bg-warning-50/70 p-2.5">
                        <p className="text-[12px] leading-relaxed text-ink">{n.body}</p>
                        <p className="mt-1 text-[11px] text-muted">
                          {n.author} · {relativeTime(n.time)}
                        </p>
                      </li>
                )}
                  </ul>
                  <textarea aria-label="Internal note" rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add internal note" className={inputClass(false, 'mt-3 h-auto resize-none py-2 text-[13px]')} />
                  <Button size="sm" variant="secondary" className="mt-2 w-full" onClick={addInternal} disabled={!note.trim()}>
                    Save note
                  </Button>
                </aside>
            }
            </div>
          </> :

        <EmptyState icon={InboxIcon} title="Select a ticket" description="Choose a ticket to view the conversation." />
        }
      </div>

      {!isAdmin &&
      <NewTicketModal
        open={newOpen}
        onClose={() => setNewOpen(false)}
        onCreate={(t) => {
          setTickets((prev) => [t, ...prev]);
          setSelectedId(t.id);
          setMobileDetail(true);
        }} />

      }
    </div>);

}
