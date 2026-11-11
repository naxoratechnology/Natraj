import mongoose from 'mongoose';

const authSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  refreshTokenHash: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
  revokedAt: { type: Date, default: null },
  ip: { type: String, default: '' },
  userAgent: { type: String, default: '' },
  lastUsedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const AuthSession = mongoose.model('AuthSession', authSessionSchema);
