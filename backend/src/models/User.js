import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  sizeKb: { type: Number, required: true, min: 1 },
  publicId: { type: String, required: true },
  secureUrl: { type: String, required: true },
  resourceType: { type: String, required: true },
  format: { type: String, default: '' },
  uploadedAt: { type: Date, default: Date.now }
  ,verificationStatus: { type: String, enum: ['pending', 'under_review', 'verified', 'rejected'], default: 'pending' },
  note: { type: String, default: '' }
}, { _id: false });
const statusHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  actorName: { type: String, required: true },
  note: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
}, { _id: false });
const documentRequestSchema = new mongoose.Schema({
  documentTypes: [{ type: String, enum: ['gst', 'pan', 'shop', 'cheque', 'owner', 'address'] }],
  note: { type: String, required: true },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requestedAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date, default: null }
}, { _id: true });
const dealerProfileSchema = new mongoose.Schema({
  designation: { type: String, required: true, trim: true }, mobile: { type: String, required: true, trim: true },
  businessName: { type: String, required: true, trim: true }, businessType: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true }, yearsInBusiness: { type: Number, required: true, min: 0 },
  address: { type: String, required: true, trim: true }, city: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true }, pincode: { type: String, required: true, trim: true },
  gstin: { type: String, required: true, uppercase: true, trim: true }, pan: { type: String, required: true, uppercase: true, trim: true },
  monthlyFinanceVolume: { type: String, required: true, trim: true }, documents: { type: Map, of: documentSchema, default: undefined },
  registrationReference: { type: String, required: true, unique: true, sparse: true },
  status: { type: String, enum: ['submitted', 'under_review', 'documents_required', 'verified', 'agreement_pending', 'active', 'suspended', 'rejected'], default: 'submitted' },
  statusHistory: { type: [statusHistorySchema], default: [] },
  documentRequests: { type: [documentRequestSchema], default: [] },
  verificationChecklist: { type: [String], default: [] },
  agreement: {
    version: { type: String, default: '1.0' },
    acceptedAt: { type: Date, default: null },
    acceptedIp: { type: String, default: '' }
  }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false }, role: { type: String, enum: ['super_admin', 'admin', 'dealer'], required: true },
  permissions: { type: [String], enum: ['dashboard', 'dealers', 'customers', 'applications', 'manual_processing', 'finance_partners', 'commissions', 'reports', 'notifications', 'support', 'audit_logs'], default: [] },
  accessRole: { type: mongoose.Schema.Types.ObjectId, ref: 'AccessRole', default: null },
  accessRoleName: { type: String, default: '', trim: true },
  active: { type: Boolean, default: true },
  failedLoginAttempts: { type: Number, default: 0 },
  lockedUntil: { type: Date, default: null },
  passwordChangedAt: { type: Date, default: null },
  dealerProfile: { type: dealerProfileSchema, default: undefined }
}, { timestamps: true });
export const User = mongoose.model('User', userSchema);
