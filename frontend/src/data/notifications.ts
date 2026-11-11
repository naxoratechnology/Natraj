import type { NotificationItem } from '../types/finance';

export const dealerNotifications: NotificationItem[] = [
{ id: 'N-1', type: 'Documents', title: 'Document correction requested', body: 'FA-26-10417 · Current address proof is required for Priya Deshmukh.', time: '2026-10-13T11:45:00+05:30', read: false, link: '/dealer/applications/FA-26-10417' },
{ id: 'N-2', type: 'Status', title: 'Status updated to Processing', body: 'FA-26-10418 · Submitted to Udaan Consumer Finance by operations.', time: '2026-10-14T16:05:00+05:30', read: false, link: '/dealer/applications/FA-26-10418' },
{ id: 'N-3', type: 'Status', title: 'Disbursement pending', body: 'FA-26-10402 · Lender approval recorded. Awaiting disbursement confirmation.', time: '2026-10-13T12:40:00+05:30', read: false, link: '/dealer/applications/FA-26-10402' },
{ id: 'N-4', type: 'Support', title: 'Support replied to your ticket', body: 'TK-3108 · "Approval timeline for EV scooter case"', time: '2026-10-12T17:10:00+05:30', read: true, link: '/dealer/support' },
{ id: 'N-5', type: 'Status', title: 'Lender approval recorded', body: 'FA-26-10409 · Approval recorded for Amit Shinde.', time: '2026-10-12T17:20:00+05:30', read: true, link: '/dealer/applications/FA-26-10409' },
{ id: 'N-6', type: 'Account', title: 'Trade licence renewal reminder', body: 'Your shop & establishment licence expires on 14 Nov 2026.', time: '2026-10-10T09:00:00+05:30', read: true, link: '/dealer/onboarding' },
{ id: 'N-7', type: 'Status', title: 'Application disbursed', body: 'FA-26-10396 · Disbursement reference recorded by operations.', time: '2026-10-06T16:30:00+05:30', read: true, link: '/dealer/applications/FA-26-10396' }];


export const adminNotifications: NotificationItem[] = [
{ id: 'AN-1', type: 'Dealers', title: 'New dealer submission', body: 'Metro Digital World (Lucknow) submitted registration DLR-26-58814.', time: '2026-10-14T18:20:00+05:30', read: false, link: '/admin/dealers/D-1058' },
{ id: 'AN-2', type: 'Applications', title: 'New finance application', body: 'FA-26-10422 · Lakshmi Home Appliances · ₹1,50,000', time: '2026-10-15T09:10:00+05:30', read: false, link: '/admin/applications/FA-26-10422' },
{ id: 'AN-3', type: 'Applications', title: 'Follow-up due today', body: 'FA-26-10415 · Awaiting VoltDrive EV Finance decision for 3 days.', time: '2026-10-15T09:00:00+05:30', read: false, link: '/admin/manual-processing' },
{ id: 'AN-4', type: 'Support', title: 'High-priority ticket opened', body: 'TK-3112 · GreenMile EV Motors · Delivery blocked pending approval letter.', time: '2026-10-15T08:40:00+05:30', read: false, link: '/admin/support' },
{ id: 'AN-5', type: 'Dealers', title: 'Pending verification', body: 'Sai Comfort Furnishings has been under review for 2 days.', time: '2026-10-15T08:00:00+05:30', read: true, link: '/admin/dealers/D-1063' },
{ id: 'AN-6', type: 'Documents', title: 'Document correction uploaded', body: 'FA-26-10411 · Lakshmi Home Appliances re-uploaded invoice copy.', time: '2026-10-14T13:30:00+05:30', read: true, link: '/admin/applications/FA-26-10411' },
{ id: 'AN-7', type: 'Applications', title: 'Status changed to Approved', body: 'FA-26-10406 · Recorded by Arjun Nair.', time: '2026-10-13T14:00:00+05:30', read: true, link: '/admin/applications/FA-26-10406' }];