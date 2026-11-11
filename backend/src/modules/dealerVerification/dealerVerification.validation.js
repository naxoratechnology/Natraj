import { z } from 'zod';

const documentType = z.enum(['gst', 'pan', 'shop', 'cheque', 'owner', 'address']);
export const documentRequestSchema = z.object({ documentTypes: z.array(documentType).min(1), note: z.string().trim().min(3).max(500) });
export const verificationSchema = z.object({ checklist: z.array(z.string().trim().min(2)).min(1) });
export const reasonSchema = z.object({ reason: z.string().trim().min(3).max(500) });
