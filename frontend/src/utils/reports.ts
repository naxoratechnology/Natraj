import type { CommissionRule, FinanceApplication } from '../types/finance';

export type ReportType = 'dealer' | 'partner' | 'status' | 'outcome' | 'disbursement' | 'daily' | 'payout';

export interface ReportColumn {
  label: string;
  money?: boolean;
  align?: 'right';
}

export interface ReportResult {
  columns: ReportColumn[];
  rows: (string | number)[][];
  note?: string;
}

const approvedSet = ['Approved', 'Disbursement Pending', 'Disbursed'];

function groupBy(apps: FinanceApplication[], key: (a: FinanceApplication) => string) {
  const map = new Map<string, FinanceApplication[]>();
  apps.forEach((a) => map.set(key(a), [...(map.get(key(a)) ?? []), a]));
  return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length);
}

function findRule(a: FinanceApplication, rules: CommissionRule[]) {
  return rules.find((r) => r.active && r.partnerId === a.partnerId && (r.product === 'All categories' || r.product === a.category));
}

export function buildReport(type: ReportType, apps: FinanceApplication[], rules: CommissionRule[]): ReportResult {
  switch (type) {
    case 'dealer':
    case 'partner':{
        const groups = groupBy(apps, (a) => type === 'dealer' ? a.dealerName : a.partnerName);
        return {
          columns: [{ label: type === 'dealer' ? 'Dealer' : 'Finance partner' }, { label: 'Applications', align: 'right' }, { label: 'Amount requested', money: true, align: 'right' }, { label: 'Approved', align: 'right' }, { label: 'Rejected', align: 'right' }, { label: 'Disbursed', align: 'right' }, { label: 'Approval rate', align: 'right' }],
          rows: groups.map(([name, list]) => {
            const approved = list.filter((a) => approvedSet.includes(a.status)).length;
            const rejected = list.filter((a) => a.status === 'Rejected').length;
            const decided = approved + rejected;
            return [name, list.length, list.reduce((s, a) => s + a.amount, 0), approved, rejected, list.filter((a) => a.status === 'Disbursed').length, decided ? `${Math.round(approved / decided * 100)}%` : '—'];
          }),
          note: 'Approval rate = recorded approvals ÷ recorded lender decisions.'
        };
      }
    case 'status':{
        const groups = groupBy(apps, (a) => a.status);
        return {
          columns: [{ label: 'Status' }, { label: 'Applications', align: 'right' }, { label: 'Share', align: 'right' }, { label: 'Amount', money: true, align: 'right' }],
          rows: groups.map(([s, list]) => [s, list.length, `${Math.round(list.length / Math.max(1, apps.length) * 100)}%`, list.reduce((x, a) => x + a.amount, 0)])
        };
      }
    case 'outcome':
      return {
        columns: [{ label: 'Application' }, { label: 'Dealer' }, { label: 'Partner' }, { label: 'Amount', money: true, align: 'right' }, { label: 'Decision' }, { label: 'Recorded' }, { label: 'Lender remarks' }],
        rows: apps.
        filter((a) => [...approvedSet, 'Rejected'].includes(a.status)).
        map((a) => [a.id, a.dealerName, a.partnerName, a.amount, a.status === 'Rejected' ? 'Rejected' : 'Approved', a.updatedAt.slice(0, 10), a.lenderRemarks ?? '—'])
      };
    case 'disbursement':
      return {
        columns: [{ label: 'Application' }, { label: 'Dealer' }, { label: 'Customer' }, { label: 'Partner' }, { label: 'Amount', money: true, align: 'right' }, { label: 'Disbursement ref.' }, { label: 'Date' }, { label: 'Status' }],
        rows: apps.
        filter((a) => ['Disbursement Pending', 'Disbursed'].includes(a.status)).
        map((a) => [a.id, a.dealerName, a.customerName, a.partnerName, a.disbursedAmount ?? a.amount, a.disbursementRef ?? '—', a.disbursementDate ?? '—', a.status]),
        note: 'Disbursements are recorded by operations from lender confirmation. Funds move directly between lender and dealer/customer.'
      };
    case 'daily':{
        const groups = groupBy(apps, (a) => a.createdAt.slice(0, 10)).sort((a, b) => a[0] < b[0] ? 1 : -1);
        return {
          columns: [{ label: 'Date' }, { label: 'Applications created', align: 'right' }, { label: 'Amount requested', money: true, align: 'right' }, { label: 'Still open', align: 'right' }],
          rows: groups.map(([d, list]) => [d, list.length, list.reduce((s, a) => s + a.amount, 0), list.filter((a) => !['Disbursed', 'Rejected', 'Cancelled'].includes(a.status)).length])
        };
      }
    case 'payout':
      return {
        columns: [{ label: 'Application' }, { label: 'Partner' }, { label: 'Disbursed amount', money: true, align: 'right' }, { label: 'Rule' }, { label: 'Expected gross', money: true, align: 'right' }, { label: 'Expected dealer share', money: true, align: 'right' }, { label: 'Expected platform share', money: true, align: 'right' }, { label: 'Confirmed received' }],
        rows: apps.
        filter((a) => a.status === 'Disbursed').
        map((a) => {
          const rule = findRule(a, rules);
          const amt = a.disbursedAmount ?? a.amount;
          const gross = rule ? Math.round(rule.type === 'Percentage' ? amt * rule.rate / 100 : rule.fixedAmount) : 0;
          const dealer = rule ? Math.round(gross * rule.dealerShare / 100) : 0;
          return [a.id, a.partnerName, amt, rule?.id ?? 'No active rule', gross, dealer, gross - dealer, 'Not tracked'];
        }),
        note: 'Expected values are estimates from configured rules. Confirmed or received payments are not tracked in Phase 1.'
      };
  }
}