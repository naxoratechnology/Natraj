export type FinanceType = 'New Loan' | 'Existing Finance / Card Limit';
export type ProductCategory = 'EV' | 'Electronics' | 'Furniture' | 'Consumer Durables';

export type ApplicationStatus =
'Draft' |
'Pending' |
'Documents Required' |
'Processing' |
'Awaiting Lender' |
'Approved' |
'Rejected' |
'Disbursement Pending' |
'Disbursed' |
'Cancelled';

export interface FinanceApplication {
  id: string;
  dealerId: string;
  dealerName: string;
  customerId: string;
  customerName: string;
  category: ProductCategory;
  product: string;
  financeType: FinanceType;
  partnerId: string;
  partnerName: string;
  productPrice: number;
  downPayment: number;
  amount: number;
  tenureMonths?: number;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  nextAction: string;
  lenderRef?: string;
  lenderRemarks?: string;
  assignedTo?: string;
  followUp?: string;
  disbursedAmount?: number;
  disbursementRef?: string;
  disbursementDate?: string;
}

export type KycStatus = 'Verified' | 'Pending' | 'Documents Required';

export interface Customer {
  id: string;
  dealerId: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  panLast4: string;
  kycStatus: KycStatus;
  createdAt: string;
}

export type DealerStatus =
'Draft' |
'Submitted' |
'Under Review' |
'Documents Required' |
'Verified' |
'Agreement Pending' |
'Approved' |
'Active' |
'Rejected' |
'Suspended';

export interface DocumentRecord {
  id: string;
  label: string;
  fileName?: string;
  sizeKb?: number;
  uploadStatus: 'Uploaded' | 'Missing';
  verification: 'Verified' | 'Under Review' | 'Rejected' | 'Pending';
  uploadedAt?: string;
  note?: string;
}

export interface StatusHistoryEntry {
  status: string;
  date: string;
  by: string;
  note?: string;
}

export interface InternalNote {
  author: string;
  time: string;
  body: string;
}

export interface Dealer {
  id: string;
  businessName: string;
  ownerName: string;
  category: string;
  city: string;
  state: string;
  email: string;
  phone: string;
  gstin: string;
  panMasked: string;
  status: DealerStatus;
  submittedAt: string;
  customers: number;
  applications: number;
  documents: DocumentRecord[];
  corrections: InternalNote[];
  notes: InternalNote[];
  history: StatusHistoryEntry[];
}

export type ProcessingMode = 'Manual' | 'Official API — configured' | 'Future Integration';
export type PartnerType = 'Banking' | 'NBFC' | 'Consumer Finance' | 'Credit Card / EMI' | 'EV Finance';

export interface FinancePartner {
  id: string;
  name: string;
  type: PartnerType;
  categories: ProductCategory[];
  financeTypes: FinanceType[];
  mode: ProcessingMode;
  priority: number;
  active: boolean;
  notes: string;
}

export interface TimelineEvent {
  label: string;
  date?: string;
  actor?: string;
  note?: string;
  state: 'done' | 'current' | 'upcoming' | 'alert';
}

export interface AppNote {
  id: string;
  appId: string;
  author: string;
  body: string;
  time: string;
  internal: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  type: string;
  link?: string;
}

export interface TicketMessage {
  from: 'dealer' | 'support';
  author: string;
  body: string;
  time: string;
  attachment?: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  dealerName: string;
  applicationId?: string;
  status: 'Open' | 'In Progress' | 'Awaiting Dealer' | 'Resolved';
  priority: 'High' | 'Medium' | 'Low';
  assignedTo: string;
  createdAt: string;
  messages: TicketMessage[];
  internalNotes: InternalNote[];
}

export interface CommissionRule {
  id: string;
  partnerId: string;
  product: ProductCategory | 'All categories';
  type: 'Percentage' | 'Fixed Amount';
  rate: number;
  fixedAmount: number;
  dealerShare: number;
  trigger: 'On disbursement' | 'On approval' | 'On lender payout confirmation';
  effectiveFrom: string;
  effectiveTo: string;
  clawback: string;
  active: boolean;
}

export interface UploadedFile {
  name: string;
  sizeKb: number;
  file?: File;
}
