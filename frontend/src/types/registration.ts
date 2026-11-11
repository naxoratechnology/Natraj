import type { UploadedFile } from './finance';

export interface RegistrationData {
  ownerName: string;
  designation: string;
  mobile: string;
  email: string;
  password: string;
  confirmPassword: string;
  businessName: string;
  businessType: string;
  category: string;
  yearsInBusiness: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstin: string;
  pan: string;
  monthlyFinanceVolume: string;
  docs: Record<string, UploadedFile | null>;
  agreeTerms: boolean;
  agreeConsent: boolean;
}

export type RegistrationErrors = Partial<Record<string, string>>;

export interface RegistrationStepProps {
  data: RegistrationData;
  errors: RegistrationErrors;
  update: <K extends keyof RegistrationData>(key: K, value: RegistrationData[K]) => void;
}

export const registrationDocuments = [
{ id: 'gst', label: 'GST registration certificate', required: false },
{ id: 'pan', label: 'Business PAN card', required: false },
{ id: 'shop', label: 'Shop & establishment licence', required: false },
{ id: 'cheque', label: 'Cancelled cheque', required: false },
{ id: 'owner', label: 'Owner identity proof', required: false },
{ id: 'address', label: 'Business address proof', required: false }];
