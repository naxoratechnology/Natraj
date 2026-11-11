import type { ApplicationStatus, FinanceApplication, TimelineEvent } from '../types/finance';

export type Tone = 'neutral' | 'info' | 'warning' | 'success' | 'danger' | 'teal';

const toneMap: Record<string, Tone> = {
  Draft: 'neutral',
  Pending: 'neutral',
  New: 'neutral',
  'Documents Required': 'warning',
  Processing: 'info',
  'Awaiting Lender': 'info',
  Approved: 'teal',
  Rejected: 'danger',
  'Disbursement Pending': 'teal',
  Disbursed: 'success',
  Cancelled: 'neutral',
  Active: 'success',
  Inactive: 'neutral',
  Submitted: 'info',
  'Under Review': 'info',
  Verified: 'teal',
  'Agreement Pending': 'warning',
  Suspended: 'danger',
  Open: 'info',
  'In Progress': 'info',
  'Awaiting Dealer': 'warning',
  Resolved: 'success',
  Uploaded: 'info',
  Missing: 'danger',
  High: 'danger',
  Medium: 'warning',
  Low: 'neutral',
  Manual: 'neutral',
  'Official API — configured': 'success',
  'Future Integration': 'warning',
  Expected: 'teal',
  'Not tracked': 'neutral'
};

export function statusTone(status: string): Tone {
  return toneMap[status] ?? 'neutral';
}

export const statusHex: Record<string, string> = {
  Draft: '#A5B1C2',
  Pending: '#8090A6',
  'Documents Required': '#B7791F',
  Processing: '#2457C5',
  'Awaiting Lender': '#6B8FDB',
  Approved: '#18A999',
  Rejected: '#C2414B',
  'Disbursement Pending': '#7FD1C6',
  Disbursed: '#16845B',
  Cancelled: '#CBD3DE'
};

export const allApplicationStatuses: ApplicationStatus[] = [
'Draft',
'Pending',
'Documents Required',
'Processing',
'Awaiting Lender',
'Approved',
'Rejected',
'Disbursement Pending',
'Disbursed',
'Cancelled'];


export const nextActionFor: Record<ApplicationStatus, string> = {
  Draft: 'Dealer to complete and submit',
  Pending: 'Review documents and assign',
  'Documents Required': 'Dealer to upload requested documents',
  Processing: 'Submit to lender and record reference',
  'Awaiting Lender': 'Follow up with lender for decision',
  Approved: 'Record disbursement instruction',
  Rejected: 'No action — closed',
  'Disbursement Pending': 'Confirm disbursement reference from lender',
  Disbursed: 'No action — closed',
  Cancelled: 'No action — cancelled'
};

const STAGES = [
'Application created',
'Submitted for review',
'Documents verified',
'Processing with lender',
'Lender decision recorded',
'Disbursement pending',
'Disbursement recorded'];


const stageIndex: Record<ApplicationStatus, number> = {
  Draft: 0,
  Pending: 1,
  'Documents Required': 2,
  Processing: 3,
  'Awaiting Lender': 3,
  Approved: 4,
  Rejected: 4,
  'Disbursement Pending': 5,
  Disbursed: 6,
  Cancelled: 1
};

/** Builds a recorded-event timeline from the application's current status. */
export function buildApplicationTimeline(app: FinanceApplication): TimelineEvent[] {
  const created = new Date(app.createdAt).getTime();
  const updated = new Date(app.updatedAt).getTime();
  const at = (i: number) => new Date(Math.min(created + i * 26 * 3600000, updated)).toISOString();
  const current = stageIndex[app.status];
  const events: TimelineEvent[] = [];

  STAGES.forEach((label, i) => {
    if (app.status === 'Rejected' && i > 4) return;
    if (app.status === 'Cancelled' && i > 1) return;
    let state: TimelineEvent['state'] = i < current ? 'done' : i === current ? 'current' : 'upcoming';
    let name = label;
    let note: string | undefined;
    let actor: string | undefined = i <= 1 ? app.dealerName : 'Operations team';

    if (i === 2 && app.status === 'Documents Required') {
      name = 'Documents required';
      state = 'alert';
      note = 'Correction requested by operations. Dealer action needed.';
    }
    if (i === 3) {
      name = app.status === 'Awaiting Lender' ? 'Awaiting lender response' : label;
      note = 'Submitted to lender manually · status recorded by operations';
    }
    if (i === 4) {
      if (app.status === 'Rejected') {
        name = 'Rejected by lender';
        state = 'alert';
        note = app.lenderRemarks ?? 'Lender decision recorded by operations.';
      } else if (current >= 4) {
        name = 'Approved by lender';
        note = 'Decision recorded from lender communication.';
      }
    }
    if (i === 6 && app.status === 'Disbursed') state = 'done';
    if (i === 0 && app.status === 'Draft') {
      state = 'current';
      note = 'Not yet submitted.';
    }
    if (app.status === 'Cancelled' && i === 1) {
      name = 'Application cancelled';
      state = 'alert';
    }
    if (state === 'upcoming') actor = undefined;

    events.push({
      label: name,
      state,
      actor,
      note,
      date: state === 'upcoming' ? undefined : state === 'current' || state === 'alert' ? app.updatedAt : at(i)
    });
  });

  return events;
}