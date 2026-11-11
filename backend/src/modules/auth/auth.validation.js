import { z } from 'zod';

const document = z.object({ name: z.string().trim().min(1).max(255), sizeKb: z.number().int().positive().max(5120) }).nullable().optional();
export const registerSchema = z.object({
  ownerName: z.string().trim().min(2).max(100), designation: z.string().trim().min(2).max(100),
  mobile: z.string().regex(/^[6-9][0-9]{9}$/, 'Enter a valid 10-digit Indian mobile number'), email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(72).regex(/[0-9]/, 'Password must include a number'), confirmPassword: z.string(),
  businessName: z.string().trim().min(2).max(150), businessType: z.string().trim().min(1).max(80), category: z.string().trim().min(1).max(100),
  yearsInBusiness: z.coerce.number().int().min(0).max(99), address: z.string().trim().min(5).max(300), city: z.string().trim().min(2).max(100),
  state: z.string().trim().min(2).max(100), pincode: z.string().regex(/^[1-9][0-9]{5}$/, 'Enter a valid PIN code'),
  gstin: z.string().trim().toUpperCase().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/, 'Enter a valid GSTIN'),
  pan: z.string().trim().toUpperCase().regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'Enter a valid PAN'), monthlyFinanceVolume: z.string().trim().min(1).max(50),
  docs: z.object({ gst: document, pan: document, shop: document, cheque: document, owner: document, address: document }).partial().optional().default({}),
  agreeTerms: z.literal(true, { error: 'Dealer Terms & Conditions must be accepted' }), agreeConsent: z.literal(true, { error: 'Dealer consent must be accepted' })
}).superRefine((data, context) => {
  if (data.password !== data.confirmPassword) context.addIssue({ code: 'custom', path: ['confirmPassword'], message: 'Passwords do not match' });
  if (data.gstin.slice(2, 12) !== data.pan) context.addIssue({ code: 'custom', path: ['pan'], message: 'PAN must match the PAN embedded in GSTIN' });
});
export const loginSchema = z.object({ email: z.string().trim().toLowerCase().email(), password: z.string().min(1).max(72) });
const password = z.string().min(8).max(72).regex(/[0-9]/, 'Password must include a number');
export const forgotPasswordSchema = z.object({ email: z.string().trim().toLowerCase().email() });
export const resetPasswordSchema = z.object({ token: z.string().min(32), password, confirmPassword: z.string() }).refine((data) => data.password === data.confirmPassword, { path: ['confirmPassword'], message: 'Passwords do not match' });
export const changePasswordSchema = z.object({ currentPassword: z.string().min(1), newPassword: password, confirmPassword: z.string() }).refine((data) => data.newPassword === data.confirmPassword, { path: ['confirmPassword'], message: 'Passwords do not match' });
export const accountStatusSchema = z.object({ active: z.boolean() });
