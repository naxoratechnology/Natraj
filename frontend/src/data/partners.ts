import type { CommissionRule, FinancePartner } from '../types/finance';

/** Fictional demo partners. Real partner availability depends on signed commercial relationships. */
export const partners: FinancePartner[] = [
{ id: 'P-01', name: 'Northbridge Bank', type: 'Banking', categories: ['EV', 'Electronics', 'Consumer Durables'], financeTypes: ['New Loan'], mode: 'Manual', priority: 1, active: true, notes: 'Applications shared with partner relationship desk via secure email. Typical turnaround noted by ops: 2–4 working days.' },
{ id: 'P-02', name: 'Sahyog Finserv', type: 'NBFC', categories: ['EV', 'Electronics', 'Furniture', 'Consumer Durables'], financeTypes: ['New Loan', 'Existing Finance / Card Limit'], mode: 'Manual', priority: 2, active: true, notes: 'Partner portal access held by Finance Operations team only.' },
{ id: 'P-03', name: 'Udaan Consumer Finance', type: 'Consumer Finance', categories: ['Electronics', 'Furniture', 'Consumer Durables'], financeTypes: ['New Loan', 'Existing Finance / Card Limit'], mode: 'Manual', priority: 3, active: true, notes: 'Requires invoice copy before disbursement.' },
{ id: 'P-04', name: 'CardEMI Network', type: 'Credit Card / EMI', categories: ['Electronics', 'Consumer Durables'], financeTypes: ['Existing Finance / Card Limit'], mode: 'Future Integration', priority: 4, active: true, notes: 'API integration under discussion. Requires official partner approval, documentation and credentials — outside Phase 1 scope.' },
{ id: 'P-05', name: 'VoltDrive EV Finance', type: 'EV Finance', categories: ['EV'], financeTypes: ['New Loan'], mode: 'Manual', priority: 2, active: true, notes: 'EV-only partner. Vehicle registration details needed post-approval.' },
{ id: 'P-06', name: 'Pragati Capital', type: 'NBFC', categories: ['Furniture', 'Consumer Durables'], financeTypes: ['New Loan'], mode: 'Manual', priority: 5, active: false, notes: 'Commercial agreement under renewal. Paused for new applications.' }];


/** Hypothetical configuration examples. Actual rates must come from signed commercial agreements. */
export const commissionRules: CommissionRule[] = [
{ id: 'CR-01', partnerId: 'P-02', product: 'All categories', type: 'Percentage', rate: 2, fixedAmount: 0, dealerShare: 70, trigger: 'On disbursement', effectiveFrom: '2026-07-01', effectiveTo: '2027-03-31', clawback: 'Full clawback if loan is cancelled within 30 days of disbursement.', active: true },
{ id: 'CR-02', partnerId: 'P-05', product: 'EV', type: 'Percentage', rate: 1.5, fixedAmount: 0, dealerShare: 60, trigger: 'On lender payout confirmation', effectiveFrom: '2026-08-01', effectiveTo: '2027-07-31', clawback: 'Pro-rata clawback on foreclosure within 90 days.', active: true },
{ id: 'CR-03', partnerId: 'P-04', product: 'Electronics', type: 'Fixed Amount', rate: 0, fixedAmount: 350, dealerShare: 50, trigger: 'On disbursement', effectiveFrom: '2026-09-01', effectiveTo: '2027-02-28', clawback: 'No clawback configured.', active: true },
{ id: 'CR-04', partnerId: 'P-03', product: 'Furniture', type: 'Percentage', rate: 1.75, fixedAmount: 0, dealerShare: 65, trigger: 'On disbursement', effectiveFrom: '2026-06-01', effectiveTo: '2026-09-30', clawback: 'Full clawback within 30 days.', active: false }];