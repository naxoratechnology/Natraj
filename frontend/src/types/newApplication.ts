import type { FinanceType, ProductCategory, UploadedFile } from './finance';

export interface ApplicationDraft {
  customerId: string;
  financeType: FinanceType | '';
  category: ProductCategory | '';
  product: string;
  productPrice: string;
  downPayment: string;
  tenure: string;
  partnerId: string;
  docs: Record<string, UploadedFile | null>;
  consent: boolean;
}

export type DraftErrors = Partial<Record<string, string>>;

export interface DraftStepProps {
  draft: ApplicationDraft;
  errors: DraftErrors;
  update: <K extends keyof ApplicationDraft>(key: K, value: ApplicationDraft[K]) => void;
}

export function requiredDocsFor(financeType: FinanceType | '', kycVerified: boolean) {
  return [
  { id: 'id', label: 'Customer identity proof', required: !kycVerified, onFile: kycVerified },
  { id: 'address', label: 'Current address proof', required: !kycVerified, onFile: kycVerified },
  { id: 'quote', label: 'Product quotation / proforma invoice', required: true, onFile: false },
  financeType === 'Existing Finance / Card Limit' ?
  { id: 'limit', label: 'Existing finance / card-limit reference', required: true, onFile: false } :
  { id: 'income', label: 'Income proof / bank statement (3 months)', required: true, onFile: false },
  { id: 'photo', label: 'Customer photograph', required: false, onFile: false }];

}

export function draftAmounts(d: ApplicationDraft) {
  const price = Number(d.productPrice) || 0;
  const down = Number(d.downPayment) || 0;
  return { price, down, amount: Math.max(0, price - down) };
}