export const adminRoles = [
'Super Admin',
'Operations Admin',
'Verification Admin',
'Finance Operations',
'Support Admin',
'Report Viewer'] as
const;

export type AdminRole = (typeof adminRoles)[number];

export const adminUsers: {id: string;name: string;email: string;role: AdminRole;status: 'Active' | 'Inactive';lastActive: string;}[] = [
{ id: 'U-01', name: 'Vivek Malhotra', email: 'vivek.m@natrajmobile.example', role: 'Super Admin', status: 'Active', lastActive: '2026-10-15T14:10:00+05:30' },
{ id: 'U-02', name: 'Neha Joshi', email: 'admin@natrajmobile.example', role: 'Operations Admin', status: 'Active', lastActive: '2026-10-15T15:28:00+05:30' },
{ id: 'U-03', name: 'Priyanka Rao', email: 'priyanka.rao@natrajmobile.example', role: 'Verification Admin', status: 'Active', lastActive: '2026-10-15T12:45:00+05:30' },
{ id: 'U-04', name: 'Arjun Nair', email: 'arjun.nair@natrajmobile.example', role: 'Finance Operations', status: 'Active', lastActive: '2026-10-15T15:02:00+05:30' },
{ id: 'U-05', name: 'Kavya Menon', email: 'kavya.menon@natrajmobile.example', role: 'Support Admin', status: 'Active', lastActive: '2026-10-15T11:20:00+05:30' },
{ id: 'U-06', name: 'Sanjay Gupta', email: 'sanjay.g@natrajmobile.example', role: 'Report Viewer', status: 'Active', lastActive: '2026-10-13T17:00:00+05:30' },
{ id: 'U-07', name: 'Ritu Kapoor', email: 'ritu.k@natrajmobile.example', role: 'Finance Operations', status: 'Inactive', lastActive: '2026-08-30T10:00:00+05:30' }];


export const permissionModules = [
'Dealers & verification',
'Customers',
'Finance applications',
'Manual processing',
'Finance partners',
'Commission & payouts',
'Reports & export',
'Support tickets',
'Users & roles',
'Audit logs',
'System settings'];


export type PermissionLevel = 'Full' | 'Edit' | 'View' | 'None';

/** Rows follow permissionModules; columns follow adminRoles. */
export const permissionMatrix: PermissionLevel[][] = [
['Full', 'Edit', 'Full', 'View', 'View', 'None'],
['Full', 'Edit', 'View', 'View', 'View', 'None'],
['Full', 'Full', 'View', 'Edit', 'View', 'View'],
['Full', 'Full', 'None', 'Full', 'None', 'None'],
['Full', 'Edit', 'None', 'View', 'None', 'None'],
['Full', 'Edit', 'None', 'View', 'None', 'None'],
['Full', 'Full', 'View', 'Full', 'View', 'View'],
['Full', 'Edit', 'View', 'View', 'Full', 'None'],
['Full', 'View', 'None', 'None', 'None', 'None'],
['Full', 'View', 'None', 'None', 'None', 'None'],
['Full', 'None', 'None', 'None', 'None', 'None']];


export const auditLogs = [
{ id: 'AL-9921', time: '2026-10-15T15:28:00+05:30', user: 'Neha Joshi', role: 'Operations Admin', action: 'Viewed protected document', module: 'Finance applications', ref: 'FA-26-10418' },
{ id: 'AL-9920', time: '2026-10-15T15:02:00+05:30', user: 'Arjun Nair', role: 'Finance Operations', action: 'Set follow-up date', module: 'Manual processing', ref: 'FA-26-10420' },
{ id: 'AL-9919', time: '2026-10-15T14:10:00+05:30', user: 'Vivek Malhotra', role: 'Super Admin', action: 'Updated commission rule', module: 'Commission & payouts', ref: 'CR-02' },
{ id: 'AL-9918', time: '2026-10-15T12:45:00+05:30', user: 'Priyanka Rao', role: 'Verification Admin', action: 'Added internal note', module: 'Dealers & verification', ref: 'D-1063' },
{ id: 'AL-9917', time: '2026-10-15T11:20:00+05:30', user: 'Kavya Menon', role: 'Support Admin', action: 'Replied to ticket', module: 'Support tickets', ref: 'TK-3108' },
{ id: 'AL-9916', time: '2026-10-14T16:05:00+05:30', user: 'Neha Joshi', role: 'Operations Admin', action: 'Status changed: Pending → Processing', module: 'Finance applications', ref: 'FA-26-10418' },
{ id: 'AL-9915', time: '2026-10-14T15:20:00+05:30', user: 'Arjun Nair', role: 'Finance Operations', action: 'Recorded lender reference', module: 'Manual processing', ref: 'FA-26-10420' },
{ id: 'AL-9914', time: '2026-10-14T10:30:00+05:30', user: 'Priyanka Rao', role: 'Verification Admin', action: 'Status changed: Submitted → Under Review', module: 'Dealers & verification', ref: 'D-1063' },
{ id: 'AL-9913', time: '2026-10-13T14:00:00+05:30', user: 'Arjun Nair', role: 'Finance Operations', action: 'Status changed: Awaiting Lender → Approved', module: 'Finance applications', ref: 'FA-26-10406' },
{ id: 'AL-9912', time: '2026-10-13T11:45:00+05:30', user: 'Neha Joshi', role: 'Operations Admin', action: 'Requested documents', module: 'Finance applications', ref: 'FA-26-10417' },
{ id: 'AL-9911', time: '2026-10-13T09:30:00+05:30', user: 'Vivek Malhotra', role: 'Super Admin', action: 'Deactivated user', module: 'Users & roles', ref: 'U-07' },
{ id: 'AL-9910', time: '2026-10-12T17:20:00+05:30', user: 'Neha Joshi', role: 'Operations Admin', action: 'Status changed: Awaiting Lender → Approved', module: 'Finance applications', ref: 'FA-26-10409' },
{ id: 'AL-9909', time: '2026-10-12T13:00:00+05:30', user: 'Arjun Nair', role: 'Finance Operations', action: 'Status changed: Processing → Awaiting Lender', module: 'Manual processing', ref: 'FA-26-10415' },
{ id: 'AL-9908', time: '2026-10-10T15:00:00+05:30', user: 'Priyanka Rao', role: 'Verification Admin', action: 'Requested dealer documents', module: 'Dealers & verification', ref: 'D-1066' },
{ id: 'AL-9907', time: '2026-10-09T14:01:00+05:30', user: 'Priyanka Rao', role: 'Verification Admin', action: 'Dealer verified', module: 'Dealers & verification', ref: 'D-1069' }];
