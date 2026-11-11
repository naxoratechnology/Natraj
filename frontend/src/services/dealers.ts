import { authenticatedRequest } from './auth';
import type { Dealer, DealerStatus, DocumentRecord } from '../types/finance';
import { registrationDocuments } from '../types/registration';

export type DealerApiStatus = 'submitted' | 'under_review' | 'documents_required' | 'verified' | 'agreement_pending' | 'active' | 'suspended' | 'rejected';
export interface BackendDealer {
  id: string; dealerCode: string; name: string; email: string; status: DealerApiStatus; designation: string; mobile: string;
  businessName: string; businessType: string; category: string; yearsInBusiness: number; address: string; city: string;
  state: string; pincode: string; gstin: string; pan: string; monthlyFinanceVolume: string;
  documents: Record<string, { name: string; sizeKb: number; verificationStatus: string; note: string; uploadedAt: string; url: string }>;
  documentRequests: Array<{ documentTypes: string[]; note: string; requestedAt: string; resolvedAt?: string }>;
  statusHistory: Array<{ status: DealerApiStatus; actorName: string; note?: string; createdAt: string }>;
  verificationChecklist: string[]; agreement?: { version: string; acceptedAt?: string }; submittedAt: string; updatedAt: string;
}

const statusLabel: Record<DealerApiStatus, DealerStatus> = {
  submitted: 'Submitted', under_review: 'Under Review', documents_required: 'Documents Required', verified: 'Verified',
  agreement_pending: 'Agreement Pending', active: 'Active', suspended: 'Suspended', rejected: 'Rejected'
};

export function toUiDealer(dealer: BackendDealer): Dealer {
  const documents: DocumentRecord[] = registrationDocuments.map((definition) => {
    const document = dealer.documents[definition.id];
    return {
      id: definition.id, label: definition.label, fileName: document?.name, sizeKb: document?.sizeKb,
      uploadStatus: document ? 'Uploaded' : 'Missing',
      verification: document ? ({ pending: 'Pending', under_review: 'Under Review', verified: 'Verified', rejected: 'Rejected' }[document.verificationStatus] || 'Pending') as DocumentRecord['verification'] : 'Pending',
      uploadedAt: document?.uploadedAt, note: document?.note || undefined
    };
  });
  return {
    id: dealer.id, businessName: dealer.businessName, ownerName: dealer.name, category: dealer.category,
    city: dealer.city, state: dealer.state, email: dealer.email, phone: `+91 ${dealer.mobile}`,
    gstin: dealer.gstin, panMasked: `${dealer.pan.slice(0, 2)}XXX${dealer.pan.slice(5)}`,
    status: statusLabel[dealer.status], submittedAt: dealer.submittedAt, customers: 0, applications: 0, documents,
    corrections: dealer.documentRequests.map((request) => ({ author: 'Verification team', time: request.requestedAt, body: request.note })),
    notes: [], history: dealer.statusHistory.map((item) => ({ status: statusLabel[item.status], date: item.createdAt, by: item.actorName, note: item.note }))
  };
}

export const getMyDealer = () => authenticatedRequest<{ dealer: BackendDealer }>('/dealers/me');
export const updateMyDealerProfile = (body: { name: string; designation: string; mobile: string }) => authenticatedRequest<{ dealer: BackendDealer }>('/dealers/me/profile', { method: 'PATCH', body: JSON.stringify(body) });
export const acceptDealerAgreement = () => authenticatedRequest<{ dealer: BackendDealer }>('/dealers/me/agreement/accept', { method: 'POST' });
export function uploadDealerDocument(documentType: string, file: File) {
  const body = new FormData(); body.append('document', file);
  return authenticatedRequest<{ dealer: BackendDealer }>(`/dealers/me/documents/${documentType}`, { method: 'POST', body, headers: {} });
}
export const listBackendDealers = () => authenticatedRequest<{ dealers: BackendDealer[] }>('/admin/dealers');
export const getBackendDealer = (id: string) => authenticatedRequest<{ dealer: BackendDealer }>(`/admin/dealers/${id}`);
export const dealerAdminAction = (id: string, action: string, body?: object) => authenticatedRequest<{ dealer: BackendDealer }>(`/admin/dealers/${id}/${action}`, { method: 'POST', body: body ? JSON.stringify(body) : undefined });
