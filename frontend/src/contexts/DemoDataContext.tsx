import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { applications as seedApplications } from '../data/applications';
import { customers as seedCustomers } from '../data/customers';
import { dealers as seedDealers } from '../data/dealers';
import { partners as seedPartners } from '../data/partners';
import { adminNotifications, dealerNotifications } from '../data/notifications';
import { CURRENT_DEALER_ID } from '../data/session';
import { TODAY } from '../utils/format';
import type { AppNote, Customer, Dealer, FinanceApplication, FinancePartner, NotificationItem } from '../types/finance';

type Scope = 'dealer' | 'admin';

interface DemoDataValue {
  emptyDealer: boolean;
  applications: FinanceApplication[];
  dealerApplications: FinanceApplication[];
  customers: Customer[];
  dealerCustomers: Customer[];
  dealers: Dealer[];
  partners: FinancePartner[];
  notes: AppNote[];
  notifications: Record<Scope, NotificationItem[]>;
  addApplication: (app: FinanceApplication) => void;
  updateApplication: (id: string, patch: Partial<FinanceApplication>) => void;
  addCustomer: (customer: Customer) => void;
  updateDealer: (id: string, patch: Partial<Dealer>) => void;
  savePartner: (partner: FinancePartner) => void;
  addNote: (note: Omit<AppNote, 'id' | 'time'>) => void;
  markRead: (scope: Scope, id: string) => void;
  markAllRead: (scope: Scope) => void;
}

const DemoDataContext = createContext<DemoDataValue | null>(null);

const seedNotes: AppNote[] = [
{ id: 'NT-1', appId: 'FA-26-10418', author: 'Neha Joshi', body: 'Case shared with Udaan Consumer Finance relationship desk. Lender reference recorded.', time: '2026-10-14T16:05:00+05:30', internal: false },
{ id: 'NT-2', appId: 'FA-26-10418', author: 'Neha Joshi', body: 'Lender contact mentioned decision expected after bank statement review. Follow up on 16 Oct.', time: '2026-10-14T16:08:00+05:30', internal: true },
{ id: 'NT-3', appId: 'FA-26-10417', author: 'Neha Joshi', body: 'Address on identity proof differs from current residence. Please upload a utility bill or rent agreement for the current address.', time: '2026-10-13T11:45:00+05:30', internal: false }];


export function DemoDataProvider({ emptyDealer, children }: {emptyDealer: boolean;children: React.ReactNode;}) {
  const [applications, setApplications] = useState(seedApplications);
  const [customers, setCustomers] = useState(seedCustomers);
  const [dealers, setDealers] = useState(seedDealers);
  const [partners, setPartners] = useState(seedPartners);
  const [notes, setNotes] = useState(seedNotes);
  const [notifications, setNotifications] = useState<Record<Scope, NotificationItem[]>>({
    dealer: dealerNotifications,
    admin: adminNotifications
  });

  const addApplication = useCallback((app: FinanceApplication) => setApplications((prev) => [app, ...prev]), []);
  const updateApplication = useCallback(
    (id: string, patch: Partial<FinanceApplication>) =>
    setApplications((prev) => prev.map((a) => a.id === id ? { ...a, ...patch, updatedAt: TODAY.toISOString() } : a)),
    []
  );
  const addCustomer = useCallback((c: Customer) => setCustomers((prev) => [c, ...prev]), []);
  const updateDealer = useCallback(
    (id: string, patch: Partial<Dealer>) => setDealers((prev) => prev.map((d) => d.id === id ? { ...d, ...patch } : d)),
    []
  );
  const savePartner = useCallback(
    (p: FinancePartner) =>
    setPartners((prev) => prev.some((x) => x.id === p.id) ? prev.map((x) => x.id === p.id ? p : x) : [...prev, p]),
    []
  );
  const addNote = useCallback(
    (n: Omit<AppNote, 'id' | 'time'>) =>
    setNotes((prev) => [...prev, { ...n, id: `NT-${prev.length + 1}-${Date.now()}`, time: TODAY.toISOString() }]),
    []
  );
  const markRead = useCallback(
    (scope: Scope, id: string) =>
    setNotifications((prev) => ({ ...prev, [scope]: prev[scope].map((n) => n.id === id ? { ...n, read: true } : n) })),
    []
  );
  const markAllRead = useCallback(
    (scope: Scope) => setNotifications((prev) => ({ ...prev, [scope]: prev[scope].map((n) => ({ ...n, read: true })) })),
    []
  );

  const value = useMemo<DemoDataValue>(() => {
    const isNewApp = (a: FinanceApplication) => !seedApplications.some((s) => s.id === a.id);
    const isNewCustomer = (c: Customer) => !seedCustomers.some((s) => s.id === c.id);
    return {
      emptyDealer,
      applications,
      dealerApplications: applications.filter((a) => a.dealerId === CURRENT_DEALER_ID && (!emptyDealer || isNewApp(a))),
      customers,
      dealerCustomers: customers.filter((c) => c.dealerId === CURRENT_DEALER_ID && (!emptyDealer || isNewCustomer(c))),
      dealers,
      partners,
      notes,
      notifications: emptyDealer ? { ...notifications, dealer: [] } : notifications,
      addApplication,
      updateApplication,
      addCustomer,
      updateDealer,
      savePartner,
      addNote,
      markRead,
      markAllRead
    };
  }, [emptyDealer, applications, customers, dealers, partners, notes, notifications, addApplication, updateApplication, addCustomer, updateDealer, savePartner, addNote, markRead, markAllRead]);

  return <DemoDataContext.Provider value={value}>{children}</DemoDataContext.Provider>;
}

export function useDemoData(): DemoDataValue {
  const ctx = useContext(DemoDataContext);
  if (!ctx) throw new Error('useDemoData must be used within DemoDataProvider');
  return ctx;
}