import mongoose from 'mongoose';

const loginAttemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  email: { type: String, required: true, lowercase: true, index: true },
  successful: { type: Boolean, required: true },
  reason: { type: String, required: true },
  ip: { type: String, default: '' },
  userAgent: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 90 }
}, { versionKey: false });

export const LoginAttempt = mongoose.model('LoginAttempt', loginAttemptSchema);
