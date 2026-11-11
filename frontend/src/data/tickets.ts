import type { SupportTicket } from '../types/finance';

export const tickets: SupportTicket[] = [
{
  id: 'TK-3108', subject: 'Approval timeline for EV scooter case', dealerName: 'Shree Ganesh Electronics & EV', applicationId: 'FA-26-10417', status: 'Awaiting Dealer', priority: 'Medium', assignedTo: 'Kavya Menon', createdAt: '2026-10-12T15:20:00+05:30',
  messages: [
  { from: 'dealer', author: 'Rajesh Agarwal', body: 'Customer is asking when the scooter loan will be approved. Can you share an expected timeline?', time: '2026-10-12T15:20:00+05:30' },
  { from: 'support', author: 'Kavya Menon', body: 'Hi Rajesh, the lender requires a current address proof before review. Once uploaded, operations will resubmit. Final approval timelines are decided by the lender, so we cannot commit to a date.', time: '2026-10-12T17:10:00+05:30' }],

  internalNotes: [{ author: 'Kavya Menon', time: '2026-10-12T17:12:00+05:30', body: 'Linked to doc correction request on FA-26-10417.' }]
},
{
  id: 'TK-3112', subject: 'Delivery blocked pending approval letter', dealerName: 'GreenMile EV Motors', applicationId: 'FA-26-10406', status: 'Open', priority: 'High', assignedTo: 'Unassigned', createdAt: '2026-10-15T08:40:00+05:30',
  messages: [{ from: 'dealer', author: 'Manish Choudhary', body: 'Approval is shown on the portal but we need the lender approval letter for vehicle delivery. Please share.', time: '2026-10-15T08:40:00+05:30', attachment: 'Delivery_note.pdf' }],
  internalNotes: []
},
{
  id: 'TK-3101', subject: 'How to add a second store location?', dealerName: 'Shree Ganesh Electronics & EV', status: 'Resolved', priority: 'Low', assignedTo: 'Kavya Menon', createdAt: '2026-10-03T11:00:00+05:30',
  messages: [
  { from: 'dealer', author: 'Rajesh Agarwal', body: 'We are opening a second outlet in Wakad. Can we use the same dealer account?', time: '2026-10-03T11:00:00+05:30' },
  { from: 'support', author: 'Kavya Menon', body: 'Additional outlets need a separate address verification. Please share the outlet GST registration and address proof via Profile → Business details.', time: '2026-10-03T14:30:00+05:30' }],

  internalNotes: []
},
{
  id: 'TK-3110', subject: 'Invoice re-uploaded for dishwasher case', dealerName: 'Lakshmi Home Appliances', applicationId: 'FA-26-10411', status: 'In Progress', priority: 'Medium', assignedTo: 'Arjun Nair', createdAt: '2026-10-14T13:35:00+05:30',
  messages: [{ from: 'dealer', author: 'Lakshmi Narayanan', body: 'We have re-uploaded the corrected invoice. Please check.', time: '2026-10-14T13:35:00+05:30', attachment: 'Invoice_LHA_2231.pdf' }],
  internalNotes: [{ author: 'Arjun Nair', time: '2026-10-14T15:00:00+05:30', body: 'Verifying invoice GST number against dealer GSTIN.' }]
}];