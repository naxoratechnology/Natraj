import type { Customer, DocumentRecord, FinanceApplication } from '../types/finance';

export function applicationDocuments(app: FinanceApplication): DocumentRecord[] {
  const pending = app.status === 'Draft';
  const review = app.status === 'Pending';
  const v: DocumentRecord['verification'] = pending ? 'Pending' : review ? 'Under Review' : 'Verified';
  const base = (id: string, label: string, file: string, size: number): DocumentRecord => ({
    id,
    label,
    fileName: file,
    sizeKb: size,
    uploadStatus: 'Uploaded',
    verification: v,
    uploadedAt: app.createdAt
  });
  const docs: DocumentRecord[] = [
  base('id', 'Customer identity proof', `${app.customerId}_identity.pdf`, 236),
  base('address', 'Current address proof', `${app.customerId}_address.pdf`, 412),
  base('quote', 'Product quotation / proforma invoice', `${app.id}_quotation.pdf`, 188),
  app.financeType === 'New Loan' ?
  base('income', 'Income proof / bank statement (3 months)', `${app.customerId}_bank_statement.pdf`, 1320) :
  { ...base('limit', 'Existing finance / card-limit reference', `${app.id}_limit_reference.pdf`, 96), note: 'Reference document only — card numbers, PINs and CVVs are never collected.' },
  base('photo', 'Customer photograph', `${app.customerId}_photo.jpg`, 310)];

  if (app.status === 'Documents Required') {
    docs[1] = { ...docs[1], verification: 'Rejected', note: 'Address does not match current residence. Upload a recent utility bill or rent agreement.' };
  }
  if (pending) docs[4] = { id: 'photo', label: 'Customer photograph', uploadStatus: 'Missing', verification: 'Pending' };
  return docs;
}

export function customerDocuments(c: Customer): DocumentRecord[] {
  const v: DocumentRecord['verification'] = c.kycStatus === 'Verified' ? 'Verified' : 'Under Review';
  const docs: DocumentRecord[] = [
  { id: 'pan', label: 'PAN card', fileName: `${c.id}_PAN.pdf`, sizeKb: 164, uploadStatus: 'Uploaded', verification: v, uploadedAt: c.createdAt },
  { id: 'aadhaar', label: 'Identity proof (masked Aadhaar)', fileName: `${c.id}_ID_masked.pdf`, sizeKb: 228, uploadStatus: 'Uploaded', verification: v, uploadedAt: c.createdAt },
  { id: 'address', label: 'Address proof', fileName: `${c.id}_address.pdf`, sizeKb: 402, uploadStatus: 'Uploaded', verification: v, uploadedAt: c.createdAt }];

  if (c.kycStatus === 'Documents Required') {
    docs[2] = { ...docs[2], verification: 'Rejected', note: 'Address proof older than 3 months. Upload a recent document.' };
  }
  return docs;
}