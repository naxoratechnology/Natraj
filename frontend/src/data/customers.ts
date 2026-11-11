import type { Customer } from '../types/finance';

/** Illustrative demo customers. Identity details are masked by design. */
export const customers: Customer[] = [
{ id: 'C-2201', dealerId: 'D-1024', name: 'Rohan Kulkarni', phone: '+91 98XXX XX214', email: 'rohan.k@example.com', city: 'Pune', panLast4: '412K', kycStatus: 'Verified', createdAt: '2026-09-30T11:00:00+05:30' },
{ id: 'C-2202', dealerId: 'D-1024', name: 'Priya Deshmukh', phone: '+91 97XXX XX380', email: 'priya.d@example.com', city: 'Pimpri-Chinchwad', panLast4: '781P', kycStatus: 'Documents Required', createdAt: '2026-10-11T13:50:00+05:30' },
{ id: 'C-2203', dealerId: 'D-1024', name: 'Amit Shinde', phone: '+91 99XXX XX052', email: 'amit.shinde@example.com', city: 'Pune', panLast4: '330A', kycStatus: 'Verified', createdAt: '2026-10-08T11:30:00+05:30' },
{ id: 'C-2204', dealerId: 'D-1024', name: 'Sneha Patil', phone: '+91 90XXX XX617', email: 'sneha.patil@example.com', city: 'Hadapsar, Pune', panLast4: '905S', kycStatus: 'Verified', createdAt: '2026-09-28T10:15:00+05:30' },
{ id: 'C-2205', dealerId: 'D-1024', name: 'Vikram Jadhav', phone: '+91 88XXX XX903', email: 'vikram.j@example.com', city: 'Pune', panLast4: '118V', kycStatus: 'Verified', createdAt: '2026-09-26T12:00:00+05:30' },
{ id: 'C-2206', dealerId: 'D-1024', name: 'Anjali Mehta', phone: '+91 98XXX XX771', email: 'anjali.m@example.com', city: 'Kothrud, Pune', panLast4: '264M', kycStatus: 'Pending', createdAt: '2026-10-14T12:00:00+05:30' },
{ id: 'C-2207', dealerId: 'D-1024', name: 'Kiran Pawar', phone: '+91 70XXX XX448', email: 'kiran.pawar@example.com', city: 'Wakad, Pune', panLast4: '657K', kycStatus: 'Verified', createdAt: '2026-09-18T10:30:00+05:30' },
{ id: 'C-2208', dealerId: 'D-1024', name: 'Meera Iyer', phone: '+91 96XXX XX125', email: 'meera.iyer@example.com', city: 'Baner, Pune', panLast4: '093I', kycStatus: 'Pending', createdAt: '2026-10-15T09:50:00+05:30' },
{ id: 'C-2209', dealerId: 'D-1024', name: 'Farhan Shaikh', phone: '+91 93XXX XX506', email: 'farhan.s@example.com', city: 'Pune', panLast4: '442F', kycStatus: 'Verified', createdAt: '2026-08-21T16:00:00+05:30' },
{ id: 'C-2210', dealerId: 'D-1024', name: 'Gauri Naik', phone: '+91 91XXX XX839', email: 'gauri.naik@example.com', city: 'Aundh, Pune', panLast4: '718G', kycStatus: 'Pending', createdAt: '2026-08-12T12:20:00+05:30' },
{ id: 'C-3101', dealerId: 'D-1031', name: 'Harish Gowda', phone: '+91 98XXX XX330', email: 'harish.g@example.com', city: 'Bengaluru', panLast4: '220H', kycStatus: 'Verified', createdAt: '2026-10-13T10:30:00+05:30' },
{ id: 'C-3102', dealerId: 'D-1031', name: 'Ravi Shankar', phone: '+91 97XXX XX112', email: 'ravi.s@example.com', city: 'Bengaluru', panLast4: '571R', kycStatus: 'Verified', createdAt: '2026-10-01T10:00:00+05:30' },
{ id: 'C-3103', dealerId: 'D-1031', name: 'Nisha Rao', phone: '+91 99XXX XX908', email: 'nisha.rao@example.com', city: 'Mysuru', panLast4: '836N', kycStatus: 'Verified', createdAt: '2026-09-22T13:00:00+05:30' },
{ id: 'C-4701', dealerId: 'D-1047', name: 'Sunil Meena', phone: '+91 94XXX XX774', email: 'sunil.m@example.com', city: 'Jaipur', panLast4: '349S', kycStatus: 'Verified', createdAt: '2026-10-10T09:00:00+05:30' },
{ id: 'C-4702', dealerId: 'D-1047', name: 'Pooja Sharma', phone: '+91 95XXX XX261', email: 'pooja.sharma@example.com', city: 'Jaipur', panLast4: '602P', kycStatus: 'Verified', createdAt: '2026-10-05T11:00:00+05:30' },
{ id: 'C-4703', dealerId: 'D-1047', name: 'Arjun Rathore', phone: '+91 86XXX XX450', email: 'arjun.r@example.com', city: 'Ajmer', panLast4: '915A', kycStatus: 'Verified', createdAt: '2026-09-24T09:40:00+05:30' },
{ id: 'C-5201', dealerId: 'D-1052', name: 'Divya Raman', phone: '+91 98XXX XX603', email: 'divya.r@example.com', city: 'Coimbatore', panLast4: '128D', kycStatus: 'Documents Required', createdAt: '2026-10-09T09:30:00+05:30' },
{ id: 'C-5202', dealerId: 'D-1052', name: 'Karthik Subramanian', phone: '+91 90XXX XX387', email: 'karthik.s@example.com', city: 'Coimbatore', panLast4: '473K', kycStatus: 'Pending', createdAt: '2026-10-14T17:00:00+05:30' },
{ id: 'C-5203', dealerId: 'D-1052', name: 'Lavanya Krishnan', phone: '+91 97XXX XX918', email: 'lavanya.k@example.com', city: 'Tiruppur', panLast4: '760L', kycStatus: 'Verified', createdAt: '2026-09-27T12:30:00+05:30' }];