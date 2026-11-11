import mongoose from 'mongoose';

export const permissionValues = ['dashboard', 'dealers', 'customers', 'applications', 'manual_processing', 'finance_partners', 'commissions', 'reports', 'notifications', 'support', 'audit_logs'];

const accessRoleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, default: '', trim: true },
  permissions: { type: [String], enum: permissionValues, required: true },
  active: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export const AccessRole = mongoose.model('AccessRole', accessRoleSchema);
